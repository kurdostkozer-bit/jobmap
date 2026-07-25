import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import './Analytics.css';

export const Analytics = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  // Data for Applications Over Time (Line Chart)
  const applicationsOverTime = [
    { date: 'يوم 1', applications: 12 },
    { date: 'يوم 2', applications: 19 },
    { date: 'يوم 3', applications: 15 },
    { date: 'يوم 4', applications: 25 },
    { date: 'يوم 5', applications: 22 },
    { date: 'يوم 6', applications: 30 },
    { date: 'يوم 7', applications: 28 },
  ];

  // Data for Application Status Distribution (Pie Chart)
  const applicationStatus = [
    { name: 'مقبول', value: 35, color: '#48bb78' },
    { name: 'قيد الانتظار', value: 45, color: '#ed8936' },
    { name: 'مرفوض', value: 20, color: '#f56565' },
  ];

  // Data for Job Performance (Bar Chart)
  const jobPerformance = [
    { job: 'Senior Dev', views: 234, applicants: 12, hired: 2 },
    { job: 'UI/UX', views: 156, applicants: 8, hired: 1 },
    { job: 'PM', views: 342, applicants: 15, hired: 3 },
    { job: 'Analyst', views: 267, applicants: 10, hired: 2 },
  ];

  // Data for Conversion Rates by Job Type (Bar Chart)
  const conversionRates = [
    { job: 'Senior Dev', rate: 16.7 },
    { job: 'UI/UX', rate: 12.5 },
    { job: 'PM', rate: 20.0 },
    { job: 'Analyst', rate: 20.0 },
    { job: 'Marketing', rate: 10.0 },
  ];

  // Data for Top Jobs by Views (Horizontal Bar)
  const topJobsByViews = [
    { job: 'Project Manager', views: 342 },
    { job: 'Senior Developer', views: 234 },
    { job: 'Data Analyst', views: 267 },
    { job: 'UI/UX Designer', views: 156 },
  ];

  // Custom Tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p>{`${payload[0].payload.date || payload[0].payload.job}: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return <div className="analytics-loading">جاري تحميل التحليلات...</div>;
  }

  return (
    <div className="analytics-container">
      {/* Header */}
      <div className="analytics-header">
        <h2>التحليلات والإحصائيات</h2>
        <p>ملخص شامل لأداء وظائفك ومتقدميك</p>
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        {/* Applications Over Time - Line Chart */}
        <div className="chart-card">
          <h3>الطلبات عبر الوقت</h3>
          <p className="chart-subtitle">عدد الطلبات المستلمة يومياً</p>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={applicationsOverTime} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e1e8ed" />
              <XAxis dataKey="date" stroke="#718096" style={{ fontSize: '12px' }} />
              <YAxis stroke="#718096" style={{ fontSize: '12px' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="applications"
                stroke="#667eea"
                strokeWidth={3}
                dot={{ fill: '#667eea', r: 5 }}
                activeDot={{ r: 7 }}
                name="عدد الطلبات"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Application Status Distribution - Pie Chart */}
        <div className="chart-card">
          <h3>توزيع حالات الطلبات</h3>
          <p className="chart-subtitle">نسبة الطلبات حسب الحالة</p>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={applicationStatus}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {applicationStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value} طلب`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Job Performance - Bar Chart */}
        <div className="chart-card chart-full-width">
          <h3>أداء الوظائف</h3>
          <p className="chart-subtitle">مقارنة بين المشاهدات والمتقدمين والمقبولين</p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={jobPerformance} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e1e8ed" />
              <XAxis dataKey="job" stroke="#718096" style={{ fontSize: '12px' }} />
              <YAxis stroke="#718096" style={{ fontSize: '12px' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="views" fill="#667eea" name="المشاهدات" />
              <Bar dataKey="applicants" fill="#ed8936" name="المتقدمون" />
              <Bar dataKey="hired" fill="#48bb78" name="المقبولون" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Conversion Rates - Bar Chart */}
        <div className="chart-card">
          <h3>معدلات التحويل</h3>
          <p className="chart-subtitle">نسبة التحويل من متقدم إلى مقبول</p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={conversionRates}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 150, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e1e8ed" />
              <XAxis type="number" stroke="#718096" style={{ fontSize: '12px' }} />
              <YAxis dataKey="job" type="category" stroke="#718096" style={{ fontSize: '12px' }} />
              <Tooltip
                formatter={(value) => `${value.toFixed(1)}%`}
                cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
              />
              <Bar dataKey="rate" fill="#764ba2" name="معدل التحويل %" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Jobs by Views - Horizontal Bar */}
        <div className="chart-card">
          <h3>أفضل الوظائف بالمشاهدات</h3>
          <p className="chart-subtitle">الوظائف التي حصلت على أعلى عدد مشاهدات</p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={topJobsByViews}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 150, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e1e8ed" />
              <XAxis type="number" stroke="#718096" style={{ fontSize: '12px' }} />
              <YAxis dataKey="job" type="category" stroke="#718096" style={{ fontSize: '12px' }} />
              <Tooltip
                formatter={(value) => [`${value} مشاهدة`, 'المشاهدات']}
                cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
              />
              <Bar dataKey="views" fill="#48bb78" name="المشاهدات" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <div className="summary-icon">📊</div>
          <h4>متوسط الطلبات يومياً</h4>
          <p className="summary-value">22.4</p>
          <p className="summary-change positive">↑ 15% عن الأسبوع الماضي</p>
        </div>

        <div className="summary-card">
          <div className="summary-icon">✅</div>
          <h4>معدل القبول الكلي</h4>
          <p className="summary-value">16.1%</p>
          <p className="summary-change positive">↑ 3% عن المتوسط</p>
        </div>

        <div className="summary-card">
          <div className="summary-icon">👁️</div>
          <h4>إجمالي المشاهدات</h4>
          <p className="summary-value">999</p>
          <p className="summary-change negative">↓ 5% عن الشهر الماضي</p>
        </div>

        <div className="summary-card">
          <div className="summary-icon">⏱️</div>
          <h4>متوسط وقت التقديم</h4>
          <p className="summary-value">2.3 ساعة</p>
          <p className="summary-change positive">↑ أسرع من المتوسط</p>
        </div>
      </div>
    </div>
  );
};
