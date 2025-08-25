import pandas as pd
import pyodbc
import os
from dotenv import load_dotenv
from datetime import date, datetime, timedelta
import random

load_dotenv()

def connect_to_database():
    """Tạo kết nối đến SQL Server"""
    try:
        conn_str = (
            "Driver={ODBC Driver 17 for SQL Server};"
            f"Server={os.getenv('SERVER_NAME')};"
            "Database=DB_Airbnb;"
            "Trusted_Connection=yes;"
        )
        conn = pyodbc.connect(conn_str)
        return conn
    except Exception as e:
        print(f"Lỗi kết nối database: {e}")
        return None

from tqdm import tqdm

def pad(num, width):
    return str(num).zfill(width)

def generate_booking_id(i):
    return f'BK{pad(i, 28)}'

def generate_account_id():
    return f'AC{pad(random.randint(1, 50), 8)}'

def generate_homestay_id():
    return f'HS{pad(random.randint(1, 100), 18)}'

def generate_review_id(i):
    return f'RV{pad(i, 18)}'

def random_date(start, end):
    """Generate random date between start and end"""
    delta = end - start
    return start + timedelta(days=random.randint(0, delta.days))

def generate_booking_row(i):
    booking_id = generate_booking_id(i)
    account_id = generate_account_id()
    homestay_id = generate_homestay_id()

    today = date.today()
    date_book = random_date(today - timedelta(days=60), today - timedelta(days=1))
    date_start = random_date(date_book + timedelta(days=1), date_book + timedelta(days=15))
    stay_length = random.randint(1, 5)
    date_end = date_start + timedelta(days=stay_length)

    adults = random.randint(1, 2)
    children = random.randint(0, 2)
    infants = random.randint(0, 2)
    pets = 0

    # Tăng tỉ lệ CheckedOut thành công
    if today > date_end:
        status = random.choices(['CheckedOut', 'Canceled', 'NoShow'], weights=[0.8, 0.1, 0.1])[0]
    elif date_start <= today <= date_end:
        status = random.choices(['CheckedIn', 'Canceled', 'NoShow'], weights=[0.7, 0.2, 0.1])[0]
    elif date_book <= today < date_start:
        status = random.choices(['Paid', 'Pending', 'Canceled'], weights=[0.6, 0.3, 0.1])[0]
    else:
        status = 'Pending'

    return (
        booking_id,
        account_id,
        homestay_id,
        date_start,
        date_end,
        date_book,
        adults,
        children,
        infants,
        pets,
        status
    )

def import_host_data(csv_file="host_data.csv"):
    """Import dữ liệu từ host_data.csv vào bảng HOST"""
    try:
        if not os.path.exists(csv_file):
            print(f"Không tìm thấy file: {csv_file}")
            return False
        
        print(f"Đang đọc dữ liệu từ {csv_file}...")
        df = pd.read_csv(csv_file)
        
        print(f"Đã đọc {len(df)} bản ghi host")
        
        conn = connect_to_database()
        if not conn:
            return False
        
        cursor = conn.cursor()
        
        cursor.execute("DELETE FROM HOMESTAY WHERE HostID IN (SELECT HostID FROM HOST)")
        cursor.execute("DELETE FROM HOST")
        
        success_count = 0
        error_count = 0
        
        if 'HostID' not in df.columns:
            df['HostID'] = ['HO' + str(i+1).zfill(8) for i in range(len(df))]
        
        for index, row in df.iterrows():
            try:
                date_of_birth = pd.to_datetime(row['HO_DateOfBirth']).date() if pd.notna(row['HO_DateOfBirth']) else None
                date_create_acc = pd.to_datetime(row['HO_DateCreateAcc']).date() if pd.notna(row['HO_DateCreateAcc']) else None
                
                cursor.execute("""
                    INSERT INTO HOST (
                        HostID, HO_Password, HO_Firstname, HO_Lastname, HO_Sex,
                        HO_AboutMe, HO_Description, HO_DateOfBirth, HO_Email,
                        HO_DateCreateAcc, HO_AvgRating, HO_NumOfReview, HO_Status
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, 
                    row['HostID'],
                    row['HO_Password'],
                    row['HO_Firstname'],
                    row['HO_Lastname'],
                    row['HO_Sex'],
                    row['HO_AboutMe'],
                    row['HO_Description'],
                    date_of_birth,
                    row['HO_Email'],
                    date_create_acc,
                    row['HO_AvgRating'] if pd.notna(row['HO_AvgRating']) else 0.0,
                    row['HO_NumOfReview'] if pd.notna(row['HO_NumOfReview']) else 0,
                    row['HO_Status'] if pd.notna(row['HO_Status']) else 'Normal'
                )
                success_count += 1
            except Exception as e:
                print(f"Lỗi tại dòng {index + 1}: {e}")
                error_count += 1
        
        conn.commit()
        conn.close()
        
        print(f"Import host hoàn thành: {success_count} thành công, {error_count} lỗi")
        return True
        
    except Exception as e:
        print(f"Lỗi import host: {e}")
        return False

def import_homestay_data(csv_file="homestay_data.csv"):
    """Import dữ liệu từ homestay_data.csv vào bảng HOMESTAY"""
    try:
        if not os.path.exists(csv_file):
            print(f"Không tìm thấy file: {csv_file}")
            return False
        
        print(f"Đang đọc dữ liệu từ {csv_file}...")
        df = pd.read_csv(csv_file)
        
        if 'Link' in df.columns:
            df = df.drop(columns=['Link'])
        
        if 'HomestayID' not in df.columns:
            df['HomestayID'] = ['HS' + str(i+1).zfill(18) for i in range(len(df))]
        
        conn = connect_to_database()
        if not conn:
            return False
        
        cursor = conn.cursor()
        cursor.execute("SELECT HostID FROM HOST")
        host_ids = [row.HostID for row in cursor.fetchall()]
        conn.close()
        
        if not host_ids:
            print("Không tìm thấy HostID trong bảng HOST. Vui lòng import dữ liệu HOST trước.")
            return False
        
        df['HostID'] = [random.choice(host_ids) for _ in range(len(df))]
        
        print(f"Đã đọc {len(df)} bản ghi homestay")
        
        conn = connect_to_database()
        if not conn:
            return False
        
        cursor = conn.cursor()
        
        success_count = 0
        error_count = 0
        
        for index, row in df.iterrows():
            try:
                cursor.execute("""
                    INSERT INTO HOMESTAY (
                        HomestayID, HS_ShortName, HS_LongName, HS_Address,
                        HS_BasePrice, HS_CurrentPrice, HS_NumOfDays, HS_AvgRating,
                        HS_NumOfReview, HS_ListOfImage, HS_Room, HS_Description,
                        HS_Amenity, HS_Status, HS_Adults, HS_Children, HS_Infants, HS_Pets, HostID
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    row['HomestayID'],
                    row['Short Name'], 
                    row['Long Name'], 
                    row['Address'],
                    row['Base Price'], 
                    row['Current Price'],
                    row['Number of Days'], 
                    row['Average Rating'], 
                    row['Number of Reviews'], 
                    row['List of Images'],
                    row['Room'],
                    row['Description'],
                    row['Amenity'],
                    "Normal",
                    2,  # HS_Adults
                    2,  # HS_Children
                    2,  # HS_Infants
                    0,  # HS_Pets
                    row['HostID']
                ))
                success_count += 1
            except Exception as e:
                print(f"Lỗi tại dòng {index + 1}: {e}")
                error_count += 1
        
        conn.commit()
        conn.close()
        
        print(f"Import homestay hoàn thành: {success_count} thành công, {error_count} lỗi")
        return True
        
    except Exception as e:
        print(f"Lỗi import homestay: {e}")
        return False

def import_account_data(csv_file="account_data.csv"):
    """Import dữ liệu từ account_data.csv vào bảng ACCOUNT"""
    try:
        if not os.path.exists(csv_file):
            print(f"Không tìm thấy file: {csv_file}")
            return False
        
        print(f"Đang đọc dữ liệu từ {csv_file}...")
        df = pd.read_csv(csv_file)
        
        print(f"Đã đọc {len(df)} bản ghi account")
        
        conn = connect_to_database()
        if not conn:
            return False
        
        cursor = conn.cursor()
        
        success_count = 0
        error_count = 0
        
        
        for index, row in df.iterrows():
            try:
                # Xử lý dữ liệu ngày tháng
                date_of_birth = pd.to_datetime(row['AC_DateOfBirth']).date() if pd.notna(row['AC_DateOfBirth']) else None
                date_create_acc = pd.to_datetime(row['AC_DateCreateAcc']).date() if pd.notna(row['AC_DateCreateAcc']) else None
                
                cursor.execute("""
                    INSERT INTO ACCOUNT (
                        AccountID, AC_Username, AC_Password, AC_Firstname, 
                        AC_Lastname, AC_Sex, AC_DateOfBirth, AC_Email, AC_DateCreateAcc,
                        AC_Status, AC_Role
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, 
                    row['AccountID'],
                    row['AC_Username'],
                    row['AC_Password'],
                    row['AC_Firstname'],
                    row['AC_Lastname'],
                    row['AC_Sex'],
                    date_of_birth,
                    row['AC_Email'],
                    date_create_acc,
                    "Normal",
                    row['AC_Role'] if 'AC_Role' in row and pd.notna(row['AC_Role']) else 'user'
                )
                success_count += 1
            except Exception as e:
                print(f"Lỗi tại dòng {index + 1}: {e}")
                error_count += 1
        
        conn.commit()
        conn.close()
        
        print(f"Import account hoàn thành: {success_count} thành công, {error_count} lỗi")
        return True
        
    except Exception as e:
        print(f"Lỗi import account: {e}")
        return False

def insert_booking_data(n=200):
    try:
        conn = connect_to_database()
        if not conn:
            return False
        
        cursor = conn.cursor()

        for i in range(1, n+1):
            row = generate_booking_row(i)
            cursor.execute("""
                INSERT INTO BOOKING (
                    BookingID, AccountID, HomestayID,
                    BK_DateStart, BK_DateEnd, BK_DateBook,
                    BK_Adults, BK_Children, BK_Infants, BK_Pets,
                    BK_Status
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, row)

        conn.commit()
        print(f"Đã chèn {n} dòng BOOKING thành công.")
        conn.close()
        return True

    except Exception as e:
        print(f"❌ Lỗi insert booking: {e}")
        return False

def insert_review_data(n=200):
    try:
        conn = connect_to_database()
        if not conn:
            return False
        
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT BookingID, AccountID, HomestayID, BK_DateEnd
            FROM BOOKING
            WHERE BK_Status = 'CheckedOut'
        """)
        checked_out_bookings = cursor.fetchall()
        
        success_count = 0
        error_count = 0
        review_id_counter = 1
        
        for booking in checked_out_bookings:
            try:
                booking_id = booking.BookingID
                account_id = booking.AccountID
                homestay_id = booking.HomestayID
                date_end = booking.BK_DateEnd
                
                review_time = date_end + timedelta(days=random.randint(1, 2))
                
                rating = random.choices([3, 4, 5], weights=[0.2, 0.4, 0.4])[0]
                
                review_text = f"Review for booking {booking_id}: Great stay!"
                
                review_id = generate_review_id(review_id_counter)
                review_id_counter += 1
                
                cursor.execute("""
                    INSERT INTO REVIEW (
                        ReviewID, AccountID, HomestayID,
                        RV_Rating, RV_ReviewText, RV_TimeCreateRv
                    ) VALUES (?, ?, ?, ?, ?, ?)
                """, 
                    review_id,
                    account_id,
                    homestay_id,
                    rating,
                    review_text,
                    review_time
                )
                success_count += 1
            except Exception as e:
                print(f"Lỗi khi chèn review cho booking {booking.BookingID}: {e}")
                error_count += 1
        
        conn.commit()
        conn.close()
        
        print(f"Đã chèn {success_count} review thành công, {error_count} lỗi")
        return True
        
    except Exception as e:
        print(f"Lỗi insert review: {e}")
        return False

def update_homestay_rating():
    """Chạy stored procedure P_UpdateHomestayRating"""
    try:
        conn = connect_to_database()
        if not conn:
            return False
        
        cursor = conn.cursor()
        cursor.execute("EXEC DB_Airbnb.dbo.P_UpdateHomestayRating")
        conn.commit()
        print("Đã chạy stored procedure P_UpdateHomestayRating thành công.")
        conn.close()
        return True
    
    except Exception as e:
        print(f"Lỗi khi chạy P_UpdateHomestayRating: {e}")
        return False

def check_homestay_rating():
    """Kiểm tra xem HS_AvgRating có được cập nhật không"""
    try:
        conn = connect_to_database()
        if not conn:
            return False
        
        cursor = conn.cursor()
        cursor.execute("""
            SELECT COUNT(*) AS NonZeroRatings
            FROM HOMESTAY
            WHERE HS_AvgRating > 0
        """)
        result = cursor.fetchone()
        conn.close()
        
        non_zero_count = result[0]
        if non_zero_count > 0:
            print(f"Tìm thấy {non_zero_count} homestay có HS_AvgRating > 0")
            return True
        else:
            print("Không có homestay nào có HS_AvgRating > 0. Kiểm tra bảng REVIEW.")
            return False
    
    except Exception as e:
        print(f"Lỗi khi kiểm tra HS_AvgRating: {e}")
        return False

def check_job_status():
    """Kiểm tra trạng thái job UpdateHomestayRatingJob"""
    try:
        conn = connect_to_database()
        if not conn:
            return False
        
        cursor = conn.cursor()
        cursor.execute("""
            SELECT 
                j.name AS job_name,
                j.enabled,
                s.name AS schedule_name
            FROM msdb.dbo.sysjobs j
            LEFT JOIN msdb.dbo.sysjobschedules jsch ON j.job_id = jsch.job_id
            LEFT JOIN msdb.dbo.sysschedules s ON jsch.schedule_id = s.schedule_id
            WHERE j.name = 'UpdateHomestayRatingJob'
        """)
        job = cursor.fetchone()
        conn.close()
        
        if job:
            print(f"Job {job[0]} trạng thái: {'Enabled' if job[1] == 1 else 'Disabled'}, Lịch: {job[2]}")
            return job[1] == 1
        else:
            print("Không tìm thấy job UpdateHomestayRatingJob")
            return False
    
    except Exception as e:
        print(f"Lỗi khi kiểm tra job: {e}")
        return False

def main():
    print("\n--- Import cả HOST, HOMESTAY, ACCOUNT, BOOKING, REVIEW và kiểm tra ---")
    print("Bắt đầu import host...")
    host_success = import_host_data()
    
    print("\nBắt đầu import homestay...")
    homestay_success = import_homestay_data()
    
    print("\nBắt đầu import account...")
    account_success = import_account_data()

    print("\nBắt đầu generate booking...")
    booking_success = insert_booking_data(200)
    
    print("\nBắt đầu generate review...")
    review_success = insert_review_data()
    
    print("\nBắt đầu cập nhật HS_AvgRating...")
    rating_success = update_homestay_rating()

    print("\nKiểm tra trạng thái job...")
    job_success = check_job_status()

    print("\nKiểm tra HS_AvgRating...")
    rating_updated = check_homestay_rating()

    if host_success and homestay_success and account_success and booking_success and review_success and rating_success and job_success and rating_updated:
        print("\nImport, cập nhật và kiểm tra tất cả thành công!")
    else:
        print("\nCó lỗi xảy ra trong quá trình import, cập nhật hoặc kiểm tra!")

if __name__ == "__main__":
    main()