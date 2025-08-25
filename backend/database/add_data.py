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

    adults = random.randint(1, 4)
    children = random.randint(0, 3)
    infants = random.randint(0, 1)
    pets = 0

    # Chọn status dựa trên ngày hiện tại
    if date_book <= today < date_start:
        status = random.choice(['Pending', 'Paid', 'Canceled'])
    elif date_start <= today <= date_end:
        status = random.choice(['CheckedIn', 'Canceled', 'NoShow'])
    elif today > date_end:
        status = random.choice(['CheckedOut', 'Canceled', 'NoShow'])
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
        
        # Kết nối database
        conn = connect_to_database()
        if not conn:
            return False
        
        cursor = conn.cursor()
        
        # Xóa dữ liệu cũ (tùy chọn)
        cursor.execute("DELETE FROM HOMESTAY WHERE HostID IN (SELECT HostID FROM HOST)")
        cursor.execute("DELETE FROM HOST")
        
        success_count = 0
        error_count = 0
        
        # Tạo HostID nếu chưa có
        if 'HostID' not in df.columns:
            df['HostID'] = ['HO' + str(i+1).zfill(8) for i in range(len(df))]
        
        # Duyệt từng dòng và thêm vào bảng HOST
        for index, row in df.iterrows():
            try:
                # Xử lý dữ liệu ngày tháng
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
        
        # Lưu thay đổi và đóng kết nối
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
        
        # Xử lý dữ liệu
        if 'Link' in df.columns:
            df = df.drop(columns=['Link'])
        
        # Tạo HomestayID nếu chưa có
        if 'HomestayID' not in df.columns:
            df['HomestayID'] = ['HS' + str(i+1).zfill(18) for i in range(len(df))]
        
        # Kết nối database để lấy danh sách HostID
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
        
        # Gán HostID ngẫu nhiên cho mỗi homestay
        df['HostID'] = [random.choice(host_ids) for _ in range(len(df))]
        
        print(f"Đã đọc {len(df)} bản ghi homestay")
        
        # Kết nối lại database để chèn dữ liệu
        conn = connect_to_database()
        if not conn:
            return False
        
        cursor = conn.cursor()
        
        # Xóa dữ liệu cũ (tùy chọn)
        # cursor.execute("DELETE FROM HOMESTAY")
        
        success_count = 0
        error_count = 0
        
        # Duyệt từng dòng và thêm vào bảng HOMESTAY
        for index, row in df.iterrows():
            try:
                cursor.execute("""
                    INSERT INTO HOMESTAY (
                        HomestayID, HS_ShortName, HS_LongName, HS_Address,
                        HS_BasePrice, HS_CurrentPrice, HS_NumOfDays, HS_AvgRating,
                        HS_NumOfReview, HS_ListOfImage, HS_Room, HS_Description,
                        HS_Amenity, HS_Status, HS_AllowPets, HostID
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, 
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
                    False,
                    row['HostID']
                )
                success_count += 1
            except Exception as e:
                print(f"Lỗi tại dòng {index + 1}: {e}")
                error_count += 1
        
        # Lưu thay đổi và đóng kết nối
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
        
        # Kết nối database
        conn = connect_to_database()
        if not conn:
            return False
        
        cursor = conn.cursor()
        
        # Xóa dữ liệu cũ (tùy chọn)
        # cursor.execute("DELETE FROM ACCOUNT")
        
        success_count = 0
        error_count = 0
        
        # Duyệt từng dòng và thêm vào bảng ACCOUNT
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
        
        # Lưu thay đổi và đóng kết nối
        conn.commit()
        conn.close()
        
        print(f"Import account hoàn thành: {success_count} thành công, {error_count} lỗi")
        return True
        
    except Exception as e:
        print(f"Lỗi import account: {e}")
        return False

def insert_booking_data(n=200):
    try:
        conn = pyodbc.connect(
            "Driver={ODBC Driver 17 for SQL Server};"
            "Server=localhost;"
            "Database=DB_Airbnb;"
            "Trusted_Connection=yes;"
        )
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

    except Exception as e:
        print("❌ Lỗi:", e)

def main():
    print("\n--- Import cả HOST, HOMESTAY và ACCOUNT ---")
    print("Bắt đầu import host...")
    host_success = import_host_data()
    
    print("\nBắt đầu import homestay...")
    homestay_success = import_homestay_data()
    
    print("\nBắt đầu import account...")
    account_success = import_account_data()

    print("\nBắt đầu generate booking...")
    insert_booking_data(200)
    
    if host_success and homestay_success and account_success:
        print("\nImport tất cả dữ liệu thành công!")
    else:
        print("\nCó lỗi xảy ra trong quá trình import!")

if __name__ == "__main__":
    main()