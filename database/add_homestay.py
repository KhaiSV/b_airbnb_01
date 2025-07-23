import pandas as pd
import pyodbc
import os
from dotenv import load_dotenv

load_dotenv()

df = pd.read_csv("airbnb_data.csv")
df = df.drop(columns=['Link'])
df['HomestayID'] = ['HS' + str(i+1).zfill(8) for i in range(len(df))]

# Chuỗi kết nối đến SQL Server
conn_str = (
    "Driver={ODBC Driver 17 for SQL Server};"
    f"Server={os.getenv('SERVER_NAME')};"
    "Database=DB_Airbnb;"
    "Trusted_Connection=yes;"
)
conn = pyodbc.connect(conn_str)
cursor = conn.cursor()

# Duyệt từng dòng và thêm vào bảng HOMESTAY
for _, row in df.iterrows():
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

# Lưu thay đổi và đóng kết nối
conn.commit()
conn.close()