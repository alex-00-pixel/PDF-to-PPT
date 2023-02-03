const form = document.querySelector("#conversionForm");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(form);

  try {
    const response = await fetch("/convert", {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const pptxBlob = await response.blob();
    const pptxUrl = URL.createObjectURL(pptxBlob);

    window.open(pptxUrl);
  } catch (err) {
    alert(err.message);
  }
});



const express = require("express");
const multer = require("multer");
const { promisify } = require("util");
const pdf2ppt = require("pdf2ppt");

const app = express();
const upload = multer({ dest: "uploads/" });
const convert = promisify(pdf2ppt.convert);

app.post("/convert", upload.single("pdfFile"), async (req, res) => {
  try {
    const pptxBuffer = await convert(req.file.path);
    res.set("Content-Type", "application/vnd.openxmlformats-officedocument.presentationml.presentation");
    res.set("Content-Disposition", "attachment; filename=presentation.pptx");
    res.send(pptxBuffer);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});



