// controllers/homestayController.js
const db = require("../config/database");

// Lấy danh sách homestays (giới hạn 10 bản ghi)
// exports.getAllHomestays = async (req, res) => {
//   try {
//     const result = await db.query(`
//       SELECT TOP 10 HomestayID, HS_ShortName, HS_LongName, HS_Address,
//                         HS_BasePrice, HS_CurrentPrice, HS_NumOfDays, HS_AvgRating,
//                         HS_NumOfReview, HS_ListOfImage, HS_Room, HS_Description
//       FROM HOMESTAY
//     `);
//     res.json(result.recordset);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Lỗi server" });
//   }
// };

// Lấy chi tiết 1 homestay theo ID
exports.getHomestayById = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await db.query(
      `SELECT HomestayID, HS_ShortName, HS_LongName, HS_Address,
                        HS_BasePrice, HS_CurrentPrice, HS_NumOfDays, HS_AvgRating,
                        HS_NumOfReview, HS_ListOfImage, HS_Room, HS_Description
       FROM HOMESTAY
       WHERE HomestayID = @param0`,
      [id]
    );

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy homestay" });
    }
    res.json(result.recordset[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};
