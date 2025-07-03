/**
 * @module pdfService
 * @description Encapsulates all logic for creating PDF documents.
 * This service acts as a dedicated "Printing Press" for our server.
 */
const PDFDocument = require('pdfkit');

/**
 * Creates a project budget estimate PDF from proposal data.
 * This function handles all the layout, text, and styling for the PDF.
 * @param {object} proposalData - The data from the budget calculator { clientEmail, projectType, features, budget }.
 * @returns {Promise<Buffer>} A promise that resolves with the generated PDF as a Buffer.
 */
const createProposalPDF = (proposalData) => {
  // We wrap the entire PDF generation in a Promise. This is crucial because
  // PDF creation is a stream-based process. The promise will only resolve
  // when the stream has completely finished writing the PDF to memory.
  return new Promise((resolve, reject) => {
    try {
      const { clientEmail, projectType, features, budget } = proposalData;

      // --- 1. Initialize the PDF Document ---
      const doc = new PDFDocument({
        size: 'A4',
        margin: 50,
        info: {
          Title: 'Project Budget Estimate',
          Author: 'Joshua Mercy', // Replace with your name
        }
      });

      // --- 2. Setup Buffers to Capture PDF Stream ---
      // We build the PDF in memory rather than writing to a file on the server.
      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      // When the stream is finished, resolve the promise with the complete PDF data.
      doc.on('end', () => {
        resolve(Buffer.concat(buffers));
      });

      // --- 3. Add Content to the PDF ---
      // We will use a helper function to register our custom fonts if needed.
      // For now, we'll use standard PDF fonts like Helvetica.

      // Header
      doc
        .font('Helvetica-Bold')
        .fontSize(20)
        .text('Project Budget Estimate', { align: 'center' });
      
      doc.moveDown(2);

      // Client Info
      doc
        .fontSize(12)
        .font('Helvetica')
        .text(`Prepared for: ${clientEmail}`)
        .text(`Date: ${new Date().toLocaleDateString()}`);
      
      doc.moveDown();

      // Horizontal line separator
      doc.strokeColor('#aaaaaa').lineWidth(1).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      
      doc.moveDown(2);

      // Project Details Section
      doc
        .font('Helvetica-Bold')
        .fontSize(14)
        .text('Project Summary', { underline: true });
      
      doc.moveDown();
      
      doc.font('Helvetica-Bold').text('Project Type: ', { continued: true }).font('Helvetica').text(projectType.label);
      
      doc.moveDown();

      if (features && features.length > 0) {
        doc.font('Helvetica-Bold').text('Selected Core Features:');
        doc.moveDown(0.5);
        // Use the built-in list feature for a clean, bulleted list.
        doc.font('Helvetica').list(features.map(f => f.label), { bulletRadius: 2, textIndent: 10 });
      }

      doc.moveDown(2);

      // Budget Section
      doc
        .font('Helvetica-Bold')
        .fontSize(14)
        .text('Financial Estimate', { underline: true });
      
      doc.moveDown();
      
      doc.font('Helvetica-Bold').text('Estimated Budget Range:').fontSize(12);
      doc.font('Helvetica-Bold').fontSize(16).fillColor('#B3402A').text(`${budget.min} - ${budget.max} KES`);
      
      doc.moveDown(3);

      // Footer / Disclaimer
      doc
        .fontSize(9)
        .font('Helvetica-Oblique')
        .fillColor('#333333')
        .text('This is a preliminary estimate based on the features selected. A formal, detailed proposal with a fixed price will be provided after a complimentary 30-minute consultation. Prices are valid for 30 days.', {
          align: 'center',
          lineGap: 4
        });
      
      // --- 4. Finalize the Document ---
      // This is a crucial step that tells PDFKit we are done adding content
      // and triggers the 'end' event we are listening for.
      doc.end();

    } catch (error) {
      // If anything goes wrong during PDF creation, reject the promise.
      console.error("Failed to create PDF:", error);
      reject(error);
    }
  });
};

// Export the creation function to be used in our routes.
module.exports = {
  createProposalPDF,
};