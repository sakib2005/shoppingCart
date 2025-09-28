import jsPDF from "jspdf";

// 🎲 Random customer info generator
const randomNames = ["Alice Tan", "John Lim", "Siti Nurhaliza", "Rajesh Kumar", "Mei Ling", "Daniel Wong", "Fatimah Ali", "Michael Lee"];
const randomEmails = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "example.com"];
const randomStreets = ["Jalan Ampang", "Bukit Bintang", "Petaling Street", "Jalan Tun Razak", "Brickfields", "Jalan Bukit Jalil"];
const randomCities = ["Kuala Lumpur", "Penang", "Johor Bahru", "Kuching", "Kota Kinabalu", "Ipoh"];

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export const defaultCustomerInfo = {
  name: getRandomElement(randomNames),
  email: `${getRandomElement(randomNames).toLowerCase().replace(/\s/g, "")}@${getRandomElement(randomEmails)}`,
  address: `${Math.floor(Math.random() * 200 + 1)} ${getRandomElement(randomStreets)}, ${getRandomElement(randomCities)}, Malaysia`
};

// 🖊️ Text drawing helper with alignment
function drawText(doc, text, x, y, size = 12, color = [0, 0, 0], style = "normal", align = "left") {
  doc.setFontSize(size);
  doc.setFont("helvetica", style);
  doc.setTextColor(...color);
  doc.text(text, x, y, { align });
}

// 📄 Main bill generator
export function generateBill(cart, total, totalItems, customerInfo = defaultCustomerInfo) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;

  // 🎨 Header background
  doc.setFillColor(0, 102, 204); // Blue
  doc.rect(0, 0, pageWidth, 50, "F");

  // 🏬 Company name & tagline (centered)
  drawText(doc, "SHOPPIFY", pageWidth / 2, 25, 24, [255, 255, 255], "bold", "center");
  drawText(doc, "Premium Shopping Experience", pageWidth / 2, 35, 10, [255, 255, 255], "normal", "center");

  // 🧾 Invoice info
  drawText(doc, `Invoice #: ${Math.floor(Math.random() * 100000)}`, 14, 60, 12, [0, 0, 0], "bold");
  drawText(doc, `Date: ${new Date().toLocaleDateString()}`, 14, 70, 12);

  // 👤 Customer info
  drawText(doc, "Bill To:", 14, 85, 12, [0, 0, 0], "bold");
  drawText(doc, customerInfo.name, 14, 95);
  drawText(doc, customerInfo.email, 14, 102);
  drawText(doc, customerInfo.address, 14, 109);

  // 🪟 Table headers
  let y = 130;
  doc.setDrawColor(0);
  doc.setLineWidth(0.5);
  doc.line(14, y - 6, pageWidth - 14, y - 6); // top line

  drawText(doc, "Item", 14, y, 12, [0, 0, 0], "bold");
  drawText(doc, "Qty", pageWidth / 2 - 20, y, 12, [0, 0, 0], "bold");
  drawText(doc, "Price", pageWidth / 2 + 10, y, 12, [0, 0, 0], "bold");
  drawText(doc, "Category", pageWidth - 70, y, 12, [0, 0, 0], "bold");
  drawText(doc, "Total", pageWidth - 30, y, 12, [0, 0, 0], "bold");

  doc.line(14, y + 3, pageWidth - 14, y + 3); // underline headers

  // 🛍️ Items
  cart.forEach((item, i) => {
    y += 12;
    drawText(doc, item.title, 14, y, 11);
    drawText(doc, String(item.quantity), pageWidth / 2 - 20, y, 11, [0, 0, 0], "normal", "center");
    drawText(doc, `$${item.price.toFixed(2)}`, pageWidth / 2 + 10, y, 11, [0, 0, 0], "normal", "center");
    drawText(doc, item.category, pageWidth - 70, y, 11);
    drawText(doc, `$${(item.price * item.quantity).toFixed(2)}`, pageWidth - 30, y, 11, [0, 0, 0], "normal", "right");
  });

  // ➕ Totals
  y += 20;
  drawText(doc, `Subtotal (${totalItems} items):`, pageWidth - 80, y, 12, [0, 0, 0], "bold", "right");
  drawText(doc, `$${total.toFixed(2)}`, pageWidth - 14, y, 12, [0, 0, 0], "bold", "right");

  y += 10;
  drawText(doc, "Tax (8%):", pageWidth - 80, y, 12, [0, 0, 0], "bold", "right");
  drawText(doc, `$${(total * 0.08).toFixed(2)}`, pageWidth - 14, y, 12, [0, 0, 0], "bold", "right");

  y += 12;
  drawText(doc, "Total:", pageWidth - 80, y, 14, [0, 128, 0], "bold", "right");
  drawText(doc, `$${(total * 1.08).toFixed(2)}`, pageWidth - 14, y, 14, [0, 128, 0], "bold", "right");

  // 📌 Footer
  doc.setFontSize(10);
  drawText(doc, "Thank you for shopping with Shoppify!", pageWidth / 2, pageHeight - 20, 10, [100, 100, 100], "normal", "center");
  drawText(doc, "This is a computer-generated invoice.", pageWidth / 2, pageHeight - 14, 8, [150, 150, 150], "italic", "center");

  // 📑 Page number
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    drawText(doc, `Page ${i} of ${pageCount}`, pageWidth - 14, pageHeight - 10, 10, [100, 100, 100], "normal", "right");
  }

  // 💾 Save PDF
  doc.save(`invoice_${Date.now()}.pdf`);
}
