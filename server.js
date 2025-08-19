// 📁 server.js
import express from "express";
import multer from "multer";
import cors from "cors";
import path, { dirname } from "path";
import fs from "fs";
import XLSX from "xlsx";
import { fileURLToPath } from "url";
import archiver from "archiver";
import PDFDocument from "pdfkit";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// ✅ CORS
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "https://mutabakat-figma.netlify.app",
      "https://mutabakat-snnr.netlify.app",
      /\.onrender\.com$/,
    ],
    credentials: true,
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// 📂 Gerekli klasörler
["uploads", "output", "temp"].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// 📌 Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + Math.round(Math.random() * 1e9) + "-" + file.originalname),
});
const upload = multer({ storage });

/**
 * 📌 Excel upload & PDF üretim (pdfkit ile)
 */
app.post("/api/upload-excel", upload.single("excel"), async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ success: false, message: "Excel dosyası yok ❌" });

    // Excel oku
    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const outputDir = path.join(__dirname, "output");
    fs.rmSync(outputDir, { recursive: true, force: true }); // önce temizle
    fs.mkdirSync(outputDir, { recursive: true });

    // Her satır için PDF üret
    rows.forEach((row, i) => {
      const pdfPath = path.join(outputDir, `mutabakat_${i + 1}.pdf`);
      const doc = new PDFDocument();

      const stream = fs.createWriteStream(pdfPath);
      doc.pipe(stream);

      doc.fontSize(18).text("Mutabakat Mektubu", { align: "center" });
      doc.moveDown();

      doc.fontSize(12).text(`Müşteri: ${row["Customer Name"] || "Bilinmiyor"}`);
      doc.text(`Hesap No: ${row["Account"] || "Yok"}`);
      doc.text(`Bakiye: ${row["Balance"] || "0"}`);
      doc.text(`Tarih: ${row["Date"] || new Date().toLocaleDateString()}`);

      doc.end();
    });

    res.json({
      success: true,
      message: `${rows.length} PDF üretildi ✅`,
      files: fs.readdirSync(outputDir),
    });
  } catch (err) {
    console.error("Excel upload + PDF üretim hatası:", err);
    res
      .status(500)
      .json({ success: false, message: "PDF üretilemedi ❌", error: err.message });
  }
});

// 📌 ZIP indirme
app.get("/api/download-zip", (req, res) => {
  const outputDir = path.join(__dirname, "output");
  const zipPath = path.join(__dirname, "temp", "mutabakatlar.zip");

  const output = fs.createWriteStream(zipPath);
  const archive = archiver("zip", { zlib: { level: 9 } });

  archive.pipe(output);
  archive.directory(outputDir, false);
  archive.finalize();

  output.on("close", () => {
    res.download(zipPath, "mutabakatlar.zip");
  });
});

// 📌 Tek dosya indirme
app.get("/api/download-file/:filename", (req, res) => {
  const filePath = path.join(__dirname, "output", req.params.filename);
  if (!fs.existsSync(filePath)) return res.status(404).send("Dosya bulunamadı ❌");
  res.download(filePath, req.params.filename);
});

// 📌 Ping
app.get("/api/ping", (req, res) => res.json({ success: true, message: "API çalışıyor 🚀" }));

// 🚀 Server start
app.listen(PORT, () => console.log(`🚀 Server running: http://localhost:${PORT}`));
