// Export to CSV
export const exportToCSV = (data, filename = 'export.csv', headers = null) => {
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  // Get headers
  const csvHeaders = headers || Object.keys(data[0]);
  
  // Create CSV content
  let csv = csvHeaders.join(',') + '\n';
  
  data.forEach(row => {
    const values = csvHeaders.map(header => {
      const value = row[header];
      // Escape commas and quotes
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    });
    csv += values.join(',') + '\n';
  });

  // Download
  downloadFile(csv, filename, 'text/csv');
};

// Export to Excel (XLSX)
export const exportToExcel = (data, filename = 'export.xlsx', sheetName = 'Sheet1') => {
  // This would typically use a library like xlsx
  // For now, we'll export as CSV with .xlsx extension
  exportToCSV(data, filename.replace('.xlsx', '.csv'));
};

// Export to JSON
export const exportToJSON = (data, filename = 'export.json') => {
  const json = JSON.stringify(data, null, 2);
  downloadFile(json, filename, 'application/json');
};

// Export to PDF (requires jsPDF library)
export const exportToPDF = (data, filename = 'export.pdf', options = {}) => {
  const {
    title = 'Report',
    orientation = 'portrait',
    headers = null
  } = options;

  // This is a placeholder - actual implementation would use jsPDF
  console.warn('PDF export requires jsPDF library');
  
  // Fallback to CSV
  exportToCSV(data, filename.replace('.pdf', '.csv'), headers);
};

// Export table to CSV
export const exportTableToCSV = (tableId, filename = 'table.csv') => {
  const table = document.getElementById(tableId);
  if (!table) {
    console.error('Table not found');
    return;
  }

  let csv = [];
  const rows = table.querySelectorAll('tr');
  
  rows.forEach(row => {
    const cols = row.querySelectorAll('td, th');
    const rowData = Array.from(cols).map(col => {
      let text = col.textContent.trim();
      // Escape commas and quotes
      if (text.includes(',') || text.includes('"')) {
        text = `"${text.replace(/"/g, '""')}"`;
      }
      return text;
    });
    csv.push(rowData.join(','));
  });

  downloadFile(csv.join('\n'), filename, 'text/csv');
};

// Download file helper
const downloadFile = (content, filename, mimeType) => {
  const blob = new Blob([content], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

// Format data for export
export const formatDataForExport = (data, columnMapping = {}) => {
  return data.map(item => {
    const formatted = {};
    Object.keys(columnMapping).forEach(key => {
      formatted[columnMapping[key]] = item[key];
    });
    return formatted;
  });
};

// Export with formatting
export const exportWithFormatting = (data, config) => {
  const {
    filename = 'export',
    format = 'csv',
    columns = null,
    formatters = {},
    filters = null
  } = config;

  // Filter data
  let exportData = filters ? data.filter(filters) : data;

  // Select columns
  if (columns) {
    exportData = exportData.map(item => {
      const filtered = {};
      columns.forEach(col => {
        filtered[col] = item[col];
      });
      return filtered;
    });
  }

  // Apply formatters
  if (Object.keys(formatters).length > 0) {
    exportData = exportData.map(item => {
      const formatted = { ...item };
      Object.keys(formatters).forEach(key => {
        if (formatted[key] !== undefined) {
          formatted[key] = formatters[key](formatted[key]);
        }
      });
      return formatted;
    });
  }

  // Export based on format
  switch (format.toLowerCase()) {
    case 'csv':
      exportToCSV(exportData, `${filename}.csv`);
      break;
    case 'json':
      exportToJSON(exportData, `${filename}.json`);
      break;
    case 'excel':
    case 'xlsx':
      exportToExcel(exportData, `${filename}.xlsx`);
      break;
    case 'pdf':
      exportToPDF(exportData, `${filename}.pdf`);
      break;
    default:
      exportToCSV(exportData, `${filename}.csv`);
  }
};

// Batch export multiple sheets
export const exportMultipleSheets = (sheets, filename = 'export.xlsx') => {
  // This would typically use xlsx library for multiple sheets
  // For now, export each sheet as separate CSV
  sheets.forEach((sheet, index) => {
    const sheetFilename = `${filename.replace('.xlsx', '')}_${sheet.name || `sheet${index + 1}`}.csv`;
    exportToCSV(sheet.data, sheetFilename, sheet.headers);
  });
};

// Export report with metadata
export const exportReport = (data, metadata = {}) => {
  const {
    title = 'Report',
    generatedBy = 'System',
    generatedAt = new Date().toISOString(),
    description = ''
  } = metadata;

  const report = {
    metadata: {
      title,
      generatedBy,
      generatedAt,
      description,
      recordCount: data.length
    },
    data
  };

  exportToJSON(report, `${title.replace(/\s+/g, '_')}_report.json`);
};

export default {
  exportToCSV,
  exportToExcel,
  exportToJSON,
  exportToPDF,
  exportTableToCSV,
  formatDataForExport,
  exportWithFormatting,
  exportMultipleSheets,
  exportReport
};
