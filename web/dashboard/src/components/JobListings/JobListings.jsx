import React, { useState, useEffect } from 'react';
import './JobListings.css';

export const JobListings = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(true);

  // Mock jobs data
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      const mockJobs = [
        {
          id: 1,
          title: 'Senior Developer',
          location: 'بغداد',
          salary: '5000-7000',
          currency: 'USD',
          applicants: 12,
          status: 'active',
          postedDate: '2026-07-20',
          views: 234,
          description: 'نبحث عن مطور خبير',
        },
        {
          id: 2,
          title: 'UI/UX Designer',
          location: 'بغداد',
          salary: '3500-4500',
          currency: 'USD',
          applicants: 8,
          status: 'active',
          postedDate: '2026-07-18',
          views: 156,
          description: 'مصمم واجهات ذو خبرة',
        },
        {
          id: 3,
          title: 'Project Manager',
          location: 'الموصل',
          salary: '4000-5500',
          currency: 'USD',
          applicants: 15,
          status: 'active',
          postedDate: '2026-07-15',
          views: 342,
          description: 'مدير مشاريع قيادي',
        },
        {
          id: 4,
          title: 'Marketing Specialist',
          location: 'بغداد',
          salary: '2500-3500',
          currency: 'USD',
          applicants: 5,
          status: 'closed',
          postedDate: '2026-07-10',
          views: 189,
          description: 'متخصص تسويق رقمي',
        },
        {
          id: 5,
          title: 'Data Analyst',
          location: 'كربلاء',
          salary: '3000-4000',
          currency: 'USD',
          applicants: 10,
          status: 'active',
          postedDate: '2026-07-22',
          views: 267,
          description: 'محلل بيانات',
        },
      ];
      setJobs(mockJobs);
      setFilteredJobs(mockJobs);
      setIsLoading(false);
    }, 500);
  }, []);

  // Filter and search logic
  useEffect(() => {
    let result = jobs;

    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(job => job.status === statusFilter);
    }

    // Apply search filter
    if (searchTerm) {
      result = result.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredJobs(result);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, jobs]);

  // Pagination
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedJobs = filteredJobs.slice(startIndex, startIndex + itemsPerPage);

  const getStatusBadge = (status) => {
    return status === 'active'
      ? { label: 'نشط', color: '#48bb78', bg: '#f0fff4' }
      : { label: 'مغلق', color: '#f56565', bg: '#fff5f5' };
  };

  return (
    <div className="job-listings">
      {/* Header */}
      <div className="jobs-header">
        <div>
          <h2>الوظائف المنشورة</h2>
          <p>{filteredJobs.length} وظيفة</p>
        </div>
        <button className="btn-create-job">➕ وظيفة جديدة</button>
      </div>

      {/* Filters */}
      <div className="jobs-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="ابحث عن وظيفة..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="filter-select"
        >
          <option value="all">جميع الحالات</option>
          <option value="active">نشطة</option>
          <option value="closed">مغلقة</option>
        </select>
      </div>

      {/* Jobs Table */}
      {isLoading ? (
        <div className="loading">جاري التحميل...</div>
      ) : filteredJobs.length === 0 ? (
        <div className="empty-state">
          <p>لا توجد وظائف</p>
        </div>
      ) : (
        <>
          <div className="jobs-table-wrapper">
            <table className="jobs-table">
              <thead>
                <tr>
                  <th>الوظيفة</th>
                  <th>الموقع</th>
                  <th>الراتب</th>
                  <th>المتقدمون</th>
                  <th>المشاهدات</th>
                  <th>الحالة</th>
                  <th>تاريخ النشر</th>
                  <th>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {paginatedJobs.map((job) => {
                  const statusBadge = getStatusBadge(job.status);
                  return (
                    <tr key={job.id} className="job-row">
                      <td className="job-title-cell">
                        <div>
                          <strong>{job.title}</strong>
                          <small>{job.description}</small>
                        </div>
                      </td>
                      <td>{job.location}</td>
                      <td className="salary-cell">
                        <strong>{job.salary}</strong>
                        <small>{job.currency}</small>
                      </td>
                      <td>
                        <span className="badge-applicants">👥 {job.applicants}</span>
                      </td>
                      <td>{job.views}</td>
                      <td>
                        <span
                          className="status-badge"
                          style={{ color: statusBadge.color, backgroundColor: statusBadge.bg }}
                        >
                          {statusBadge.label}
                        </span>
                      </td>
                      <td className="date-cell">{job.postedDate}</td>
                      <td className="actions-cell">
                        <button className="btn-action" title="عرض">👁️</button>
                        <button className="btn-action" title="تعديل">✏️</button>
                        <button className="btn-action" title="حذف">🗑️</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                ◀ السابق
              </button>

              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={currentPage === i + 1 ? 'active' : ''}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                التالي ▶
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
