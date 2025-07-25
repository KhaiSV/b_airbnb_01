/*
go
use master
go
drop database DB_Airbnb;
go
*/

go
use master
go
create database DB_Airbnb;
go
use DB_Airbnb;
go

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
	HS_Amenity			Text,
	PRIMARY KEY (HomestayID)
);

CREATE TABLE ACCOUNT (
	ACC_Username		Varchar(50),
	ACC_Password		Varchar(255),
	ACC_Firstname		Nvarchar(50),
	ACC_Lastname		Nvarchar(50),
	ACC_DateOfBirth		Date,
	ACC_Email			Varchar(50),
	ACC_DateCreateAcc	Date,
	--ACC_Avatar
	PRIMARY KEY (ACC_Username)
);

CREATE TABLE BOOKING (
	BookID				Char(10),
	ACC_Username		Varchar(50),
	HomestayID			Char(20),
	B_DateStart			Date,
	B_DateEnd			Date,
	B_DateBook			Date,
	B_Adults			Int,
	B_Children			Int,
	B_Infants			Int,
	B_Pets				Int,
	PRIMARY KEY (BookID)
);			

CREATE TABLE REVIEW (
	ReviewID			Char(10),
	ACC_Username		Varchar(50),
	HomestayID			Char(20),
	RV_Rating			Int,
	RV_ReviewText		Text,
	RV_TimeCreateRv		Datetime,
	PRIMARY KEY (ReviewID)
);

-- Create FK
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
	FOREIGN KEY (ACC_Username) REFERENCES ACCOUNT(ACC_Username);
ALTER TABLE REVIEW
	ADD CONSTRAINT FK_REVIEW_ACCOUNT
	FOREIGN KEY (ACC_Username) REFERENCES ACCOUNT(ACC_Username);

-- SELECT * FROM HOMESTAY;