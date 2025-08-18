// 📁 server.js
import express from "express";
import multer from "multer";
import cors from "cors";
import path, { dirname } from "path";
import fs from "fs";
import XLSX from "xlsx";
import puppeteer from "puppeteer";
import { fileURLToPath } from "url";
import archiver from "archiver";

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

// 📌 Excel upload & PDF üretim
app.post("/api/upload-excel", upload.single("excel"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "Excel dosyası yok ❌" });

    // Excel oku
    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // PDF üret
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const outputDir = path.join(__dirname, "output");
    fs.rmSync(outputDir, { recursive: true, force: true }); // önce temizle
    fs.mkdirSync(outputDir, { recursive: true });

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const page = await browser.newPage();
      const htmlContent = `
        <html>
          <head><meta charset="utf-8" /></head>
          <body style="font-family: Arial; padding: 20px;">
            <h1>Mutabakat Mektubu</h1>
            <p><b>Müşteri:</b> ${row["Customer Name"] || "Bilinmiyor"}</p>
            <p><b>Hesap No:</b> ${row["Account"] || "Yok"}</p>
            <p><b>Bakiye:</b> ${row["Balance"] || "0"}</p>
            <p><b>Tarih:</b> ${row["Date"] || new Date().toLocaleDateString()}</p>
          </body>
        </html>
      `;
      await page.setContent(htmlContent, { waitUntil: "networkidle0" });
      const pdfPath = path.join(outputDir, `mutabakat_${i + 1}.pdf`);
      await page.pdf({ path: pdfPath, format: "A4" });
      await page.close();
    }
    await browser.close();

    res.json({
      success: true,
      message: `${rows.length} PDF üretildi ✅`,
      files: fs.readdirSync(outputDir),
    });
  } catch (err) {
    console.error("Excel upload + PDF üretim hatası:", err);
    res.status(500).json({ success: false, message: "PDF üretilemedi ❌", error: err.message });
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
