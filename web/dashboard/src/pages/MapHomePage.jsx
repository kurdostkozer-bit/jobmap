import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { OnboardingPage } from './OnboardingPage';
import './MapHomePage.css';

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Custom job marker icon factory
const createJobIcon = (salaryMin) => {
  const color = salaryMin > 5000 ? '#667eea' : salaryMin > 3000 ? '#48bb78' : '#ed8936';
  const bgColor = salaryMin > 5000 ? '#e0e7ff' : salaryMin > 3000 ? '#f0fdf4' : '#fffbeb';
  
  return L.divIcon({
    html: `
      <div style="
        background: ${bgColor};
        border: 3px solid ${color};
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 18px;
        cursor: pointer;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      ">
        💼
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
    className: 'custom-job-marker',
  });
};

export const MapHomePage = () => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(true);

  // Mock jobs data with Iraq coordinates
  const allJobs = useMemo(() => [
    {
      id: 1,
      title: 'Senior Developer',
      company: 'Tech Solutions',
      location: 'بغداد',
      lat: 33.3136,
      lng: 44.3615,
      salary: '6000-8000',
      salaryMin: 6000,
      type: 'full-time',
      description: 'نبحث عن مطور ويب خبير',
      skills: ['React', 'Node.js', 'TypeScript'],
      applicants: 12,
    },
    {
      id: 2,
      title: 'UI/UX Designer',
      company: 'Design Studio',
      location: 'بغداد',
      lat: 33.3200,
      lng: 44.3700,
      salary: '3500-4500',
      salaryMin: 3500,
      type: 'full-time',
      description: 'مصمم واجهات ذو خبرة',
      skills: ['Figma', 'UI Design', 'Prototyping'],
      applicants: 8,
    },
    {
      id: 3,
      title: 'Project Manager',
      company: 'Project Pro',
      location: 'الموصل',
      lat: 36.3212,
      lng: 43.1581,
      salary: '4000-5500',
      salaryMin: 4000,
      type: 'full-time',
      description: 'مدير مشاريع قيادي',
      skills: ['Leadership', 'Agile', 'Planning'],
      applicants: 15,
    },
    {
      id: 4,
      title: 'Data Analyst',
      company: 'Data Hub',
      location: 'كربلاء',
      lat: 32.5086,
      lng: 44.0055,
      salary: '3000-4000',
      salaryMin: 3000,
      type: 'full-time',
      description: 'محلل بيانات',
      skills: ['Python', 'SQL', 'Tableau'],
      applicants: 10,
    },
    {
      id: 5,
      title: 'Sales Manager',
      company: 'Sales Pro',
      location: 'البصرة',
      lat: 30.4944,
      lng: 47.8077,
      salary: '2500-3500',
      salaryMin: 2500,
      type: 'full-time',
      description: 'مدير مبيعات',
      skills: ['Sales', 'Leadership', 'CRM'],
      applicants: 5,
    },
    {
      id: 6,
      title: 'DevOps Engineer',
      company: 'Cloud Systems',
      location: 'أربيل',
      lat: 36.1920,
      lng: 44.0075,
      salary: '5500-7000',
      salaryMin: 5500,
      type: 'full-time',
      description: 'مهندس DevOps',
      skills: ['Docker', 'Kubernetes', 'AWS'],
      applicants: 7,
    },
  ], []);

  // Check if user already completed onboarding
  useEffect(() => {
    const locationGranted = localStorage.getItem('jobmap_location_granted');
    if (locationGranted === 'true') {
      setShowOnboarding(false);
    }
  }, []);

  // Initialize map
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setFilteredJobs(allJobs);
      setIsLoading(false);
    }, 300);
  }, [allJobs]);

  // Filter jobs based on search and location
  useEffect(() => {
    let result = allJobs;

    if (searchTerm) {
      result = result.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedLocation) {
      result = result.filter(job => job.location === selectedLocation);
    }

    setFilteredJobs(result);
  }, [searchTerm, selectedLocation, allJobs]);

  // Handle onboarding completion
  const handleOnboardingComplete = (location) => {
    console.log('Onboarding complete:', location);
    setShowOnboarding(false);
    
    // Save to localStorage for future visits
    localStorage.setItem('jobmap_location_granted', location.granted);
    if (location.granted) {
      localStorage.setItem('jobmap_last_location', JSON.stringify(location));
    }
  };

  // If onboarding is not complete, show it (AFTER all hooks)
  if (showOnboarding) {
    return <OnboardingPage onComplete={handleOnboardingComplete} />;
  }

  const locations = [...new Set(allJobs.map(job => job.location))];

  return (
    <div className="map-home-page">
      {/* Header */}
      <header className="map-header">
        <div className="header-left">
          <h1 className="app-logo">🗺️ JobMap</h1>
          <p className="app-tagline">اكتشف فرص العمل حسب موقعك</p>
        </div>

        <div className="header-right">
          <button className="btn-login">تسجيل دخول</button>
          <button className="btn-employer">منطقة صاحب العمل</button>
        </div>
      </header>

      {/* Search & Filter Bar */}
      <div className="search-filter-bar">
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
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          className="location-select"
        >
          <option value="">جميع المحافظات</option>
          {locations.map(location => (
            <option key={location} value={location}>{location}</option>
          ))}
        </select>

        <div className="filter-info">
          📍 {filteredJobs.length} وظيفة
        </div>
      </div>

      {/* Main Container */}
      <div className="map-container-main">
        {/* Map Section */}
        <div className="map-section">
          {isLoading ? (
            <div className="map-loading">جاري تحميل الخريطة...</div>
          ) : (
            <MapContainer 
              center={[33.1, 44.0]} 
              zoom={7} 
              style={{ width: '100%', height: '100%' }}
              className="leaflet-map"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {filteredJobs.map((job) => (
                <Marker 
                  key={job.id} 
                  position={[job.lat, job.lng]}
                  icon={createJobIcon(job.salaryMin)}
                  eventHandlers={{
                    click: () => setSelectedJob(job),
                  }}
                >
                  <Popup>
                    <div style={{ textAlign: 'center' }}>
                      <strong>{job.title}</strong>
                      <p>{job.company}</p>
                      <p>💰 {job.salary}</p>
                      <button 
                        onClick={() => setSelectedJob(job)}
                        style={{
                          padding: '8px 12px',
                          background: '#667eea',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                        }}
                      >
                        عرض التفاصيل
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          )}
        </div>

        {/* Sidebar - Jobs List */}
        <aside className="jobs-sidebar">
          <div className="sidebar-header">
            <h3>الوظائف القريبة</h3>
            <span className="jobs-count">{filteredJobs.length}</span>
          </div>

          <div className="jobs-list">
            {isLoading ? (
              <div className="loading-state">جاري التحميل...</div>
            ) : filteredJobs.length === 0 ? (
              <div className="empty-state">
                <p>لا توجد وظائف متطابقة</p>
              </div>
            ) : (
              filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className={`job-card ${selectedJob?.id === job.id ? 'active' : ''}`}
                  onClick={() => setSelectedJob(job)}
                >
                  <div className="job-header">
                    <h4>{job.title}</h4>
                    <span className="job-type">{job.type === 'full-time' ? 'دوام كامل' : 'جزئي'}</span>
                  </div>

                  <p className="job-company">{job.company}</p>
                  <p className="job-location">📍 {job.location}</p>

                  <div className="job-salary">
                    <span className="label">الراتب:</span>
                    <span className="amount">{job.salary}</span>
                  </div>

                  <div className="job-meta">
                    <span className="applicants">👥 {job.applicants}</span>
                  </div>

                  <button className="btn-apply">عرض التفاصيل</button>
                </div>
              ))
            )}
          </div>
        </aside>
      </div>

      {/* Job Details Sheet */}
      {selectedJob && (
        <div className="job-details-sheet">
          <div className="sheet-header">
            <div className="sheet-title">
              <h2>{selectedJob.title}</h2>
              <button 
                className="sheet-close"
                onClick={() => setSelectedJob(null)}
              >
                ✕
              </button>
            </div>
          </div>

          <div className="sheet-content">
            <div className="detail-row">
              <span className="label">الشركة:</span>
              <span className="value">{selectedJob.company}</span>
            </div>

            <div className="detail-row">
              <span className="label">الموقع:</span>
              <span className="value">{selectedJob.location}</span>
            </div>

            <div className="detail-row">
              <span className="label">الراتب:</span>
              <span className="value salary">{selectedJob.salary} USD</span>
            </div>

            <div className="detail-row">
              <span className="label">نوع الوظيفة:</span>
              <span className="value">{selectedJob.type === 'full-time' ? 'دوام كامل' : 'جزئي'}</span>
            </div>

            <div className="detail-section">
              <h4>الوصف</h4>
              <p>{selectedJob.description}</p>
            </div>

            <div className="detail-section">
              <h4>المهارات المطلوبة</h4>
              <div className="skills-list">
                {selectedJob.skills.map((skill, idx) => (
                  <span key={idx} className="skill-tag">{skill}</span>
                ))}
              </div>
            </div>

            <div className="sheet-actions">
              <button className="btn-save">❤️ حفظ</button>
              <button className="btn-apply-now">تقديم الطلب</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
