import React, { useState } from 'react';
import './ApplicantModal.css';

export const ApplicantModal = ({ isOpen, applicant, onClose, onStatusChange }) => {
  const [note, setNote] = useState('');
  const [showNoteForm, setShowNoteForm] = useState(false);

  if (!isOpen || !applicant) return null;

  const getStatusBadge = (status) => {
    const badges = {
      pending: { label: 'قيد الانتظار', color: '#ed8936', bg: '#fffaf0' },
      accepted: { label: 'مقبول', color: '#48bb78', bg: '#f0fff4' },
      rejected: { label: 'مرفوض', color: '#f56565', bg: '#fff5f5' },
    };
    return badges[status] || badges.pending;
  };

  const handleAddNote = () => {
    if (note.trim()) {
      alert(`✅ تم إضافة الملاحظة: "${note}"`);
      setNote('');
      setShowNoteForm(false);
    }
  };

  const statusBadge = getStatusBadge(applicant.status);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="header-content">
            <div className="applicant-avatar-large">{applicant.avatar}</div>
            <div>
              <h2>{applicant.name}</h2>
              <p className="job-title">{applicant.job}</p>
            </div>
          </div>
          <div className="header-actions">
            <span
              className="status-badge-large"
              style={{ color: statusBadge.color, backgroundColor: statusBadge.bg }}
            >
              {statusBadge.label}
            </span>
            <button className="modal-close" onClick={onClose}>✕</button>
          </div>
        </div>

        {/* Content */}
        <div className="modal-content">
          {/* Contact Information */}
          <section className="info-section">
            <h3>📋 معلومات التواصل</h3>
            <div className="info-grid">
              <div className="info-item">
                <label>البريد الإلكتروني</label>
                <p>{applicant.email}</p>
              </div>
              <div className="info-item">
                <label>رقم الهاتف</label>
                <p>{applicant.phone}</p>
              </div>
              <div className="info-item">
                <label>الموقع</label>
                <p>{applicant.location}</p>
              </div>
              <div className="info-item">
                <label>تاريخ التقديم</label>
                <p>{applicant.appliedDate}</p>
              </div>
            </div>
          </section>

          {/* Professional Information */}
          <section className="info-section">
            <h3>💼 معلومات مهنية</h3>
            <div className="info-grid">
              <div className="info-item">
                <label>الخبرة</label>
                <p>{applicant.experience}</p>
              </div>
              <div className="info-item">
                <label>التعليم</label>
                <p>{applicant.education}</p>
              </div>
            </div>
          </section>

          {/* Matching Score */}
          <section className="info-section">
            <h3>📊 درجة المطابقة</h3>
            <div className="score-container">
              <div className="score-display">
                <span className="score-value">{applicant.score}%</span>
                <span className="score-label">مطابقة مثالية</span>
              </div>
              <div className="score-bar-large">
                <div
                  className="score-fill"
                  style={{ width: `${applicant.score}%` }}
                ></div>
              </div>
              <div className="score-breakdown">
                <div className="breakdown-item">
                  <span>✅ المهارات المطلوبة</span>
                  <span>{applicant.score}%</span>
                </div>
                <div className="breakdown-item">
                  <span>📚 المؤهلات</span>
                  <span>{applicant.score - 5}%</span>
                </div>
                <div className="breakdown-item">
                  <span>⏰ الخبرة المطلوبة</span>
                  <span>{applicant.score - 2}%</span>
                </div>
              </div>
            </div>
          </section>

          {/* About Applicant */}
          <section className="info-section">
            <h3>📝 عن المتقدم</h3>
            <div className="about-box">
              <p>
                متقدم متميز يتمتع بخبرة قوية في المجال ولديه مهارات تقنية عالية.
                يسعى للعمل في بيئة احترافية متطورة ويتمتع بروح الفريق والالتزام.
              </p>
            </div>
          </section>

          {/* Attachments */}
          <section className="info-section">
            <h3>📎 المرفقات</h3>
            <div className="attachments">
              <a href="#" className="attachment-item">
                <span>📄</span>
                <span>Resume.pdf</span>
              </a>
              <a href="#" className="attachment-item">
                <span>📄</span>
                <span>CoverLetter.docx</span>
              </a>
            </div>
          </section>

          {/* Notes Section */}
          <section className="info-section">
            <div className="notes-header">
              <h3>📌 ملاحظات</h3>
              <button
                className="btn-add-note"
                onClick={() => setShowNoteForm(!showNoteForm)}
              >
                {showNoteForm ? '✕ إلغاء' : '➕ إضافة ملاحظة'}
              </button>
            </div>

            {showNoteForm && (
              <div className="note-form">
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="اكتب ملاحظتك هنا..."
                  rows="3"
                />
                <button
                  className="btn-save-note"
                  onClick={handleAddNote}
                  disabled={!note.trim()}
                >
                  💾 حفظ الملاحظة
                </button>
              </div>
            )}

            <div className="notes-list">
              <div className="note-item">
                <div className="note-header">
                  <span className="note-author">أنت</span>
                  <span className="note-date">2026-07-25</span>
                </div>
                <p>مرشح قوي جداً - يستحق المقابلة الشخصية</p>
              </div>
            </div>
          </section>
        </div>

        {/* Footer Actions */}
        <div className="modal-footer">
          {applicant.status === 'pending' ? (
            <>
              <button
                className="btn-action btn-reject"
                onClick={() => onStatusChange(applicant.id, 'rejected')}
              >
                ❌ رفض الطلب
              </button>
              <button
                className="btn-action btn-accept"
                onClick={() => onStatusChange(applicant.id, 'accepted')}
              >
                ✅ قبول الطلب
              </button>
            </>
          ) : (
            <>
              <button
                className="btn-action btn-message"
                onClick={() => alert('💬 فتح محادثة مع ' + applicant.name)}
              >
                💬 إرسال رسالة
              </button>
              <button
                className="btn-action btn-schedule"
                onClick={() => alert('📅 جدولة مقابلة مع ' + applicant.name)}
              >
                📅 جدولة مقابلة
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
