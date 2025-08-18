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
const PORT = 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static('public'));

// Klasörleri oluştur
const createDirectories = () => {
  const dirs = ['uploads', 'output', 'temp'];
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};
createDirectories();

// Multer konfigürasyonu (Excel upload)
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.xlsx', '.xls', '.csv'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Sadece Excel dosyaları (.xlsx, .xls, .csv) kabul edilir!'));
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// 📤 EXCEL UPLOAD ENDPOINT
app.post('/api/upload-excel', upload.single('excel'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Excel dosyası bulunamadı' });
    }

    const filePath = req.file.path;
    console.log('Excel dosyası yüklendi:', filePath);

    // Excel dosyasını parse et
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0]; // İlk sheet'i al
    const sheet = workbook.Sheets[sheetName];
    
    // JSON'a çevir
    const jsonData = XLSX.utils.sheet_to_json(sheet);
    
    if (jsonData.length === 0) {
      return res.status(400).json({ success: false, error: 'Excel dosyası boş!' });
    }

    // Sütun başlıklarını al
    const headers = Object.keys(jsonData[0]);
    
    console.log('Excel parse edildi:', {
      rows: jsonData.length,
      columns: headers.length,
      headers: headers
    });

    res.json({
      success: true,
      data: {
        filename: req.file.originalname,
        headers: headers,
        rowCount: jsonData.length,
        preview: jsonData.slice(0, 5), // İlk 5 satırı önizleme için
        fileId: req.file.filename // Sonraki işlemler için
      }
    });

  } catch (error) {
    console.error('Excel parse hatası:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 📝 TEXT GENERATION ENDPOINT
app.post('/api/generate-text', async (req, res) => {
  try {
    const { fileId, customText, fieldMappings } = req.body;
    
    if (!fileId || !customText) {
      return res.status(400).json({ success: false, error: 'Eksik parametreler' });
    }

    // Excel dosyasını tekrar oku
    const filePath = `./uploads/${fileId}`;
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, error: 'Excel dosyası bulunamadı' });
    }

    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(sheet);

    // Her satır için text oluştur
    const generatedTexts = jsonData.map((row, index) => {
      let processedText = customText;
      
      // Field mapping'leri uygula
      Object.entries(fieldMappings).forEach(([placeholder, columnName]) => {
        const value = row[columnName] || '';
        processedText = processedText.replace(new RegExp(`{{${placeholder}}}`, 'g'), value);
      });

      // Statik değerleri ekle
      processedText = processedText.replace(/{{BUGUN}}/g, new Date().toLocaleDateString('tr-TR'));
      processedText = processedText.replace(/{{FIRMA_ADI}}/g, 'Firma Adı'); // Ayarlanabilir
      
      return {
        index: index + 1,
        content: processedText,
        data: row
      };
    });

    // Sonuçları dosyaya kaydet
    const outputFileName = `generated-texts-${Date.now()}.json`;
    const outputPath = `./output/${outputFileName}`;
    
    fs.writeFileSync(outputPath, JSON.stringify({
      generatedAt: new Date().toISOString(),
      totalCount: generatedTexts.length,
      texts: generatedTexts
    }, null, 2));

    console.log('Text dosyası oluşturuldu:', outputPath);

    res.json({
      success: true,
      data: {
        totalGenerated: generatedTexts.length,
        preview: generatedTexts.slice(0, 3),
        downloadId: outputFileName,
        downloadUrl: `/api/download/${outputFileName}`
      }
    });

  } catch (error) {
    console.error('Text generation hatası:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 📄 PDF GENERATION ENDPOINT
app.post('/api/generate-pdf', async (req, res) => {
  try {
    const { fileId, customText, fieldMappings, options = {} } = req.body;
    
    if (!fileId || !customText) {
      return res.status(400).json({ success: false, error: 'Eksik parametreler' });
    }

    // Excel dosyasını oku
    const filePath = `./uploads/${fileId}`;
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(sheet);

    // Puppeteer ile PDF oluştur
    const browser = await puppeteer.launch({ 
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();

    if (options.generateSeparateFiles) {
      // Her satır için ayrı PDF
      const pdfFiles = [];
      
      for (let i = 0; i < jsonData.length; i++) {
        const row = jsonData[i];
        let processedText = customText;
        
        // Field mapping'leri uygula
        Object.entries(fieldMappings).forEach(([placeholder, columnName]) => {
          const value = row[columnName] || '';
          processedText = processedText.replace(new RegExp(`{{${placeholder}}}`, 'g'), value);
        });

        // HTML template oluştur
        const html = createPDFTemplate(processedText, row, i + 1);
        await page.setContent(html, { waitUntil: 'networkidle0' });
        
        const pdfFileName = `document-${Date.now()}-${i + 1}.pdf`;
        const pdfPath = `./output/${pdfFileName}`;
        
        await page.pdf({
          path: pdfPath,
          format: 'A4',
          margin: { top: '1cm', bottom: '1cm', left: '1.5cm', right: '1.5cm' }
        });
        
        pdfFiles.push({
          filename: pdfFileName,
          downloadUrl: `/api/download/${pdfFileName}`,
          rowIndex: i + 1
        });
      }
      
      await browser.close();
      
      res.json({
        success: true,
        data: {
          type: 'separate',
          totalGenerated: pdfFiles.length,
          files: pdfFiles
        }
      });
      
    } else {
      // Tek PDF'de tüm sayfalar
      let combinedHTML = '';
      
      jsonData.forEach((row, index) => {
        let processedText = customText;
        
        Object.entries(fieldMappings).forEach(([placeholder, columnName]) => {
          const value = row[columnName] || '';
          processedText = processedText.replace(new RegExp(`{{${placeholder}}}`, 'g'), value);
        });
        
        combinedHTML += createPDFTemplate(processedText, row, index + 1);
        if (index < jsonData.length - 1) {
          combinedHTML += '<div style="page-break-after: always;"></div>';
        }
      });
      
      await page.setContent(combinedHTML, { waitUntil: 'networkidle0' });
      
      const pdfFileName = `combined-document-${Date.now()}.pdf`;
      const pdfPath = `./output/${pdfFileName}`;
      
      await page.pdf({
        path: pdfPath,
        format: 'A4',
        margin: { top: '1cm', bottom: '1cm', left: '1.5cm', right: '1.5cm' }
      });
      
      await browser.close();
      
      res.json({
        success: true,
        data: {
          type: 'combined',
          totalPages: jsonData.length,
          filename: pdfFileName,
          downloadUrl: `/api/download/${pdfFileName}`
        }
      });
    }

  } catch (error) {
    console.error('PDF generation hatası:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 📥 DOWNLOAD ENDPOINT
app.get('/api/download/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = `./output/${filename}`;
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, error: 'Dosya bulunamadı' });
    }
    
    const ext = path.extname(filename).toLowerCase();
    let contentType = 'application/octet-stream';
    
    if (ext === '.pdf') {
      contentType = 'application/pdf';
    } else if (ext === '.json') {
      contentType = 'application/json';
    } else if (ext === '.txt') {
      contentType = 'text/plain';
    }
    
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
    
  } catch (error) {
    console.error('Download hatası:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// PDF template oluşturucu fonksiyon
function createPDFTemplate(content, rowData, pageNumber) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {
          font-family: 'Arial', sans-serif;
          font-size: 12pt;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 20px;
        }
        .header {
          text-align: center;
          border-bottom: 2px solid #228B22;
          padding-bottom: 15px;
          margin-bottom: 30px;
        }
        .header h1 {
          color: #228B22;
          font-size: 18pt;
          margin: 0;
        }
        .content {
          white-space: pre-line;
          margin: 20px 0;
        }
        .footer {
          margin-top: 40px;
          text-align: center;
          font-size: 10pt;
          color: #666;
          border-top: 1px solid #ddd;
          padding-top: 10px;
        }
        .page-number {
          position: absolute;
          bottom: 10px;
          right: 20px;
          font-size: 10pt;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>MUTABAKAT MEKTUBU</h1>
      </div>
      
      <div class="content">
        ${content}
      </div>
      
      <div class="footer">
        Bu belge otomatik olarak oluşturulmuştur.<br>
        Oluşturulma Tarihi: ${new Date().toLocaleDateString('tr-TR')}
      </div>
      
      <div class="page-number">
        Sayfa ${pageNumber}
      </div>
    </body>
    </html>
  `;
}

// Server başlat
app.listen(PORT, () => {
  console.log(`🚀 Backend server çalışıyor: http://localhost:${PORT}`);
  console.log('📁 Upload klasörü: ./uploads/');
  console.log('📄 Output klasörü: ./output/');
});

export default app;