import React, { useState } from 'react';
import './OnboardingPage.css';

/**
 * OnboardingPage - First-time user experience
 * 
 * Flow:
 * 1. Welcome screen (with JobMap branding)
 * 2. Location permission request
 * 3. Either: GPS granted → Map page, OR Skip → Map with default center
 */
export const OnboardingPage = ({ onComplete }) => {
  const [step, setStep] = useState('welcome'); // welcome, permission, loading, error
  const [error, setError] = useState(null);

  // Request geolocation
  const requestLocation = () => {
    setStep('permission');

    if (!navigator.geolocation) {
      setError('متصفحك لا يدعم تحديد الموقع');
      setStep('error');
      return;
    }

    setStep('loading');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log('Location granted:', { latitude, longitude });
        
        // Call parent callback with location
        onComplete({
          latitude,
          longitude,
          granted: true,
        });
      },
      (error) => {
        console.error('Location error:', error);
        if (error.code === 1) {
          setError('تم رفض صلاحية الموقع. يمكنك تفعيلها لاحقاً.');
        } else if (error.code === 2) {
          setError('لم يتمكن النظام من تحديد موقعك.');
        } else if (error.code === 3) {
          setError('انتظر طويل لتحديد الموقع. حاول لاحقاً.');
        } else {
          setError('حدث خطأ في تحديد الموقع.');
        }
        setStep('error');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // Skip location and use default
  const skipLocation = () => {
    onComplete({
      latitude: 33.3136, // Baghdad center
      longitude: 44.3615,
      granted: false,
    });
  };

  // Retry location
  const retryLocation = () => {
    setError(null);
    requestLocation();
  };

  return (
    <div className="onboarding-container">
      {/* Welcome Step */}
      {step === 'welcome' && (
        <div className="onboarding-step welcome-step">
          <div className="welcome-content">
            <div className="welcome-logo">🗺️</div>
            <h1 className="welcome-title">مرحبًا بك في JobMap</h1>
            <p className="welcome-subtitle">
              اكتشف فرص العمل حول موقعك
            </p>
            
            <div className="welcome-benefits">
              <div className="benefit-item">
                <span className="benefit-icon">📍</span>
                <span className="benefit-text">وظائف قريبة منك</span>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">🎯</span>
                <span className="benefit-text">اكتشاف المناطق الساخنة</span>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">⏱️</span>
                <span className="benefit-text">وقت وصول حقيقي</span>
              </div>
            </div>

            <div className="welcome-actions">
              <button 
                className="btn-primary btn-request-location"
                onClick={requestLocation}
              >
                📍 استخدام موقعي الحالي
              </button>
              <button 
                className="btn-secondary btn-skip"
                onClick={skipLocation}
              >
                تخطي (استعرض الخريطة)
              </button>
            </div>

            <p className="welcome-note">
              نحن لا نحفظ أو نشارك موقعك. يُستخدم فقط لتحسين تجربتك.
            </p>
          </div>
        </div>
      )}

      {/* Loading Step */}
      {step === 'loading' && (
        <div className="onboarding-step loading-step">
          <div className="loading-content">
            <div className="loading-spinner"></div>
            <h2>جاري تحديد موقعك...</h2>
            <p>قد يستغرق بضع ثوانٍ</p>
          </div>
        </div>
      )}

      {/* Error Step */}
      {step === 'error' && (
        <div className="onboarding-step error-step">
          <div className="error-content">
            <div className="error-icon">⚠️</div>
            <h2>حدث خطأ</h2>
            <p className="error-message">{error}</p>
            
            <div className="error-actions">
              <button 
                className="btn-primary"
                onClick={retryLocation}
              >
                🔄 حاول مجدداً
              </button>
              <button 
                className="btn-secondary"
                onClick={skipLocation}
              >
                تخطي وابدأ الاستكشاف
              </button>
            </div>

            <details className="error-details">
              <summary>هل تحتاج إلى مساعدة؟</summary>
              <div className="help-content">
                <h4>كيف تفعّل صلاحية الموقع:</h4>
                <ul>
                  <li><strong>iPhone:</strong> الإعدادات → الخصوصية → تحديد الموقع</li>
                  <li><strong>Android:</strong> الإعدادات → التطبيقات → الأذونات → الموقع</li>
                  <li><strong>Desktop:</strong> انقر على رمز الموقع في شريط العنوان</li>
                </ul>
              </div>
            </details>
          </div>
        </div>
      )}
    </div>
  );
};
