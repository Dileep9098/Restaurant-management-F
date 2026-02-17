import * as XLSX from "xlsx";

export const downloadExcel=(filteredTables)=>{
const worksheet = XLSX.utils.json_to_sheet(filteredTables);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(workbook, "data.xlsx");} 
     
export const downloadCSV = ({ headers = [], filteredTables = [] }) => {
    if (!headers.length || !filteredTables.length) {
        console.warn('No data available for CSV download');
        return;
    }

    const rows = filteredTables.map((table, index) => [
        index + 1,
        table.tableNumber,
        table.capacity,
        table.status,
        table.qrCodeUrl ? 'Yes' : 'No',
        new Date(table.createdAt).toLocaleDateString()
    ]);

    const csvContent = [headers, ...rows]
        .map(row => row.map(cell => `"${cell}"`).join(','))
        .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'tables.csv';
    a.click();

    URL.revokeObjectURL(url);
};

export const showWarningMsg=(message)=>{
    toast.warn(message)
}

export const showInfoMsg = (message) => {
    toast.info(message);
}