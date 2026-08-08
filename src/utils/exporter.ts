import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

export function exportToCSV(filename: string, rows: Record<string, any>[]) {
  if (!rows || rows.length === 0) return;
  const headers = Object.keys(rows[0]);
  const csvContent =
    'data:text/csv;charset=utf-8,' +
    [
      headers.join(','),
      ...rows.map((row) =>
        headers
          .map((field) => {
            const val = row[field] === undefined || row[field] === null ? '' : String(row[field]);
            return `"${val.replace(/"/g, '""')}"`;
          })
          .join(',')
      ),
    ].join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToExcel(filename: string, sheetName: string, rows: Record<string, any>[]) {
  if (!rows || rows.length === 0) return;
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, `${filename}.xlsx`);
}

export function exportToPDF(title: string, subtitle: string, sections: { heading: string; content: string | string[] }[]) {
  const doc = new jsPDF();
  let y = 20;

  // Header
  doc.setFontSize(20);
  doc.setTextColor(30, 41, 59); // Slate 800
  doc.text(title, 14, y);
  y += 8;

  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139); // Slate 500
  doc.text(subtitle, 14, y);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 140, y);
  y += 12;

  // Line
  doc.setDrawColor(226, 232, 240);
  doc.line(14, y, 196, y);
  y += 10;

  // Sections
  sections.forEach((sec) => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }

    doc.setFontSize(13);
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.text(sec.heading, 14, y);
    y += 7;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);

    if (Array.isArray(sec.content)) {
      sec.content.forEach((line) => {
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
        doc.text(`• ${line}`, 18, y);
        y += 6;
      });
    } else {
      const splitLines = doc.splitTextToSize(sec.content, 180);
      splitLines.forEach((line: string) => {
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, 14, y);
        y += 6;
      });
    }
    y += 6;
  });

  doc.save(`${title.toLowerCase().replace(/\s+/g, '_')}_report.pdf`);
}
