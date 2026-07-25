import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { register } from '../features/auth/slices/authSlice';
import './RegisterPage.css';

function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'seeker',
  });
  
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  
  const { isLoading, error } = useSelector(state => state.auth);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'الاسم الأول مطلوب';
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'الاسم الأول يجب أن يكون حرفين على الأقل';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'اسم العائلة مطلوب';
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'اسم العائلة يجب أن يكون حرفين على الأقل';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'البريد الإلكتروني مطلوب';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'البريد الإلكتروني غير صحيح';
    }
    
    if (!formData.password) {
      newErrors.password = 'كلمة المرور مطلوبة';
    } else if (formData.password.length < 8) {
      newErrors.password = 'كلمة المرور يجب أن تكون 8 أحرف على الأقل';
    } else if (formData.password.length > 32) {
      newErrors.password = 'كلمة المرور يجب أن تكون 32 حرف كحد أقصى';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const result = await dispatch(register(formData)).unwrap();
      if (result) {
        // navigate('/dashboard');
      }
    } catch (err) {
      setErrors({ submit: err?.message || 'خطأ في إنشاء الحساب' });
    }
  };

  const handleNavigateToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h1>انضم إلينا</h1>
          <p>أنشئ حسابك الآن</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {errors.submit && (
          <div className="error-message">
            {errors.submit}
          </div>
        )}

        <form onSubmit={handleRegister} className="register-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">الاسم الأول</label>
              <input
                id="firstName"
                type="text"
                name="firstName"
                placeholder="أحمد"
                value={formData.firstName}
                onChange={handleChange}
                disabled={isLoading}
                className={errors.firstName ? 'input-error' : ''}
                dir="rtl"
              />
              {errors.firstName && <span className="error-text">{errors.firstName}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="lastName">اسم العائلة</label>
              <input
                id="lastName"
                type="text"
                name="lastName"
                placeholder="محمد"
                value={formData.lastName}
                onChange={handleChange}
                disabled={isLoading}
                className={errors.lastName ? 'input-error' : ''}
                dir="rtl"
              />
              {errors.lastName && <span className="error-text">{errors.lastName}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">البريد الإلكتروني</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="example@mail.com"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
              className={errors.email ? 'input-error' : ''}
              dir="rtl"
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">كلمة المرور</label>
            <div className="password-input-wrapper">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
                className={errors.password ? 'input-error' : ''}
                dir="rtl"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="role">نوع الحساب</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              disabled={isLoading}
              className="role-select"
              dir="rtl"
            >
              <option value="seeker">طالب وظيفة</option>
              <option value="employer">صاحب عمل</option>
            </select>
          </div>

          <button
            type="submit"
            className="register-button"
            disabled={isLoading}
          >
            {isLoading ? 'جاري التحميل...' : 'إنشاء الحساب'}
          </button>
        </form>

        <div className="register-footer">
          <p>
            لديك حساب بالفعل؟{' '}
            <button
              type="button"
              onClick={handleNavigateToLogin}
              className="login-link"
              disabled={isLoading}
            >
              سجل الدخول
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
