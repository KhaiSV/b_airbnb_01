USE DB_Airbnb;
GO

CREATE OR ALTER PROCEDURE P_CreateAuctionForBooking
    @HomestayID         Char(20),
    @BK_DateStart       Date,
    @BK_DateEnd         Date,
    @A_StartPrice       Int,
    @A_StepPrice        Int,
    @A_StartTime        Datetime
AS
BEGIN
    SET NOCOUNT ON;

    -- Tạo BookingID mới
    DECLARE @NextBookingNumber BIGINT;
    SELECT @NextBookingNumber = 
        ISNULL(MAX(CAST(SUBSTRING(BookingID, 3, 28) AS BIGINT)), 0) + 1
    FROM BOOKING;

    DECLARE @NewBookingID CHAR(30);
    SET @NewBookingID = 'BK' + RIGHT(REPLICATE('0', 28) + CAST(@NextBookingNumber AS VARCHAR(28)), 28);

    -- Tạo AuctionID mới
    DECLARE @NextAuctionNumber BIGINT;
    SELECT @NextAuctionNumber = 
        ISNULL(MAX(CAST(SUBSTRING(AuctionID, 3, 18) AS BIGINT)), 0) + 1
    FROM AUCTION;

    DECLARE @NewAuctionID CHAR(20);
    SET @NewAuctionID = 'AU' + RIGHT(REPLICATE('0', 18) + CAST(@NextAuctionNumber AS VARCHAR(18)), 18);

    -- Insert vào bảng BOOKING
    INSERT INTO BOOKING (
        BookingID, AccountID, HomestayID, BK_DateStart, BK_DateEnd,
        BK_DateBook, BK_Adults, BK_Children, BK_Infants, BK_Pets, BK_Status
    ) VALUES (
        @NewBookingID, NULL, @HomestayID, @BK_DateStart, @BK_DateEnd,
        GETDATE(), @BK_Adults, @BK_Children, @BK_Infants, @BK_Pets, 'Pending'
    );

    -- Insert vào bảng AUCTION
    INSERT INTO AUCTION (
        AuctionID, BookingID, A_StartPrice, A_CurrentPrice, A_StepPrice,
        A_StartTime, A_EndTime, A_WinnerAccountID, A_Status
    ) VALUES (
        @NewAuctionID, @NewBookingID, @A_StartPrice, @A_StartPrice, @A_StepPrice,
        @A_StartTime, NULL, NULL, 'Open'
    );
END;
GO

CREATE OR ALTER PROCEDURE sp_PlaceAuctionBid
    @AuctionID      Char(20),
    @AccountID      Char(10),
    @BD_Amount      Int,
    @BK_Adults      Int,
    @BK_Children    Int,
    @BK_Infants     Int,
    @BK_Pets        Int
AS
BEGIN
    SET NOCOUNT ON;

    -- Tạo BidID mới
    DECLARE @NextBidNumber BIGINT;
    SELECT @NextBidNumber = 
        ISNULL(MAX(CAST(SUBSTRING(BidID, 3, 8) AS BIGINT)), 0) + 1
    FROM AUCTION_BID;

    DECLARE @NewBidID CHAR(10);
    SET @NewBidID = 'BI' + RIGHT(REPLICATE('0', 8) + CAST(@NextBidNumber AS VARCHAR(8)), 8);

    -- Kiểm tra xem AuctionID có tồn tại và đang ở trạng thái Open
    IF EXISTS (
        SELECT 1
        FROM AUCTION
        WHERE AuctionID = @AuctionID
        AND A_Status = 'Open'
    )
    BEGIN
        -- Insert vào bảng AUCTION_BID
        INSERT INTO AUCTION_BID (
            BidID, AuctionID, AccountID, BD_Time, BD_Amount,
            BK_Adults, BK_Children, BK_Infants, BK_Pets
        ) VALUES (
            @NewBidID, @AuctionID, @AccountID, GETDATE(), @BD_Amount,
            @BK_Adults, @BK_Children, @BK_Infants, @BK_Pets
        );
    END
    ELSE
    BEGIN
        RAISERROR ('Phiên đấu giá không tồn tại hoặc đã đóng.', 16, 1);
        RETURN;
    END
END;
GO

CREATE OR ALTER TRIGGER tr_CheckAuctionBid
ON AUCTION_BID
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @AuctionID Char(20);
    DECLARE @AccountID Char(10);
    DECLARE @BD_Amount Int;
    DECLARE @BK_Adults Int;
    DECLARE @BK_Children Int;
    DECLARE @BK_Infants Int;
    DECLARE @BK_Pets Int;
    DECLARE @A_CurrentPrice Int;
    DECLARE @A_StepPrice Int;
    DECLARE @MaxAdults Int;
    DECLARE @MaxChildren Int;
    DECLARE @MaxInfants Int;
    DECLARE @MaxPets Int;

    -- Lấy thông tin từ bản ghi vừa insert
    SELECT 
        @AuctionID = i.AuctionID,
        @AccountID = i.AccountID,
        @BD_Amount = i.BD_Amount,
        @BK_Adults = i.BK_Adults,
        @BK_Children = i.BK_Children,
        @BK_Infants = i.BK_Infants,
        @BK_Pets = i.BK_Pets
    FROM inserted i;

    -- Lấy thông tin A_CurrentPrice và A_StepPrice từ bảng AUCTION
    SELECT 
        @A_CurrentPrice = A_CurrentPrice,
        @A_StepPrice = A_StepPrice
    FROM AUCTION
    WHERE AuctionID = @AuctionID;

    -- Lấy thông tin giới hạn từ bảng BOOKING thông qua AUCTION
    SELECT 
        @MaxAdults = b.BK_Adults,
        @MaxChildren = b.BK_Children,
        @MaxInfants = b.BK_Infants,
        @MaxPets = b.BK_Pets
    FROM BOOKING b
    INNER JOIN AUCTION a ON b.BookingID = a.BookingID
    WHERE a.AuctionID = @AuctionID;

    -- Kiểm tra BD_Amount phải lớn hơn A_CurrentPrice
    IF @BD_Amount <= @A_CurrentPrice
    BEGIN
        RAISERROR ('Số tiền đặt giá phải lớn hơn giá hiện tại.', 16, 1);
        ROLLBACK;
        RETURN;
    END

    -- Kiểm tra BD_Amount phải là bội số của A_StepPrice so với A_CurrentPrice
    IF (@BD_Amount - @A_CurrentPrice) % @A_StepPrice != 0
    BEGIN
        RAISERROR ('Số tiền đặt giá phải tăng đúng bước giá quy định.', 16, 1);
        ROLLBACK;
        RETURN;
    END

    -- Kiểm tra giới hạn BK_Adults, BK_Children, BK_Infants, BK_Pets
    IF @BK_Adults > @MaxAdults OR @BK_Children > @MaxChildren OR 
       @BK_Infants > @MaxInfants OR @BK_Pets > @MaxPets
    BEGIN
        RAISERROR ('Số lượng người hoặc vật nuôi vượt quá giới hạn cho phép.', 16, 1);
        ROLLBACK;
        RETURN;
    END

    -- Cập nhật A_CurrentPrice và A_WinnerAccountID trong bảng AUCTION
    UPDATE AUCTION
    SET 
        A_CurrentPrice = @BD_Amount,
        A_WinnerAccountID = @AccountID
    WHERE AuctionID = @AuctionID;
END;
GO