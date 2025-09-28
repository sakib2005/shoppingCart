import jsPDF from "jspdf";

const CUSTOMER_DATA = {
  firstNames: ["Alice", "John", "Siti", "Rajesh", "Mei", "Daniel", "Fatimah", "Michael"],
  lastNames: ["Tan", "Lim", "Nurhaliza", "Kumar", "Ling", "Wong", "Ali", "Lee"],
  domains: ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com"],
  streets: ["Jalan Ampang", "Bukit Bintang", "Petaling Street", "Jalan Tun Razak"],
  cities: ["Kuala Lumpur", "Penang", "Johor Bahru", "Kuching", "Kota Kinabalu", "Ipoh"],
  postalCodes: ["50000", "10000", "80000", "93000", "88000"]
};

class PDFGenerator {
  constructor() {
    this.doc = new jsPDF();
    this.pageWidth = this.doc.internal.pageSize.width;
    this.pageHeight = this.doc.internal.pageSize.height;
    this.currentY = 0;
    this.margin = 20;
  }

  drawText(text, x, y, options = {}) {
    const {
      size = 12,
      color = [0, 0, 0],
      style = "normal",
      align = "left",
      maxWidth = null
    } = options;

    this.doc.setFontSize(size);
    this.doc.setFont("helvetica", style);
    this.doc.setTextColor(...color);
    
    if (maxWidth) {
      const lines = this.doc.splitTextToSize(text, maxWidth);
      this.doc.text(lines, x, y, { align });
      return lines.length;
    } else {
      this.doc.text(text, x, y, { align });
      return 1;
    }
  }

  drawTable(headers, data, startY, columnWidths) {
    const rowHeight = 12;
    const headerHeight = 15;
    let y = startY;

    // Draw table headers
    this.doc.setFillColor(240, 240, 240);
    this.doc.rect(this.margin, y, this.pageWidth - (2 * this.margin), headerHeight, "F");
    
    let x = this.margin;
    headers.forEach((header, index) => {
      this.drawText(header, x + 2, y + 10, { 
        style: "bold", 
        size: 11,
        align: index === headers.length - 1 ? "right" : "left"
      });
      x += columnWidths[index];
    });

    y += headerHeight;

    // Draw table rows
    data.forEach((row, rowIndex) => {
      if (y > this.pageHeight - 40) {
        this.addPage();
        y = this.margin + 40;
      }

      x = this.margin;
      row.forEach((cell, cellIndex) => {
        const align = cellIndex === row.length - 1 ? "right" : "left";
        this.drawText(cell, x + 2, y + 8, { size: 10, align });
        x += columnWidths[cellIndex];
      });

      // Add subtle row separator
      if (rowIndex < data.length - 1) {
        this.doc.setDrawColor(200, 200, 200);
        this.doc.line(this.margin, y + 12, this.pageWidth - this.margin, y + 12);
      }

      y += rowHeight;
    });

    return y;
  }

  addPage() {
    this.doc.addPage();
    this.currentY = this.margin;
  }

  // 🎨 Create modern header
  createHeader() {
    // Gradient background (simulated)
    this.doc.setFillColor(41, 128, 185);
    this.doc.rect(0, 0, this.pageWidth, 80, "F");

    // Company logo and name
    this.drawText("SHOPPIFY", this.pageWidth / 2, 35, {
      size: 24,
      color: [255, 255, 255],
      style: "bold",
      align: "center"
    });

    this.drawText("Premium Shopping Experience", this.pageWidth / 2, 50, {
      size: 12,
      color: [255, 255, 255],
      align: "center"
    });

    this.currentY = 90;
  }

  // 👤 Customer information section
  createCustomerSection(customerInfo) {
    this.drawText("INVOICE", this.margin, this.currentY, { size: 18, style: "bold" });
    this.currentY += 25;

    // Invoice details
    const invoiceData = [
      [`Invoice #:`, `INV-${Date.now().toString().slice(-6)}`],
      [`Date:`, new Date().toLocaleDateString('en-MY')],
      [`Due Date:`, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-MY')]
    ];

    let x = this.margin;
    invoiceData.forEach(([label, value]) => {
      this.drawText(label, x, this.currentY, { size: 10, color: [100, 100, 100] });
      this.drawText(value, x + 40, this.currentY, { size: 10, style: "bold" });
      this.currentY += 8;
    });

    this.currentY += 15;

    // Customer info
    const customerY = this.currentY;
    this.drawText("BILL TO:", this.margin, this.currentY, { style: "bold" });
    this.currentY += 8;
    this.drawText(customerInfo.name, this.margin, this.currentY, { style: "bold" });
    this.currentY += 6;
    this.drawText(customerInfo.email, this.margin, this.currentY, { size: 10 });
    this.currentY += 6;
    
    const addressLines = this.doc.splitTextToSize(customerInfo.address, 120);
    addressLines.forEach(line => {
      this.drawText(line, this.margin, this.currentY, { size: 10 });
      this.currentY += 6;
    });

    this.currentY = Math.max(this.currentY, customerY + 40);
  }

  // 📋 Items table
  createItemsTable(cart) {
    const headers = ["Description", "Qty", "Unit Price", "Amount"];
    const columnWidths = [100, 30, 40, 40];
    
    const tableData = cart.map(item => [
      item.title.length > 40 ? item.title.substring(0, 37) + "..." : item.title,
      item.quantity.toString(),
      `$${item.price.toFixed(2)}`,
      `$${(item.price * item.quantity).toFixed(2)}`
    ]);

    this.currentY = this.drawTable(headers, tableData, this.currentY + 10, columnWidths);
  }

  // 💰 Totals section
  createTotalsSection(total, totalItems) {
    const subtotal = total;
    const taxRate = 0.08;
    const tax = subtotal * taxRate;
    const grandTotal = subtotal + tax;

    const totals = [
      { label: `Subtotal (${totalItems} items):`, value: subtotal },
      { label: "Tax (8%):", value: tax },
      { label: "Grand Total:", value: grandTotal, highlight: true }
    ];

    const startX = this.pageWidth - this.margin - 100;
    let y = this.currentY + 20;

    totals.forEach(({ label, value, highlight }) => {
      this.drawText(label, startX, y, {
        align: "right",
        style: highlight ? "bold" : "normal",
        color: highlight ? [0, 128, 0] : [0, 0, 0]
      });

      this.drawText(`$${value.toFixed(2)}`, this.pageWidth - this.margin, y, {
        align: "right",
        style: highlight ? "bold" : "normal",
        size: highlight ? 14 : 12,
        color: highlight ? [0, 128, 0] : [0, 0, 0]
      });

      y += highlight ? 12 : 10;
    });

    this.currentY = y;
  }

  // 📝 Footer section
  createFooter() {
    const footerY = this.pageHeight - 30;
    
    this.doc.setDrawColor(200, 200, 200);
    this.doc.line(this.margin, footerY - 10, this.pageWidth - this.margin, footerY - 10);

    this.drawText("Thank you for your business!", this.pageWidth / 2, footerY, {
      align: "center",
      color: [100, 100, 100]
    });

    this.drawText("This is a computer-generated invoice.", this.pageWidth / 2, footerY + 8, {
      size: 8,
      align: "center",
      color: [150, 150, 150],
      style: "italic"
    });

    // Page numbers
    const pageCount = this.doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      this.doc.setPage(i);
      this.drawText(`Page ${i} of ${pageCount}`, this.pageWidth - this.margin, this.pageHeight - 10, {
        size: 8,
        align: "right",
        color: [150, 150, 150]
      });
    }
  }
}

// 🎲 Improved customer info generator
export function generateCustomerInfo() {
  const firstName = CUSTOMER_DATA.firstNames[Math.floor(Math.random() * CUSTOMER_DATA.firstNames.length)];
  const lastName = CUSTOMER_DATA.lastNames[Math.floor(Math.random() * CUSTOMER_DATA.lastNames.length)];
  
  return {
    name: `${firstName} ${lastName}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${CUSTOMER_DATA.domains[Math.floor(Math.random() * CUSTOMER_DATA.domains.length)]}`,
    address: `${Math.floor(Math.random() * 200 + 1)} ${CUSTOMER_DATA.streets[Math.floor(Math.random() * CUSTOMER_DATA.streets.length)]}, ${CUSTOMER_DATA.cities[Math.floor(Math.random() * CUSTOMER_DATA.cities.length)]}, ${CUSTOMER_DATA.postalCodes[Math.floor(Math.random() * CUSTOMER_DATA.postalCodes.length)]}, Malaysia`
  };
}

export const defaultCustomerInfo = generateCustomerInfo();

// 📄 Main bill generator with error handling
export function generateBill(cart, total, totalItems, customerInfo = defaultCustomerInfo) {
  try {
    // Input validation
    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      throw new Error("Cart must be a non-empty array");
    }

    if (typeof total !== "number" || total < 0) {
      throw new Error("Total must be a positive number");
    }

    if (typeof totalItems !== "number" || totalItems < 0) {
      throw new Error("Total items must be a positive number");
    }

    const pdf = new PDFGenerator();
    
    // Build PDF sections
    pdf.createHeader();
    pdf.createCustomerSection(customerInfo);
    pdf.createItemsTable(cart);
    pdf.createTotalsSection(total, totalItems);
    pdf.createFooter();

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:]/g, '-');
    const filename = `invoice_${timestamp}.pdf`;

    // Save PDF
    pdf.doc.save(filename);
    
    return filename;
    
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw new Error(`Failed to generate invoice: ${error.message}`);
  }
}

// 💡 Utility function to format currency
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-MY', {
    style: 'currency',
    currency: 'MYR'
  }).format(amount);
}