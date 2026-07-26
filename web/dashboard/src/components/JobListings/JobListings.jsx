import React, { useState, useEffect } from 'react';
import './JobListings.css';
import { JobModal } from '../JobModal/JobModal';
import jobService from '../../core/services/jobService';

export const JobListings = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadJobs = async () => {
      setIsLoading(true);
      try {
        const response = await jobService.getJobs();
        const data = Array.isArray(response) ? response : response?.items || [];
        const normalizedJobs = data.map((job) => ({
          id: job.id,
          title: job.title,
          location: job.location || job.governorate || 'غير محدد',
          salary: job.salary ? `${job.salary}` : 'غير محدد',
          currency: job.currency || 'USD',
          applicants: job.applicantsCount || 0,
          status: job.isActive ? 'active' : 'closed',
          postedDate: job.createdAt ? new Date(job.createdAt).toISOString().split('T')[0] : '-',
          views: job.views || 0,
          description: job.description || 'لا يوجد وصف',
        }));

        setJobs(normalizedJobs);
        setFilteredJobs(normalizedJobs);
      } catch (error) {
        console.error('Failed to load jobs:', error);
        setJobs([]);
        setFilteredJobs([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadJobs();
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

  const handleJobSubmit = async (formData) => {
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        salaryMin: formData.salaryMin,
        salaryMax: formData.salaryMax,
        currency: 'USD',
      };

      const createdJob = await jobService.createJob(payload);
      const normalizedJob = {
        id: createdJob.id,
        title: createdJob.title,
        location: createdJob.location || 'غير محدد',
        salary: createdJob.salary ? `${createdJob.salary}` : 'غير محدد',
        currency: createdJob.currency || 'USD',
        applicants: createdJob.applicantsCount || 0,
        status: createdJob.isActive ? 'active' : 'closed',
        postedDate: createdJob.createdAt ? new Date(createdJob.createdAt).toISOString().split('T')[0] : '-',
        views: createdJob.views || 0,
        description: createdJob.description || 'لا يوجد وصف',
      };

      setJobs(prev => [normalizedJob, ...prev]);
      setFilteredJobs(prev => [normalizedJob, ...prev]);
      setIsModalOpen(false);
      alert('✅ تم إنشاء الوظيفة بنجاح!');
    } catch (error) {
      console.error('Failed to create job:', error);
      alert('❌ فشل إنشاء الوظيفة');
    }
  };

  return (
    <>
      <div className="job-listings">
        {/* Header */}
        <div className="jobs-header">
          <div>
            <h2>الوظائف المنشورة</h2>
            <p>{filteredJobs.length} وظيفة</p>
          </div>
          <button 
            className="btn-create-job"
            onClick={() => setIsModalOpen(true)}
          >
            ➕ وظيفة جديدة
          </button>
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

      {/* Job Modal */}
      <JobModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleJobSubmit}
      />
    </>
  );
};
