import React, { useState, useEffect } from 'react';
import './Applicants.css';
import { ApplicantModal } from '../ApplicantModal/ApplicantModal';

export const Applicants = () => {
  const [applicants, setApplicants] = useState([]);
  const [filteredApplicants, setFilteredApplicants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock applicants data
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      const mockApplicants = [
        {
          id: 1,
          name: 'Ahmed Mohamed',
          email: 'ahmed@example.com',
          phone: '+964 790 123 4567',
          job: 'Senior Developer',
          location: 'بغداد',
          appliedDate: '2026-07-24',
          status: 'pending',
          experience: '5+ سنوات',
          education: 'بكالوريوس هندسة برمجيات',
          avatar: '👨',
          score: 85,
        },
        {
          id: 2,
          name: 'Fatima Al-Rashid',
          email: 'fatima@example.com',
          phone: '+964 791 234 5678',
          job: 'UI/UX Designer',
          location: 'بغداد',
          appliedDate: '2026-07-23',
          status: 'accepted',
          experience: '3+ سنوات',
          education: 'بكالوريوس تصميم',
          avatar: '👩',
          score: 92,
        },
        {
          id: 3,
          name: 'Ali Hassan',
          email: 'ali@example.com',
          phone: '+964 792 345 6789',
          job: 'Project Manager',
          location: 'الموصل',
          appliedDate: '2026-07-22',
          status: 'rejected',
          experience: '7+ سنوات',
          education: 'ماستر إدارة أعمال',
          avatar: '👨',
          score: 65,
        },
        {
          id: 4,
          name: 'Layla Omar',
          email: 'layla@example.com',
          phone: '+964 793 456 7890',
          job: 'Senior Developer',
          location: 'كربلاء',
          appliedDate: '2026-07-24',
          status: 'pending',
          experience: '4+ سنوات',
          education: 'بكالوريوس علوم حاسوب',
          avatar: '👩',
          score: 88,
        },
        {
          id: 5,
          name: 'Mohammed Ali',
          email: 'mohammed@example.com',
          phone: '+964 794 567 8901',
          job: 'Data Analyst',
          location: 'بغداد',
          appliedDate: '2026-07-21',
          status: 'pending',
          experience: '2+ سنوات',
          education: 'بكالوريوس إحصاء',
          avatar: '👨',
          score: 75,
        },
      ];
      setApplicants(mockApplicants);
      setFilteredApplicants(mockApplicants);
      setIsLoading(false);
    }, 500);
  }, []);

  // Filter and search logic
  useEffect(() => {
    let result = applicants;

    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(app => app.status === statusFilter);
    }

    // Apply search filter
    if (searchTerm) {
      result = result.filter(app =>
        app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.job.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredApplicants(result);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, applicants]);

  // Pagination
  const totalPages = Math.ceil(filteredApplicants.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedApplicants = filteredApplicants.slice(startIndex, startIndex + itemsPerPage);

  const getStatusBadge = (status) => {
    const badges = {
      pending: { label: 'قيد الانتظار', color: '#ed8936', bg: '#fffaf0' },
      accepted: { label: 'مقبول', color: '#48bb78', bg: '#f0fff4' },
      rejected: { label: 'مرفوض', color: '#f56565', bg: '#fff5f5' },
    };
    return badges[status] || badges.pending;
  };

  const handleStatusChange = (applicantId, newStatus) => {
    setApplicants(prev =>
      prev.map(app =>
        app.id === applicantId ? { ...app, status: newStatus } : app
      )
    );
  };

  return (
    <div className="applicants-container">
      {/* Header */}
      <div className="applicants-header">
        <div>
          <h2>المتقدمون للوظائف</h2>
          <p>{filteredApplicants.length} متقدم</p>
        </div>
      </div>

      {/* Filters */}
      <div className="applicants-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="ابحث عن متقدم..."
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
          <option value="pending">قيد الانتظار</option>
          <option value="accepted">مقبول</option>
          <option value="rejected">مرفوض</option>
        </select>
      </div>

      {/* Applicants Grid */}
      {isLoading ? (
        <div className="loading">جاري التحميل...</div>
      ) : filteredApplicants.length === 0 ? (
        <div className="empty-state">
          <p>لا توجد طلبات</p>
        </div>
      ) : (
        <>
          <div className="applicants-grid">
            {paginatedApplicants.map((applicant) => {
              const statusBadge = getStatusBadge(applicant.status);
              return (
                <div key={applicant.id} className="applicant-card">
                  {/* Card Header */}
                  <div className="card-header">
                    <div className="applicant-avatar">{applicant.avatar}</div>
                    <span
                      className="status-badge"
                      style={{ color: statusBadge.color, backgroundColor: statusBadge.bg }}
                    >
                      {statusBadge.label}
                    </span>
                  </div>

                  {/* Card Content */}
                  <div className="card-content">
                    <h3>{applicant.name}</h3>
                    <p className="job-title">{applicant.job}</p>

                    <div className="applicant-info">
                      <div className="info-row">
                        <span className="label">البريد الإلكتروني:</span>
                        <span className="value">{applicant.email}</span>
                      </div>
                      <div className="info-row">
                        <span className="label">الهاتف:</span>
                        <span className="value">{applicant.phone}</span>
                      </div>
                      <div className="info-row">
                        <span className="label">الموقع:</span>
                        <span className="value">{applicant.location}</span>
                      </div>
                      <div className="info-row">
                        <span className="label">الخبرة:</span>
                        <span className="value">{applicant.experience}</span>
                      </div>
                      <div className="info-row">
                        <span className="label">التعليم:</span>
                        <span className="value">{applicant.education}</span>
                      </div>
                    </div>

                    {/* Score Bar */}
                    <div className="score-section">
                      <div className="score-label">
                        <span>درجة المطابقة</span>
                        <strong>{applicant.score}%</strong>
                      </div>
                      <div className="score-bar">
                        <div
                          className="score-fill"
                          style={{ width: `${applicant.score}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Applied Date */}
                    <p className="applied-date">📅 قدم الطلب في: {applicant.appliedDate}</p>
                  </div>

                  {/* Card Footer - Actions */}
                  <div className="card-footer">
                    {applicant.status === 'pending' ? (
                      <>
                        <button
                          className="btn-action btn-accept"
                          onClick={() => handleStatusChange(applicant.id, 'accepted')}
                        >
                          ✅ قبول
                        </button>
                        <button
                          className="btn-action btn-reject"
                          onClick={() => handleStatusChange(applicant.id, 'rejected')}
                        >
                          ❌ رفض
                        </button>
                      </>
                    ) : (
                      <>
                        <button className="btn-action btn-view">
                          👁️ عرض الملف
                        </button>
                        <button
                          className="btn-action btn-message"
                          onClick={() => setSelectedApplicant(applicant)}
                        >
                          💬 رسالة
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
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
