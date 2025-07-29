USE DB_Airbnb;

-- Function
GO
CREATE OR ALTER PROCEDURE F_INSERT_BOOKING
	@AccountID		CHAR(10),
	@HomestayID		CHAR(20),
	@B_DateStart	DATE,
	@B_DateEnd		DATE,
	@B_Adults		INT,
	@B_Children		INT,
	@B_Infants		INT,
	@B_Pets			INT
AS
BEGIN
	SET NOCOUNT ON;

	DECLARE @NextNumber BIGINT;
	SELECT @NextNumber = 
		ISNULL(MAX(CAST(SUBSTRING(BookingID, 3, 18) AS BIGINT)), 0) + 1
	FROM BOOKING;

	DECLARE @NewBookingID CHAR(20);
	SET @NewBookingID = 'BK' + RIGHT(REPLICATE('0', 18) + CAST(@NextNumber AS VARCHAR(18)), 18);

	INSERT INTO BOOKING (
		BookingID, AccountID, HomestayID,
		B_DateStart, B_DateEnd, B_DateBook,
		B_Adults, B_Children, B_Infants, B_Pets,
		B_Status
	) VALUES (
		@NewBookingID, @AccountID, @HomestayID,
		@B_DateStart, @B_DateEnd, GETDATE(),
		@B_Adults, @B_Children, @B_Infants, @B_Pets,
		'Pending'
	);
END;


-- Trigger
GO
CREATE OR ALTER TRIGGER T_PAYMENT_BOOKING
ON PAYMENT
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE b
    SET b.B_Status = 'Paid'
    FROM BOOKING b
    JOIN inserted i ON i.BookingID = b.BookingID
    JOIN deleted d ON d.BookingID = b.BookingID
    WHERE 
        d.PAY_Status <> 'Paid' AND
        i.PAY_Status = 'Paid';
END;

/*
SELECT * FROM HOMESTAY;
SELECT * FROM ACCOUNT;
SELECT * FROM BOOKING;
SELECT * FROM PAYMENT;
*/
/*
DELETE FROM BOOKING;
DELETE FROM ACCOUNT;
DELETE FROM HOMESTAY;
*/
