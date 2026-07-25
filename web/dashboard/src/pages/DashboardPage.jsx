import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../features/auth/slices/authSlice';
import { NotificationCenter } from '../components/NotificationCenter/NotificationCenter';

function DashboardPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector(state => state.auth);

  if (!isAuthenticated) {
    navigate('/');
    return null;
  }

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>JobMap Dashboard</h1>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <NotificationCenter />
          <button
            onClick={handleLogout}
            style={{
              padding: '10px 20px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            تسجيل الخروج
          </button>
        </div>
      </div>
      
      <div style={{ 
        backgroundColor: '#f8f9fa', 
        padding: '15px', 
        borderRadius: '4px',
        marginBottom: '20px'
      }}>
        <h2>مرحبا، {user?.firstName} {user?.lastName}</h2>
        <p>البريد الإلكتروني: {user?.email}</p>
      </div>

      <p>Welcome to the employer dashboard</p>
    </div>
  );
}

export default DashboardPage;
