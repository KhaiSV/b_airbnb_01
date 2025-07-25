import pandas as pd
import pyodbc
import os
from dotenv import load_dotenv
from datetime import datetime

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
            df['HomestayID'] = ['HS' + str(i+1).zfill(8) for i in range(len(df))]
        
        print(f"Đã đọc {len(df)} bản ghi homestay")
        
        # Kết nối database
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
                        HomestayID, HS_ShortName, HS_LongName, HS_BasePrice,
                        HS_CurrentPrice, HS_NumOfDays, HS_AvgRating, HS_NumOfReview, HS_ListOfImage
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, 
                    row['HomestayID'],
                    row['Short Name'], 
                    row['Long Name'], 
                    row['Base Price'], 
                    row['Current Price'],
                    row['Number of Days'], 
                    row['Average Rating'], 
                    row['Number of Reviews'], 
                    row['List of Images']
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
                date_of_birth = pd.to_datetime(row['ACC_DateOfBirth']).date() if pd.notna(row['ACC_DateOfBirth']) else None
                date_create_acc = pd.to_datetime(row['ACC_DateCreateAcc']).date() if pd.notna(row['ACC_DateCreateAcc']) else None
                
                cursor.execute("""
                    INSERT INTO ACCOUNT (
                        AccountID, ACC_Username, ACC_Password, ACC_Firstname, 
                        ACC_Lastname, ACC_Sex, ACC_DateOfBirth, ACC_Email, ACC_DateCreateAcc
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, 
                    row['AccountID'],
                    row['ACC_Username'],
                    row['ACC_Password'],
                    row['ACC_Firstname'],
                    row['ACC_Lastname'],
                    row['ACC_Sex'],
                    date_of_birth,
                    row['ACC_Email'],
                    date_create_acc
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

def main():
    print("\n--- Import cả HOMESTAY và ACCOUNT ---")
    print("Bắt đầu import homestay...")
    homestay_success = import_homestay_data()
    
    print("\nBắt đầu import account...")
    account_success = import_account_data()
    
    if homestay_success and account_success:
        print("\nImport tất cả dữ liệu thành công!")
    else:
        print("\nCó lỗi xảy ra trong quá trình import!")

if __name__ == "__main__":
    main()