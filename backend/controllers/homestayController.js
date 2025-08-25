const db = require("../config/database");

exports.getHomestayById = async (req, res) => {
  try {
    const id = req.params.id; // ví dụ "H001"
    const result = await db.query(
      `SELECT HomestayID, HS_ShortName, HS_LongName, HS_Descripton, HS_ListOfImage, HS_CurrentPrice
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
