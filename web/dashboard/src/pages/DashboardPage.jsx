import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../features/auth/slices/authSlice';
import { DashboardLayout } from '../components/DashboardLayout/DashboardLayout';
import { StatsCard } from '../components/StatsCard/StatsCard';
import { JobListings } from '../components/JobListings/JobListings';

function DashboardPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const [activeTab, setActiveTab] = useState('overview');

  if (!isAuthenticated) {
    navigate('/');
    return null;
  }

  // Mock data for stats
  const stats = [
    {
      id: 1,
      icon: '💼',
      title: 'الوظائف النشطة',
      value: '12',
      subtext: '3 وظائف جديدة',
      trend: { direction: 'up', value: 25 },
      color: 'blue',
    },
    {
      id: 2,
      icon: '👥',
      title: 'إجمالي المتقدمين',
      value: '48',
      subtext: '5 متقدمين جدد',
      trend: { direction: 'up', value: 12 },
      color: 'green',
    },
    {
      id: 3,
      icon: '✅',
      title: 'مقبولون',
      value: '8',
      subtext: 'في الانتظار',
      trend: { direction: 'up', value: 8 },
      color: 'orange',
    },
    {
      id: 4,
      icon: '⏳',
      title: 'قيد المراجعة',
      value: '15',
      subtext: 'يحتاج اهتمام',
      trend: { direction: 'down', value: 5 },
      color: 'red',
    },
  ];

  return (
    <DashboardLayout onTabChange={setActiveTab}>
      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="dashboard-overview">
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{ margin: '0 0 20px 0', color: '#1a202c' }}>
              مرحباً {user?.firstName} 👋
            </h2>
            <p style={{ color: '#718096', margin: 0 }}>
              إليك ملخص نشاطك اليومي
            </p>
          </div>

          {/* Stats Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginBottom: '40px',
          }}>
            {stats.map(stat => (
              <StatsCard
                key={stat.id}
                icon={stat.icon}
                title={stat.title}
                value={stat.value}
                subtext={stat.subtext}
                trend={stat.trend}
                color={stat.color}
              />
            ))}
          </div>

          {/* Recent Activity */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          }}>
            <h3 style={{ margin: '0 0 20px 0', color: '#1a202c' }}>
              النشاط الأخير
            </h3>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '15px',
            }}>
              <div style={{
                padding: '15px',
                background: '#f7fafc',
                borderRadius: '8px',
                borderRight: '4px solid #667eea',
              }}>
                <p style={{ margin: '0 0 5px 0', fontWeight: 600, color: '#1a202c' }}>
                  طلب جديد من Ahmed Mohamed
                </p>
                <p style={{ margin: 0, fontSize: '12px', color: '#718096' }}>
                  قبل 5 دقائق • وظيفة: Senior Developer
                </p>
              </div>
              <div style={{
                padding: '15px',
                background: '#f7fafc',
                borderRadius: '8px',
                borderRight: '4px solid #48bb78',
              }}>
                <p style={{ margin: '0 0 5px 0', fontWeight: 600, color: '#1a202c' }}>
                  تم قبول طلب Fatima Al-Rashid
                </p>
                <p style={{ margin: 0, fontSize: '12px', color: '#718096' }}>
                  قبل ساعة • وظيفة: UI/UX Designer
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Jobs Tab */}
      {activeTab === 'jobs' && (
        <JobListings />
      )}

      {/* Applicants Tab */}
      {activeTab === 'applicants' && (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <h2>المتقدمون</h2>
          <p style={{ color: '#718096' }}>سيتم بناؤها قريباً...</p>
        </div>
      )}

      {/* Company Tab */}
      {activeTab === 'company' && (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <h2>بيانات الشركة</h2>
          <p style={{ color: '#718096' }}>سيتم بناؤها قريباً...</p>
        </div>
      )}
    </DashboardLayout>
  );
}

export default DashboardPage;

