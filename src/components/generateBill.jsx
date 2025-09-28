// src/utils/generateBill.js
import { jsPDF } from "jspdf";

export function generateBill(cart, total, totalItems, customerInfo = {}) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;
  let yPosition = margin;

  // Colors
  const primaryColor = [41, 128, 185]; // Blue
  const secondaryColor = [52, 73, 94]; // Dark blue
  const accentColor = [46, 204, 113]; // Green
  const lightGray = [245, 246, 250];
  const darkGray = [127, 140, 141];

  // Helper function to draw colored text
  const drawText = (text, x, y, size = 11, color = [0, 0, 0], style = 'normal') => {
    doc.setFontSize(size);
    doc.setFont(style === 'bold' ? 'helvetica' : 'helvetica', style);
    doc.setTextColor(...color);
    doc.text(text, x, y);
    return doc.getTextDimensions(text);
  };

  // Helper function to draw line
  const drawLine = (y, color = darkGray) => {
    doc.setDrawColor(...color);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
  };

  // Header with background
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 60, 'F');
  
  // Company logo/name
  drawText("SHOPPIFY", pageWidth / 2, 25, 24, [255, 255, 255], 'bold');
  drawText("Premium Shopping Experience", pageWidth / 2, 35, 10, [255, 255, 255]);
  
  // Invoice title
  yPosition = 80;
  drawText("INVOICE", pageWidth / 2, yPosition, 20, secondaryColor, 'bold');
  yPosition += 15;

  // Invoice details in two columns
  const leftCol = margin;
  const rightCol = pageWidth - margin - 80;

  // Current date
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // Left column - Invoice info
  drawText("Invoice #:", leftCol, yPosition, 11, darkGray);
  drawText(`INV-${Date.now().toString().slice(-6)}`, leftCol + 25, yPosition, 11, secondaryColor, 'bold');
  
  drawText("Date:", leftCol, yPosition + 8, 11, darkGray);
  drawText(dateStr, leftCol + 15, yPosition + 8, 11, secondaryColor);

  // Right column - Customer info
  drawText("Bill To:", rightCol, yPosition, 11, darkGray, 'bold');
  drawText(customerInfo.name || "Customer", rightCol, yPosition + 8, 11, secondaryColor);
  drawText(customerInfo.email || "customer@example.com", rightCol, yPosition + 16, 10, darkGray);

  yPosition += 40;

  // Table header
  doc.setFillColor(...lightGray);
  doc.rect(margin, yPosition - 8, pageWidth - 2 * margin, 12, 'F');
  
  drawText("ITEM DESCRIPTION", margin + 5, yPosition, 10, secondaryColor, 'bold');
  drawText("QTY", pageWidth - margin - 100, yPosition, 10, secondaryColor, 'bold');
  drawText("PRICE", pageWidth - margin - 60, yPosition, 10, secondaryColor, 'bold');
  drawText("TOTAL", pageWidth - margin - 20, yPosition, 10, secondaryColor, 'bold');

  yPosition += 5;
  drawLine(yPosition);
  yPosition += 10;

  // Items list
  cart.forEach((item, index) => {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = margin;
    }

    // Item name and category
    const title = item.title.length > 30 ? item.title.substring(0, 30) + "..." : item.title;
    drawText(`${index + 1}. ${title}`, margin + 5, yPosition, 10, secondaryColor);
    drawText(`(${item.category})`, margin + 5, yPosition + 5, 8, darkGray);

    // Quantity, price, and total
    drawText(item.quantity.toString(), pageWidth - margin - 100, yPosition + 2, 10);
    drawText(`$${item.price.toFixed(2)}`, pageWidth - margin - 60, yPosition + 2, 10);
    drawText(`$${(item.price * item.quantity).toFixed(2)}`, pageWidth - margin - 20, yPosition + 2, 10, accentColor, 'bold');

    yPosition += 15;
    
    // Add subtle separator between items
    if (index < cart.length - 1) {
      drawLine(yPosition - 3, [230, 230, 230]);
      yPosition += 5;
    }
  });

  yPosition += 10;
  drawLine(yPosition);
  yPosition += 15;

  // Summary section
  const summaryStart = pageWidth - margin - 100;
  
  drawText("Subtotal:", summaryStart, yPosition, 11, darkGray);
  drawText(`$${total.toFixed(2)}`, pageWidth - margin - 20, yPosition, 11, secondaryColor, 'bold');

  drawText("Tax (8%):", summaryStart, yPosition + 8, 11, darkGray);
  drawText(`$${(total * 0.08).toFixed(2)}`, pageWidth - margin - 20, yPosition + 8, 11, secondaryColor);

  yPosition += 20;
  drawLine(yPosition, secondaryColor);
  yPosition += 10;

  // Total amount
  drawText("TOTAL AMOUNT:", summaryStart, yPosition, 14, secondaryColor, 'bold');
  drawText(`$${(total * 1.08).toFixed(2)}`, pageWidth - margin - 20, yPosition, 14, accentColor, 'bold');

  yPosition += 25;

  // Footer
  drawText("Thank you for your business!", pageWidth / 2, yPosition, 12, primaryColor, 'bold');
  yPosition += 8;
  drawText("Terms & Conditions: Payment due within 30 days.", pageWidth / 2, yPosition, 8, darkGray);
  yPosition += 5;
  drawText("For questions, contact: support@shoppify.com", pageWidth / 2, yPosition, 8, darkGray);

  // Page number
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    drawText(`Page ${i} of ${pageCount}`, pageWidth / 2, doc.internal.pageSize.height - 10, 8, darkGray);
  }

  // Save PDF with timestamp
  const timestamp = now.toISOString().slice(0, 10);
  doc.save(`invoice-${timestamp}.pdf`);
}

// Optional: Add customer info structure
export const defaultCustomerInfo = {
  name: "Customer Name",
  email: "customer@email.com",
  address: "123 Main St, City, State 12345"
};