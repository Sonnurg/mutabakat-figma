// 📁 server.js (ES Modules versiyonu)
import express from "express";
import multer from "multer";
import cors from "cors";
import path, { dirname } from "path";
import fs from "fs";
import XLSX from "xlsx";
import puppeteer from "puppeteer";
import { fileURLToPath } from "url";

// ES Modules için __dirname tanımla
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001; // ✅ Render için dinamik PORT

// ✅ CORS ayarları
app.use(
  cors({
    origin: [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'https://mutabakat-figma.netlify.app',
  'https://mutabakat-snnr.netlify.app',  // yeni eklendi
  /\.onrender\.com$/
],
    credentials: true,
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.static("public"));

// 📁 Gerekli klasörleri oluştur
const createDirectories = () => {
  const dirs = ["uploads", "output", "temp"];
  dirs.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};
createDirectories();

// ✅ Multer ile dosya upload config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// 📌 Excel upload endpoint
app.post("/api/upload-excel", upload.single("excel"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Excel dosyası yüklenmedi ❌",
      });
    }

    // Excel dosyasını oku
    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    res.json({
      success: true,
      message: "Excel dosyası başarıyla yüklendi ✅",
      file: req.file,
      rowCount: data.length, // satır sayısı
      preview: data.slice(0, 5), // ilk 5 satır önizleme
    });
  } catch (error) {
    console.error("Excel yükleme hatası:", error);
    res.status(500).json({
      success: false,
      message: "Excel işlenirken hata oluştu ❌",
      error: error.message,
    });
  }
});

// Test endpoint
app.get("/api/ping", (req, res) => {
  res.json({ success: true, message: "API çalışıyor 🚀" });
});

// 🚀 Server başlat
app.listen(PORT, () => {
  console.log(`🚀 Backend server çalışıyor: http://localhost:${PORT}`);
  console.log("📁 Upload klasörü: ./uploads/");
  console.log("📄 Output klasörü: ./output/");
});

export default app;
