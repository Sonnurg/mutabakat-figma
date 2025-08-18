// 📁 server.js (ES Modules versiyonu)
import express from 'express';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import XLSX from 'xlsx';
import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// ES Modules için __dirname tanımla
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001; // ✅ Render için dinamik PORT

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'https://mutabakat-figma.netlify.app',   // Netlify frontend
    /\.onrender\.com$/                        // Render backend
  ],
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static('public'));

// 📁 Klasörleri oluştur
const createDirectories = () => {
  const dirs = ['uploads', 'output', 'temp'];
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};
createDirectories();

// ... (tüm endpointler aynı kalacak) ...

// 🚀 Server başlat
app.listen(PORT, () => {
  console.log(`🚀 Backend server çalışıyor: http://localhost:${PORT}`);
  console.log('📁 Upload klasörü: ./uploads/');
  console.log('📄 Output klasörü: ./output/');
});

export default app;
