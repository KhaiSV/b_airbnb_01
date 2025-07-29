/*
-- Remove old DB
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

-- Create TB
CREATE TABLE HOST (
	HostID				Char(10),
	HO_Name				Nvarchar(50),
	HO_AboutMe			Text,
	HO_Description		Text,
	HO_DateOfBirth		Date,
	HO_Email			Varchar(50),
	HO_DateCreateAcc	Date,
	HO_AvgRating		Float,
	HO_NumOfReview		Int,
	--HO_Avatar
	PRIMARY KEY (HostID)
);

CREATE TABLE HOMESTAY (
	HomestayID			Char(20),
	HostID				Char(10),
	HS_ShortName		Nvarchar(50),
	HS_LongName			Nvarchar(255),
	HS_Address			Text,
	HS_BasePrice		Int,
	HS_CurrentPrice		Int,
	HS_NumOfDays		Int,
	HS_AvgRating		Float,
	HS_NumOfReview		Int,
	HS_ListOfImage		Text,
	HS_Room				Text,
	HS_Descripton		Text,
	HS_Amenity			Char(50),
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
	PRIMARY KEY (AccountID)
);

CREATE TABLE BOOKING (
	BookingID			Char(20),
	AccountID			Char(10),
	HomestayID			Char(20),
	B_DateStart			Date,
	B_DateEnd			Date,
	B_DateBook			Date,
	B_Adults			Int,
	B_Children			Int,
	B_Infants			Int,
	B_Pets				Int,
	B_Status			Varchar(20) CHECK (B_Status IN (
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
	RV_ReviewText		Text,
	RV_TimeCreateRv		Datetime,
	PRIMARY KEY (ReviewID)
);

CREATE TABLE PAYMENT (
    PaymentID			Char(20),
    BookingID			Char(20),
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


-- Create FK
GO
ALTER TABLE HOMESTAY
	ADD CONSTRAINT FK_HOMESTAY_HOST
	FOREIGN KEY (HostID) REFERENCES HOST(HostID);

ALTER TABLE BOOKING
	ADD CONSTRAINT FK_BOOKING_HOMESTAY
	FOREIGN KEY (HomestayID) REFERENCES HOMESTAY(HomestayID);
ALTER TABLE REVIEW
	ADD CONSTRAINT FK_REVIEW_HOMESTAY
	FOREIGN KEY (HomestayID) REFERENCES HOMESTAY(HomestayID);

ALTER TABLE BOOKING
	ADD CONSTRAINT FK_BOOKING_ACCOUNT
	FOREIGN KEY (AccountID) REFERENCES ACCOUNT(AccountID);
ALTER TABLE REVIEW
	ADD CONSTRAINT FK_REVIEW_ACCOUNT
	FOREIGN KEY (AccountID) REFERENCES ACCOUNT(AccountID);

ALTER TABLE PAYMENT
	ADD CONSTRAINT FK_PAYMENT_BOOKING
	FOREIGN KEY (BookingID) REFERENCES BOOKING(BookingID);
ALTER TABLE PAYMENT
	ADD CONSTRAINT FK_PAYMENT_ACCOUNT
	FOREIGN KEY (AccountID) REFERENCES ACCOUNT(AccountID);

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
