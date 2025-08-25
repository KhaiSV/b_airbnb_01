/*
-- Xóa database cũ
USE master;
GO
ALTER DATABASE DB_Airbnb SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
GO
DROP DATABASE DB_Airbnb;
GO
*/

GO
USE master
GO
CREATE DATABASE DB_Airbnb;
GO
USE DB_Airbnb;
GO

-- Tạo Bảng
CREATE TABLE HOST (
	HostID				Char(10),
	HO_Password			Varchar(255),
	HO_Firstname		Nvarchar(50),
	HO_Lastname			Nvarchar(50),
	HO_Sex				Char CHECK (HO_Sex IN ('M', 'F', 'O')),
	HO_AboutMe			Nvarchar(MAX),
	HO_Description		Nvarchar(MAX),
	HO_DateOfBirth		Date,
	HO_Email			Varchar(50),
	HO_DateCreateAcc	Date,
	HO_AvgRating		Float,
	HO_NumOfReview		Int,
	--HO_Avatar
	HO_Status			Varchar(20) CHECK (HO_Status IN (
							'Normal',      -- Host bình thường
							'Banned'       -- Host bị cấm, cấm toàn bộ homestay của host này
						)),
	PRIMARY KEY (HostID)
);

CREATE TABLE HOMESTAY (
	HomestayID			Char(20),
	HostID				Char(10),
	HS_ShortName		Nvarchar(50),
	HS_LongName			Nvarchar(255),
	HS_Address			Nvarchar(MAX),
	HS_BasePrice		Int,
	HS_CurrentPrice		Int,
	HS_NumOfDays		Int,
	HS_AvgRating		Float,
	HS_NumOfReview		Int,
	HS_ListOfImage		Nvarchar(MAX),
	HS_Room				Nvarchar(MAX),
	HS_Description		Nvarchar(MAX),
	HS_Amenity			Nvarchar(MAX),
	HS_Status			Varchar(20) CHECK (HS_Status IN (
							'Normal',      -- Homestay bình thường
							'Banned'       -- Homestay bị cấm, không hiển thị
						)),
	HS_Adults			Int,
	HS_Children			Int,
	HS_Infants			Int,
	HS_Pets				Int,
	PRIMARY KEY (HomestayID)
);

CREATE TABLE ACCOUNT (
	AccountID			Char(10),
	AC_Username			Varchar(50) UNIQUE,
	AC_Password			Varchar(255),
	AC_Firstname		Nvarchar(50),
	AC_Lastname			Nvarchar(50),
	AC_Sex				Char CHECK (AC_Sex IN ('M', 'F', 'O')),
	AC_DateOfBirth		Date,
	AC_Email			Varchar(50),
	AC_DateCreateAcc	Date,
	--AC_Avatar
	AC_Status			Varchar(20) CHECK (AC_Status IN (
							'Normal',      -- Tài khoản dùng bình thường
							'Banned'       -- Tài khoản bị khóa
						)),
	AC_Role              Varchar(20) CHECK (AC_Role IN ('user', 'admin')) DEFAULT 'user',
	PRIMARY KEY (AccountID)
);

CREATE TABLE BOOKING (
	BookingID			Char(30),
	AccountID			Char(10),
	HomestayID			Char(20),
	BK_DateStart		Date,
	BK_DateEnd			Date,
	BK_DateBook			Date,
	BK_Adults			Int,
	BK_Children			Int,
	BK_Infants			Int,
	BK_Pets				Int,
	BK_Status			Varchar(20) CHECK (BK_Status IN (
							'Pending',     -- Đặt nhưng chưa thanh toán
							'Paid',        -- Đã thanh toán, chưa ở
							'CheckedIn',   -- Đang ở
							'CheckedOut',  -- Đã ở xong
							'Canceled',    -- Hủy
							'NoShow'       -- Không đến
						)),
	PRIMARY KEY (BookingID)
);

CREATE TABLE REVIEW (
	ReviewID			Char(20),
	AccountID			Char(10),
	HomestayID			Char(20),
	RV_Rating			Int,
	RV_ReviewText		Nvarchar(MAX),
	RV_TimeCreateRv		Datetime,
	PRIMARY KEY (ReviewID)
);

CREATE TABLE WISHLIST (
	WishlistID			Char(20),
	AccountID			Char(10),
	HomestayID			Char(20),
	WL_TimeAddWl		Datetime,
	WL_TimeRemoveWl		Datetime,
	PRIMARY KEY (WishlistID)
);

CREATE TABLE PAYMENT (
    PaymentID			Char(30),
    BookingID			Char(30),
	AccountID			Char(10),
    P_Time				Datetime,
    P_Method			Nvarchar(50),
    P_Amount			Int,
    P_Status			Nvarchar(20) CHECK (P_Status IN (
							'Pending',    -- Mới tạo, chờ thanh toán
							'Paid',       -- Thành công
							'Failed',     -- Thất bại
							'Canceled',   -- Hủy thanh toán
							'Refunded'    -- Đã hoàn tiền
						)),
    PRIMARY KEY (PaymentID)
);

CREATE TABLE AUCTION (
    AuctionID			Char(20),
    BookingID			Char(30),
    A_StartPrice		Int,
    A_CurrentPrice		Int,
    A_StepPrice			Int,
    A_StartTime			Datetime,
    A_EndTime			Datetime,
    A_WinnerAccountID	Char(10),
    A_Status			Varchar(20) CHECK (A_Status IN (
							'Open',       -- Đang mở
							'Closed',     -- Kết thúc
							'Canceled'    -- Hủy bỏ
						)),
    PRIMARY KEY (AuctionID),
);

CREATE TABLE AUCTION_BID (
    BidID				Char(10),
    AuctionID			Char(20),
    AccountID			Char(10),
    BD_Time				Datetime,
    BD_Amount			Int,
	BK_Adults			Int,
	BK_Children			Int,
	BK_Infants			Int,
	BK_Pets				Int,
    PRIMARY KEY (BidID, AuctionID)
);

-- Tạo khóa ngoại
GO
ALTER TABLE HOMESTAY
	ADD CONSTRAINT FK_HOMESTAY_HOST
	FOREIGN KEY (HostID) REFERENCES HOST(HostID);

ALTER TABLE BOOKING
	ADD CONSTRAINT FK_BOOKING_HOMESTAY
	FOREIGN KEY (HomestayID) REFERENCES HOMESTAY(HomestayID);
ALTER TABLE BOOKING
	ADD CONSTRAINT FK_BOOKING_ACCOUNT
	FOREIGN KEY (AccountID) REFERENCES ACCOUNT(AccountID);

ALTER TABLE REVIEW
	ADD CONSTRAINT FK_REVIEW_HOMESTAY
	FOREIGN KEY (HomestayID) REFERENCES HOMESTAY(HomestayID);
ALTER TABLE REVIEW
	ADD CONSTRAINT FK_REVIEW_ACCOUNT
	FOREIGN KEY (AccountID) REFERENCES ACCOUNT(AccountID);
	
ALTER TABLE WISHLIST
	ADD CONSTRAINT FK_WISHLIST_HOMESTAY
	FOREIGN KEY (HomestayID) REFERENCES HOMESTAY(HomestayID);
ALTER TABLE WISHLIST
	ADD CONSTRAINT FK_WISHLIST_ACCOUNT
	FOREIGN KEY (AccountID) REFERENCES ACCOUNT(AccountID);

ALTER TABLE PAYMENT
	ADD CONSTRAINT FK_PAYMENT_BOOKING
	FOREIGN KEY (BookingID) REFERENCES BOOKING(BookingID);
ALTER TABLE PAYMENT
	ADD CONSTRAINT FK_PAYMENT_ACCOUNT
	FOREIGN KEY (AccountID) REFERENCES ACCOUNT(AccountID);
	
ALTER TABLE AUCTION
	ADD CONSTRAINT FK_AUCTION_BOOKING
	FOREIGN KEY (BookingID) REFERENCES BOOKING(BookingID);
ALTER TABLE AUCTION
	ADD CONSTRAINT FK_AUCTION_WINNER_ACCOUNT
	FOREIGN KEY (A_WinnerAccountID) REFERENCES ACCOUNT(AccountID);

ALTER TABLE AUCTION_BID
	ADD CONSTRAINT FK_AUCTION_BID_AUCTION
	FOREIGN KEY (AuctionID) REFERENCES AUCTION(AuctionID);
ALTER TABLE AUCTION_BID
	ADD CONSTRAINT FK_AUCTION_BID_ACCOUNT
	FOREIGN KEY (AccountID) REFERENCES ACCOUNT(AccountID);
/*
SELECT * FROM HOMESTAY;
SELECT * FROM HOST;
SELECT * FROM ACCOUNT;
SELECT * FROM BOOKING;
SELECT * FROM REVIEW;
SELECT * FROM PAYMENT;
SELECT * FROM BOOKING WHERE BK_Status = 'CheckedOut' Order By AccountID;
SELECT * FROM REVIEW Order By AccountID;
*/
/*
DELETE FROM BOOKING;
DELETE FROM ACCOUNT;
DELETE FROM HOST;
DELETE FROM HOMESTAY;
*/
