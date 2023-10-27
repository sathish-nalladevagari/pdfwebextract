import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "./App.css";

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [selectedPages, setSelectedPages] = useState([]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file.type === "application/pdf") {
      setSelectedFile(file);
      setSelectedPages([]); // Clear selected pages when a new file is selected
    } else {
      alert("Please upload a PDF file.");
    }
  };

  const uploadFile = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("pdfFile", selectedFile);

      try {
        const response = await fetch("https://pdfextract.netlify.app/upload", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          alert("PDF file uploaded successfully.");
        } else {
          alert("Error uploading the PDF file.");
        }
      } catch (error) {
        console.error("Error uploading the PDF file:", error);
        alert("Error uploading the PDF file.");
      }
    } else {
      alert("Please select a PDF file to upload.");
    }
  };
  const togglePageSelection = (pageNumber) => {
    if (selectedPages.includes(pageNumber)) {
      setSelectedPages(selectedPages.filter((page) => page !== pageNumber));
    } else {
      setSelectedPages([...selectedPages, pageNumber]);
    }
  };

  const generateNewPDF = async () => {
    try {
      // Send the selected pages to the backend to create a new PDF
      const response = await fetch("https://pdfextract.netlify.app/extract", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          selectedPages,
          originalPdf: selectedFile.name,
        }),
      });

      if (response.ok) {
        // Retrieve the PDF file from the response
        const blob = await response.blob();
        console.log(blob);
        const url = window.URL.createObjectURL(blob);

        // Create a download link for the generated PDF
        const a = document.createElement("a");
        a.href = url;
        a.download = "new.pdf";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        console.error("Error generating the new PDF");
      }
    } catch (error) {
      console.error("Error generating the new PDF:", error);
    }
  };

  useEffect(() => {
    if (selectedFile) {
      // Update the number of pages when the selected file changes
      const reader = new FileReader();
      reader.onload = (e) => {
        const typedArray = new Uint8Array(e.target.result);
        pdfjs.getDocument(typedArray).promise.then((pdfDocument) => {
          setNumPages(pdfDocument.numPages);
        });
      };
      reader.readAsArrayBuffer(selectedFile);
    }
  }, [selectedFile]);

  return (
    <div className="container">
      <div>
        <div>
          <input
            type="file"
            accept=".pdf"
            className="button-9"
            onChange={handleFileChange}
          />
          <button onClick={uploadFile}>Upload PDF</button>
        </div>
        {selectedFile && numPages !== null && numPages > 0 && (
          <div
            style={{ display: "flex", flexDirection: "row" }}
            className="scrollmenu"
          >
            {Array.from({ length: numPages }, (_, i) => (
              <div key={i + 1}>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedPages.includes(i + 1)}
                    onChange={() => togglePageSelection(i + 1)}
                  />
                  Page {i + 1}
                </label>
                <Document file={selectedFile} onLoadSuccess={() => {}}>
                  <div>
                    <Page
                      pageNumber={i + 1}
                      renderTextLayer={false}
                      width={
                        window.innerWidth <= 768 ? 200 : 300 // Adjust the width based on screen size
                      }
                    />
                  </div>
                </Document>
              </div>
            ))}
          </div>
        )}
        <button onClick={generateNewPDF}>Generate New PDF</button>
      </div>
    </div>
  );
}

export default App;
