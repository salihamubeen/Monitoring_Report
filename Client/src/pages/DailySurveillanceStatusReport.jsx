import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const DailySurveillanceStatusReport = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Date range filter state
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  // Location filter state
  const [selectedLocation, setSelectedLocation] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 25;

  // Helper to get only date part in yyyy-mm-dd
  const getDateString = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toISOString().slice(0, 10);
  };

  // Helper to format time as hh:mm AM/PM
  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const [hour, minute] = timeStr.split(':');
    if (hour === undefined || minute === undefined) return timeStr;
    let h = parseInt(hour, 10);
    const m = minute;
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    if (h === 0) h = 12;
    return `${h}:${m} ${ampm}`;
  };

  // Get unique locations for dropdown
  const uniqueLocations = [...new Set(data.map(row => row.location))].sort();

  // Filtered data based on date range and location
  const filteredData = data.filter(row => {
    // Date range filtering
    let dateFilter = true;
    if (dateFrom || dateTo) {
      const rowDate = getDateString(row.date);
      
      if (dateFrom && dateTo) {
        // Both dates selected - range filter
        dateFilter = rowDate >= dateFrom && rowDate <= dateTo;
      } else if (dateFrom) {
        // Only from date selected
        dateFilter = rowDate >= dateFrom;
      } else if (dateTo) {
        // Only to date selected
        dateFilter = rowDate <= dateTo;
      }
    }

    // Location filtering
    let locationFilter = true;
    if (selectedLocation) {
      locationFilter = row.location === selectedLocation;
    }

    // Both filters must pass
    return dateFilter && locationFilter;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / entriesPerPage);
  const paginatedData = filteredData.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage);
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // Fetch reports from API
  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/daily-surveillance`);
      if (!response.ok) {
        throw new Error('Failed to fetch status reports');
      }
      const result = await response.json();
      setData(result.data || []);
    } catch (error) {
      setError(error.message);
      toast.error('Failed to load status reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // Clear all filters
  const clearAllFilters = () => {
    setDateFrom("");
    setDateTo("");
    setSelectedLocation("");
  };

  // Export as PDF
  const exportPDF = () => {
    try {
      const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'A4' });
      // Title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.text('Daily Surveillance Status Report', doc.internal.pageSize.getWidth() / 2, 40, { align: 'center' });
      doc.setFontSize(10);
      const tableColumn = ['Sr. No.', 'DATE', 'LOCATION', 'OPENING TIME', 'CLOSING TIME', 'STATUS', 'TOTAL CAMERAS', 'WORKING CAMERAS', 'NON WORKING CAMERAS', "TOTAL DAY'S RECORDED", 'REMARKS'];
      const tableRows = filteredData.map((row, idx) => [
        idx + 1,
        getDateString(row.date),
        row.location,
        formatTime(row.openingTime),
        formatTime(row.closingTime),
        row.status,
        row.totalCameras,
        row.workingCameras,
        row.nonWorkingCameras,
        row.totalDaysRecorded,
        row.remarks
      ]);
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 60,
        theme: 'grid',
        headStyles: {
          fillColor: [54, 169, 225], // blue header
          textColor: 255,
          fontStyle: 'bold',
          halign: 'center',
          valign: 'middle',
          fontSize: 10,
        },
        bodyStyles: {
          fontSize: 9,
          halign: 'left', // left align body
          valign: 'middle',
        },
        styles: {
          cellPadding: 4,
          overflow: 'linebreak',
          lineWidth: 0.5,
          lineColor: [180, 180, 180],
          minCellHeight: 18,
        },
        alternateRowStyles: {
          fillColor: [240, 240, 240],
        },
        columnStyles: {
          0: { cellWidth: 50 }, // S. No.
          1: { cellWidth: 70 }, // DATE
          2: { cellWidth: 120 }, // LOCATION
          3: { cellWidth: 70 }, // OPENING TIME
          4: { cellWidth: 70 }, // CLOSING TIME
          5: { cellWidth: 60 }, // STATUS
          6: { cellWidth: 60 }, // TOTAL CAMERAS
          7: { cellWidth: 70 }, // WORKING CAMERAS
          8: { cellWidth: 90 }, // NON WORKING CAMERAS
          9: { cellWidth: 90 }, // TOTAL DAY'S RECORDED
          10: { cellWidth: 120 }, // REMARKS
        },
        margin: { left: 20, right: 20 },
      });
      doc.save('Daily_Surveillance_Status_Report.pdf');
    } catch (err) {
      toast.error('Failed to export PDF. Please try again.');
      console.error('PDF export error:', err);
    }
  };

  // Export as Excel
  const exportExcel = () => {
    const wsData = [
      ['Sr. No.', 'DATE', 'LOCATION', 'OPENING TIME', 'CLOSING TIME', 'STATUS', 'TOTAL CAMERAS', 'WORKING CAMERAS', 'NON WORKING CAMERAS', "TOTAL DAY'S RECORDED", 'REMARKS'],
      ...filteredData.map((row, idx) => [
        idx + 1,
        row.date,
        row.location,
        formatTime(row.openingTime),
        formatTime(row.closingTime),
        row.status,
        row.workingCameras,
        row.nonWorkingCameras,
        row.totalDaysRecorded,
        row.remarks
      ])
    ];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'StatusReport');
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'Daily_Surveillance_Status_Report.xlsx');
  };

  // Delete report function
  const deleteReport = async (id) => {
    if (!window.confirm('Are you sure you want to delete this status report?')) {
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/daily-surveillance/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete status report');
      }
      toast.success('Status report deleted successfully');
      fetchReports();
    } catch (error) {
      toast.error('Failed to delete status report');
    }
  };

  if (loading) {
    return (
      <div style={{ fontFamily: 'Poppins, sans-serif' }}>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Loading status reports...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ fontFamily: 'Poppins, sans-serif' }}>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-600">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <div style={{ fontFamily: 'Poppins, sans-serif' }}>
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="mb-8">
          <div className="text-2xl font-medium text-center text-black mb-8 mt-6">DAILY SURVEILLANCE STATUS REPORT</div>
          
          {/* Export buttons row */}
          <div className="flex justify-center mb-6">
            <div className="flex gap-4">
              <button onClick={exportPDF} className="px-4 py-2 bg-[#36a9e1] text-white rounded-sm font-medium hover:bg-[#5bc0ee] focus:outline-none focus:ring-2 focus:ring-[#5bc0ee] transition-colors duration-200">Export as PDF</button>
              <button onClick={exportExcel} className="px-4 py-2 bg-[#36a9e1] text-white rounded-sm font-medium hover:bg-[#5bc0ee] focus:outline-none focus:ring-2 focus:ring-[#5bc0ee] transition-colors duration-200">Export as Excel</button>
            </div>
          </div>
          
          {/* Filters row */}
          <div className="flex justify-center mb-6">
            <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-4 flex-wrap">
                <label className="bg-[#36a9e1] text-white text-base font-medium px-4 py-2 rounded-sm">Filter the report:</label>
                
                {/* Date range filters */}
                <div className="flex items-center gap-2">
                  <label className="text-gray-700 font-medium text-sm">From:</label>
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={e => setDateFrom(e.target.value)}
                    className="border border-gray-400 rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#36a9e1] bg-white text-black w-40"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <label className="text-gray-700 font-medium text-sm">To:</label>
              <input
                type="date"
                    value={dateTo}
                    onChange={e => setDateTo(e.target.value)}
                className="border border-gray-400 rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#36a9e1] bg-white text-black w-40"
              />
                </div>
                
                {/* Location filter */}
                <div className="flex items-center gap-2">
                  <label className="text-gray-700 font-medium text-sm">Location:</label>
                  <select
                    value={selectedLocation}
                    onChange={e => setSelectedLocation(e.target.value)}
                    className="border border-gray-400 rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#36a9e1] bg-white text-black w-40"
                  >
                    <option value="">All Locations</option>
                    {uniqueLocations.map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>
                
                {(dateFrom || dateTo || selectedLocation) && (
                <button
                    onClick={clearAllFilters}
                    className="px-4 py-2 bg-[#99a1ad] text-white rounded font-medium text-sm hover:bg-[#b0b7c3] focus:outline-none focus:ring-2 focus:ring-[#5bc0ee] transition-colors duration-200"
                >
                    Clear All
                </button>
                )}
              </div>
              
              {/* Filter summary */}
              {(dateFrom || dateTo || selectedLocation) && (
                <div className="mt-2 text-sm text-gray-600">
                  Showing {filteredData.length} of {data.length} status records
                  {dateFrom && dateTo && ` from ${dateFrom} to ${dateTo}`}
                  {dateFrom && !dateTo && ` from ${dateFrom}`}
                  {!dateFrom && dateTo && ` until ${dateTo}`}
                  {selectedLocation && ` at ${selectedLocation}`}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-400 bg-white">
            <thead>
              <tr>
                <th className="border border-gray-400 px-4 py-2 text-center font-bold text-[10px]">Sr. No.</th>
                <th className="border border-gray-400 px-4 py-2 text-center font-bold text-[10px]">DATE</th>
                <th className="border border-gray-400 px-4 py-2 text-center font-bold text-[10px]">LOCATION</th>
                <th className="border border-gray-400 px-4 py-2 text-center font-bold text-[10px]">OPENING TIME</th>
                <th className="border border-gray-400 px-4 py-2 text-center font-bold text-[10px]">CLOSING TIME</th>
                <th className="border border-gray-400 px-4 py-2 text-center font-bold text-[10px]">STATUS</th>
                <th className="border border-gray-400 px-4 py-2 text-center font-bold text-[10px]">TOTAL CAMERAS</th>
                <th className="border border-gray-400 px-4 py-2 text-center font-bold text-[10px]">WORKING CAMERAS</th>
                <th className="border border-gray-400 px-4 py-2 text-center font-bold text-[10px]">NON WORKING CAMERAS</th>
                <th className="border border-gray-400 px-4 py-2 text-center font-bold text-[10px]">TOTAL DAY'S RECORDED</th>
                <th className="border border-gray-400 px-4 py-2 text-center font-bold text-[10px]">REMARKS</th>
                <th className="border border-gray-400 px-4 py-2 text-center font-bold text-[10px]">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={12} className="text-center py-8 text-gray-500">No status records found.</td>
                </tr>
              ) : (
                paginatedData.map((row, idx) => (
                  <tr key={row._id || idx}>
                    <td className="border border-gray-400 px-2 py-2 text-center text-[12px]">{(currentPage - 1) * entriesPerPage + idx + 1}</td>
                    <td className="border border-gray-400 px-2 py-2 text-left text-[12px]">{row.date}</td>
                    <td className="border border-gray-400 px-2 py-2 text-left text-[12px]">{row.location}</td>
                    <td className="border border-gray-400 px-2 py-2 text-center text-[12px]">{formatTime(row.openingTime)}</td>
                    <td className="border border-gray-400 px-2 py-2 text-center text-[12px]">{formatTime(row.closingTime)}</td>
                    <td className="border border-gray-400 px-2 py-2 text-center text-[12px]">{row.status}</td>
                    <td className="border border-gray-400 px-2 py-2 text-center text-[12px]">{row.totalCameras}</td>
                    <td className="border border-gray-400 px-2 py-2 text-center text-[12px]">{row.workingCameras}</td>
                    <td className="border border-gray-400 px-2 py-2 text-center text-[12px]">{row.nonWorkingCameras}</td>
                    <td className="border border-gray-400 px-2 py-2 text-center text-[12px]">{row.totalDaysRecorded}</td>
                    <td className="border border-gray-400 px-2 py-2 text-[12px]">{row.remarks}</td>
                    <td className="border border-gray-400 px-2 py-2 text-center">
                      <button
                        onClick={() => deleteReport(row._id)}
                        className="px-6 py-2 rounded-sm bg-transparent text-[#36a9e1] hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-[#5bc0ee] transition-colors duration-200 flex items-center justify-center mx-auto"
                        title="Delete"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 7.5V19A2.25 2.25 0 008.25 21.25h7.5A2.25 2.25 0 0018 19V7.5M9.75 11.25v4.5m4.5-4.5v4.5M4.5 7.5h15m-10.5 0V5.25A2.25 2.25 0 0111.25 3h1.5A2.25 2.25 0 0115 5.25V7.5" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-4">
              <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50">Prev</button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-[#36a9e1] text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  {i + 1}
                </button>
              ))}
              <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50">Next</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DailySurveillanceStatusReport; 