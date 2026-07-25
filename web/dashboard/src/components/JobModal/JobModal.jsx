import React, { useState } from 'react';
import './JobModal.css';

export const JobModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    salaryMin: '',
    salaryMax: '',
    description: '',
    requirements: '',
    responsibilities: '',
    jobType: 'full-time',
    experience: 'entry',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'عنوان الوظيفة مطلوب';
    if (!formData.location.trim()) newErrors.location = 'الموقع مطلوب';
    if (!formData.salaryMin) newErrors.salaryMin = 'الراتب الأدنى مطلوب';
    if (!formData.salaryMax) newErrors.salaryMax = 'الراتب الأقصى مطلوب';
    if (Number(formData.salaryMin) > Number(formData.salaryMax)) {
      newErrors.salary = 'الراتب الأدنى لا يمكن أن يكون أكبر من الأقصى';
    }
    if (!formData.description.trim()) newErrors.description = 'الوصف مطلوب';
    if (!formData.requirements.trim()) newErrors.requirements = 'المتطلبات مطلوبة';
    if (!formData.responsibilities.trim()) newErrors.responsibilities = 'المسؤوليات مطلوبة';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      setFormData({
        title: '',
        location: '',
        salaryMin: '',
        salaryMax: '',
        description: '',
        requirements: '',
        responsibilities: '',
        jobType: 'full-time',
        experience: 'entry',
      });
      setErrors({});
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        {/* Header */}
        <div className="modal-header">
          <h2>إنشاء وظيفة جديدة</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="job-form">
          <div className="form-section">
            <h3>معلومات الوظيفة الأساسية</h3>

            {/* Job Title */}
            <div className="form-group">
              <label htmlFor="title">عنوان الوظيفة *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="مثال: Senior Developer"
                className={errors.title ? 'input-error' : ''}
              />
              {errors.title && <span className="error-message">{errors.title}</span>}
            </div>

            {/* Location */}
            <div className="form-group">
              <label htmlFor="location">الموقع *</label>
              <select
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className={errors.location ? 'input-error' : ''}
              >
                <option value="">اختر الموقع</option>
                <option value="بغداد">بغداد</option>
                <option value="الموصل">الموصل</option>
                <option value="كربلاء">كربلاء</option>
                <option value="البصرة">البصرة</option>
                <option value="الناصرية">الناصرية</option>
                <option value="أربيل">أربيل</option>
              </select>
              {errors.location && <span className="error-message">{errors.location}</span>}
            </div>

            {/* Job Type & Experience - Row */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="jobType">نوع العمل</label>
                <select
                  id="jobType"
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleChange}
                >
                  <option value="full-time">دوام كامل</option>
                  <option value="part-time">دوام جزئي</option>
                  <option value="contract">عقد</option>
                  <option value="temporary">مؤقت</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="experience">مستوى الخبرة</label>
                <select
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                >
                  <option value="entry">مبتدئ</option>
                  <option value="mid">متوسط</option>
                  <option value="senior">خبير</option>
                  <option value="lead">قيادي</option>
                </select>
              </div>
            </div>

            {/* Salary Range */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="salaryMin">الراتب الأدنى (USD) *</label>
                <input
                  type="number"
                  id="salaryMin"
                  name="salaryMin"
                  value={formData.salaryMin}
                  onChange={handleChange}
                  placeholder="مثال: 2000"
                  className={errors.salaryMin ? 'input-error' : ''}
                />
                {errors.salaryMin && <span className="error-message">{errors.salaryMin}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="salaryMax">الراتب الأقصى (USD) *</label>
                <input
                  type="number"
                  id="salaryMax"
                  name="salaryMax"
                  value={formData.salaryMax}
                  onChange={handleChange}
                  placeholder="مثال: 5000"
                  className={errors.salaryMax ? 'input-error' : ''}
                />
                {errors.salaryMax && <span className="error-message">{errors.salaryMax}</span>}
              </div>
            </div>

            {errors.salary && <span className="error-message">{errors.salary}</span>}
          </div>

          {/* Description Section */}
          <div className="form-section">
            <h3>وصف الوظيفة</h3>

            <div className="form-group">
              <label htmlFor="description">الوصف *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="اكتب وصفاً مفصلاً للوظيفة..."
                rows="4"
                className={errors.description ? 'input-error' : ''}
              />
              {errors.description && <span className="error-message">{errors.description}</span>}
            </div>
          </div>

          {/* Requirements & Responsibilities */}
          <div className="form-section">
            <h3>المتطلبات والمسؤوليات</h3>

            <div className="form-group">
              <label htmlFor="requirements">المتطلبات *</label>
              <textarea
                id="requirements"
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                placeholder="اكتب المتطلبات (كل متطلب في سطر جديد)..."
                rows="4"
                className={errors.requirements ? 'input-error' : ''}
              />
              {errors.requirements && <span className="error-message">{errors.requirements}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="responsibilities">المسؤوليات *</label>
              <textarea
                id="responsibilities"
                name="responsibilities"
                value={formData.responsibilities}
                onChange={handleChange}
                placeholder="اكتب المسؤوليات (كل مسؤولية في سطر جديد)..."
                rows="4"
                className={errors.responsibilities ? 'input-error' : ''}
              />
              {errors.responsibilities && <span className="error-message">{errors.responsibilities}</span>}
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              onClick={onClose}
              className="btn-cancel"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="btn-submit"
            >
              إنشاء الوظيفة
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
