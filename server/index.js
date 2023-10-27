const express = require("express");
const multer = require("multer");
const { PDFDocument } = require("pdf-lib");
const fs = require("fs").promises;
const path = require("path");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static files from the "client/build" directory
app.use(express.static(path.join(__dirname, 'dist')));

// Serve the frontend HTML file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
}); 
// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.post("/upload", upload.single("pdfFile"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const pdfBuffer = req.file.buffer;
    const fileName = req.file.originalname;

    const pdfPath = path.join(__dirname, "uploads", fileName);

    await fs.writeFile(pdfPath, pdfBuffer);

    res.status(200).json({ message: "File uploaded successfully" });
  } catch (error) {
    console.error("Error uploading the PDF:", error);
    res.status(500).json({ message: "Error uploading the PDF" });
  }
});


app.post("/extract", async (req, res) => {
  try {
    const { selectedPages, originalPdf } = req.body;
    console.log(selectedPages);
    console.log(originalPdf);

    const originalPdfPath = path.join(__dirname, "uploads", originalPdf);
    const originalPdfBuffer = await fs.readFile(originalPdfPath);

    const pdfDoc = await PDFDocument.load(originalPdfBuffer);
    const newPdfDoc = await PDFDocument.create();

    for (const pageNumber of selectedPages) {
      const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [pageNumber - 1]);
      newPdfDoc.addPage(copiedPage);
    }

    const newPdfPath = path.join(__dirname, "uploads", "new.pdf");
    const newPdfBytes = await newPdfDoc.save();
    await fs.writeFile(newPdfPath, newPdfBytes);

    // Setting the Content-Type header
    res.setHeader("Content-Type", "application/pdf");

    // Sending the new PDF as a response
    res.download(newPdfPath, "new.pdf", (error) => {
      if (error) {
        res.status(500).send("Error generating the new PDF");
      }
    });
  } catch (error) {
    console.error("Error generating the new PDF:", error);
    res.status(500).json({ message: "Error generating the new PDF" });
  }
});
