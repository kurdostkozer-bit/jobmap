import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../features/auth/slices/authSlice';
import './LoginPage.css';

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  
  const { isLoading, error } = useSelector(state => state.auth);

  const validateForm = () => {
    const newErrors = {};
    
    if (!email.trim()) {
      newErrors.email = 'البريد الإلكتروني مطلوب';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'البريد الإلكتروني غير صحيح';
    }
    
    if (!password) {
      newErrors.password = 'كلمة المرور مطلوبة';
    } else if (password.length < 8) {
      newErrors.password = 'كلمة المرور يجب أن تكون 8 أحرف على الأقل';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const result = await dispatch(login({ email, password })).unwrap();
      if (result) {
        navigate('/dashboard');
      }
    } catch (err) {
      setErrors({ submit: err?.message || 'خطأ في تسجيل الدخول' });
    }
  };

  const handleNavigateToRegister = () => {
    navigate('/register');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>مرحبا بك</h1>
          <p>سجل الدخول إلى حسابك</p>
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

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="email">البريد الإلكتروني</label>
            <input
              id="email"
              type="email"
              placeholder="example@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

          <button
            type="submit"
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? 'جاري التحميل...' : 'تسجيل الدخول'}
          </button>
        </form>

        <div className="login-footer">
          <p>
            لا تملك حسابا؟{' '}
            <button
              type="button"
              onClick={handleNavigateToRegister}
              className="register-link"
              disabled={isLoading}
            >
              سجل الآن
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
