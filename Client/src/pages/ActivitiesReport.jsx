import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

// API base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Helper to format date and time as MM/DD/YYYY hh:mm AM/PM
function formatDateTime(datetimeStr) {
  if (!datetimeStr) return '';
  const date = new Date(datetimeStr);
  const datePart = date.toLocaleDateString('en-US');
  const timePart = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toUpperCase();
  return `${datePart} ${timePart}`;
}

const ActivitiesReport = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Modal state for image slider
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImages, setModalImages] = useState([]);
  const [modalIndex, setModalIndex] = useState(0);
  // Date range filter state
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  // Location filter state
  const [selectedLocation, setSelectedLocation] = useState("");
  // Activity intensity filter state
  const [selectedIntensity, setSelectedIntensity] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 25;

  // Helper to get only date part in yyyy-mm-dd
  const getDateString = (datetimeStr) => {
    if (!datetimeStr) return '';
    const date = new Date(datetimeStr);
    return date.toISOString().slice(0, 10);
  };

  // Get unique locations for dropdown
  const uniqueLocations = [...new Set(data.map(row => row.location))].sort();

  // Get unique intensity values from actual data
  const uniqueIntensities = [...new Set(data.map(row => row.intensity).filter(intensity => intensity))].sort();

  // Filtered data based on date range, location, and intensity
  const filteredData = data.filter(row => {
    // Date range filtering
    let dateFilter = true;
    if (dateFrom || dateTo) {
      const rowDate = getDateString(row.datetime);
      
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

    // Intensity filtering
    let intensityFilter = true;
    if (selectedIntensity) {
      intensityFilter = row.intensity === selectedIntensity;
    }

    // All filters must pass
    return dateFilter && locationFilter && intensityFilter;
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
      const response = await fetch(`${API_BASE_URL}/reports`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch reports');
      }

      const result = await response.json();
      setData(result.data || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
      setError(error.message);
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  // Delete report function
  const deleteReport = async (id) => {
    if (!window.confirm('Are you sure you want to delete this report?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/reports/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete report');
      }

      toast.success('Report deleted successfully');
      // Refresh the data
      fetchReports();
    } catch (error) {
      console.error('Error deleting report:', error);
      toast.error('Failed to delete report');
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchReports();
  }, []);

  // Open modal with images and selected index
  const openImageModal = (images, index) => {
    setModalImages(images);
    setModalIndex(index);
    setModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setModalOpen(false);
    setModalImages([]);
    setModalIndex(0);
  };

  // Slide to previous image
  const prevImage = (e) => {
    e.stopPropagation();
    setModalIndex((prev) => (prev === 0 ? modalImages.length - 1 : prev - 1));
  };

  // Slide to next image
  const nextImage = (e) => {
    e.stopPropagation();
    setModalIndex((prev) => (prev === modalImages.length - 1 ? 0 : prev + 1));
  };

  // Clear all filters
  const clearAllFilters = () => {
    setDateFrom("");
    setDateTo("");
    setSelectedLocation("");
    setSelectedIntensity("");
  };

  // Export as PDF
  const exportPDF = () => {
    try {
      const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'A4' });
      // Title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.text('CCTV Monitoring Report', doc.internal.pageSize.getWidth() / 2, 40, { align: 'center' });
      doc.setFontSize(10);
      const tableColumn = ['Sr. No.', 'DATE / TIME', 'LOCATION', 'ACTIVITY INTENSITY', 'FINDINGS / CONCERNS', 'IMAGES'];
      const tableRows = filteredData.map((row, idx) => [
        idx + 1,
        formatDateTime(row.datetime),
        row.location,
        row.intensity || '-',
        row.findings,
        (row.images && row.images.length > 0) ? row.images.map((img, i) => `Image${i+1}`).join(', ') : 'No Images',
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
          0: { cellWidth: 60 }, // S. No.
          1: { cellWidth: 120 }, // DATE / TIME
          2: { cellWidth: 180 }, // LOCATION
          3: { cellWidth: 100 }, // ACTIVITY INTENSITY
          4: { cellWidth: 300 }, // FINDINGS / CONCERNS
          5: { cellWidth: 120 }, // IMAGES
        },
        margin: { left: 20, right: 20 },
      });
      doc.save('CCTV_Monitoring_Report.pdf');
    } catch (err) {
      toast.error('Failed to export PDF. Please try again.');
      console.error('PDF export error:', err);
    }
  };

  // Export as Excel
  const exportExcel = () => {
    const wsData = [
      ['Sr. No.', 'DATE / TIME', 'LOCATION', 'ACTIVITY INTENSITY', 'FINDINGS / CONCERNS', 'IMAGES'],
      ...filteredData.map((row, idx) => [
        idx + 1,
        formatDateTime(row.datetime),
        row.location,
        row.intensity || '-',
        row.findings,
        (row.images && row.images.length > 0) ? row.images.map((img, i) => `Image${i+1}`).join(', ') : 'No Images',
      ])
    ];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Report');
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'CCTV_Monitoring_Report.xlsx');
  };

  if (loading) {
    return (
      <div style={{ fontFamily: 'Poppins, sans-serif' }}>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Loading reports...</div>
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
      {/* Google Fonts for Poppins */}
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <div style={{ fontFamily: 'Poppins, sans-serif' }}>
        <ToastContainer position="top-right" autoClose={3000} />
        {/* Modal for image slider */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70" onClick={closeModal}>
            <div className="relative bg-white rounded shadow-lg p-4 flex flex-col items-center" onClick={e => e.stopPropagation()}>
              <button className="absolute top-2 right-2 text-gray-600 hover:text-black text-2xl font-bold" onClick={closeModal}>&times;</button>
              <div className="flex items-center">
                <button onClick={prevImage} className="text-3xl px-2 text-[#36a9e1] hover:text-[#5bc0ee]">&#8592;</button>
                <img src={modalImages[modalIndex]} alt="modal-img" className="max-w-[60vw] max-h-[60vh] object-contain mx-4" />
                <button onClick={nextImage} className="text-3xl px-2 text-[#36a9e1] hover:text-[#5bc0ee]">&#8594;</button>
              </div>
              <div className="mt-2 text-center text-sm text-gray-700">
                Image {modalIndex + 1} of {modalImages.length}
              </div>
            </div>
          </div>
        )}
        <div className="mb-8">
          <div className="text-2xl font-medium text-center text-black mb-8 mt-6">CCTV MONITORING REPORT</div>
          
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
                
                {/* Activity intensity filter */}
                <div className="flex items-center gap-2">
                  <label className="text-gray-700 font-medium text-sm">Intensity:</label>
                  <select
                    value={selectedIntensity}
                    onChange={e => setSelectedIntensity(e.target.value)}
                    className="border border-gray-400 rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#36a9e1] bg-white text-black w-40"
                  >
                    <option value="">All Intensities</option>
                    {uniqueIntensities.map(intensity => (
                      <option key={intensity} value={intensity}>{intensity}</option>
                    ))}
                  </select>
                </div>
                
                {(dateFrom || dateTo || selectedLocation || selectedIntensity) && (
                  <button
                    onClick={clearAllFilters}
                    className="px-4 py-2 bg-[#99a1ad] text-white rounded font-medium text-sm hover:bg-[#b0b7c3] focus:outline-none focus:ring-2 focus:ring-[#5bc0ee] transition-colors duration-200"
                  >
                    Clear All
                  </button>
                )}
              </div>
              
              {/* Filter summary */}
              {(dateFrom || dateTo || selectedLocation || selectedIntensity) && (
                <div className="mt-2 text-sm text-gray-600">
                  Showing {filteredData.length} of {data.length} activities
                  {dateFrom && dateTo && ` from ${dateFrom} to ${dateTo}`}
                  {dateFrom && !dateTo && ` from ${dateFrom}`}
                  {!dateFrom && dateTo && ` until ${dateTo}`}
                  {selectedLocation && ` at ${selectedLocation}`}
                  {selectedIntensity && ` with ${selectedIntensity} intensity`}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-400 bg-white">
            <thead>
              <tr>
                <th className="border border-gray-400 px-4 py-2 text-center font-bold text-xs">Sr. No.</th>
                <th className="border border-gray-400 px-4 py-2 text-center font-bold text-xs">DATE / TIME</th>
                <th className="border border-gray-400 px-4 py-2 text-center font-bold text-xs">LOCATION</th>
                <th className="border border-gray-400 px-4 py-2 text-center font-bold text-xs">ACTIVITY INTENSITY</th>
                <th className="border border-gray-400 px-4 py-2 text-center font-bold text-xs">FINDINGS / CONCERNS</th>
                <th className="border border-gray-400 px-4 py-2 text-center font-bold text-xs">IMAGES</th>
                <th className="border border-gray-400 px-4 py-2 text-center font-bold text-xs">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-500">No activities found.</td>
                </tr>
              ) : (
                paginatedData.map((row, idx) => (
                  <tr key={row._id || idx}>
                    <td className="border border-gray-400 px-4 py-2 text-center text-xs">{(currentPage - 1) * entriesPerPage + idx + 1}</td>
                    <td className="border border-gray-400 px-4 py-2 text-left text-xs">{formatDateTime(row.datetime)}</td>
                    <td className="border border-gray-400 px-4 py-2 text-left text-xs">{row.location}</td>
                    <td className="border border-gray-400 px-4 py-2 text-center text-xs">{row.intensity || '-'}</td>
                    <td className="border border-gray-400 px-4 py-2 text-xs">{row.findings}</td>
                    <td className="border border-gray-400 px-4 py-2">
                      {row.images && row.images.length > 0 ? (
                        <div className="flex flex-wrap gap-2 justify-left">
                          {row.images.map((img, i) => (
                            <img
                              key={i}
                              src={img}
                              alt={`activity-img-${i}`}
                              className="w-12 h-12 object-cover rounded border cursor-pointer hover:scale-150 transition-transform"
                              onClick={() => openImageModal(row.images, i)}
                              title="Click to view and slide images"
                            />
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400">No Images</span>
                      )}
                    </td>
                    <td className="border border-gray-400 px-4 py-2 text-center">
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

export default ActivitiesReport; 