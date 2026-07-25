import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import './JobsMap.css';

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Custom marker icon
const createCustomIcon = (status) => {
  const colorMap = {
    active: '#48bb78',
    closed: '#f56565',
  };
  
  return L.divIcon({
    html: `
      <div style="
        background: ${colorMap[status] || '#667eea'};
        color: white;
        border: 3px solid white;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 18px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        cursor: pointer;
      ">
        💼
      </div>
    `,
    iconSize: [40, 40],
    className: 'custom-marker',
  });
};

// Map Center Component
const MapCenter = ({ coords }) => {
  const map = useMap();
  
  useEffect(() => {
    if (coords) {
      map.setView(coords, map.getZoom());
    }
  }, [coords, map]);
  
  return null;
};

export const JobsMap = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock jobs with coordinates (Iraq locations)
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      const mockJobs = [
        {
          id: 1,
          title: 'Senior Developer',
          location: 'بغداد',
          coords: [33.3136, 44.3615],
          salary: '5000-7000',
          applicants: 12,
          status: 'active',
          company: 'Tech Solutions',
        },
        {
          id: 2,
          title: 'UI/UX Designer',
          location: 'بغداد',
          coords: [33.3200, 44.3700],
          salary: '3500-4500',
          applicants: 8,
          status: 'active',
          company: 'Design Studio',
        },
        {
          id: 3,
          title: 'Project Manager',
          location: 'الموصل',
          coords: [36.3212, 43.1581],
          salary: '4000-5500',
          applicants: 15,
          status: 'active',
          company: 'Project Pro',
        },
        {
          id: 4,
          title: 'Data Analyst',
          location: 'كربلاء',
          coords: [32.5086, 44.0055],
          salary: '3000-4000',
          applicants: 10,
          status: 'active',
          company: 'Data Hub',
        },
        {
          id: 5,
          title: 'Marketing Specialist',
          location: 'البصرة',
          coords: [30.4944, 47.8077],
          salary: '2500-3500',
          applicants: 5,
          status: 'closed',
          company: 'Marketing Pro',
        },
      ];
      setJobs(mockJobs);
      setIsLoading(false);
    }, 500);
  }, []);

  // Calculate center point (Iraq center)
  const center = [33.1, 44.0];

  return (
    <div className="jobs-map-container">
      {/* Map */}
      <div className="map-wrapper">
        {isLoading ? (
          <div className="map-loading">جاري تحميل الخريطة...</div>
        ) : (
          <MapContainer center={center} zoom={7} className="map-container">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />
            {jobs.map((job) => (
              <Marker
                key={job.id}
                position={job.coords}
                icon={createCustomIcon(job.status)}
                eventHandlers={{
                  click: () => setSelectedJob(job),
                }}
              >
                <Popup>
                  <div className="popup-content">
                    <h4>{job.title}</h4>
                    <p className="company">{job.company}</p>
                    <p className="location">{job.location}</p>
                    <p className="salary">💰 {job.salary} USD</p>
                    <p className="applicants">👥 {job.applicants} متقدم</p>
                    <p className={`status ${job.status}`}>
                      {job.status === 'active' ? '✅ نشط' : '❌ مغلق'}
                    </p>
                  </div>
                </Popup>
              </Marker>
            ))}
            <MapCenter coords={selectedJob?.coords} />
          </MapContainer>
        )}
      </div>

      {/* Sidebar - Selected Job Details */}
      <div className="map-sidebar">
        <div className="sidebar-header">
          <h3>تفاصيل الوظيفة</h3>
          {selectedJob && (
            <button
              className="close-btn"
              onClick={() => setSelectedJob(null)}
            >
              ✕
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="sidebar-loading">جاري التحميل...</div>
        ) : selectedJob ? (
          <div className="job-details">
            <div className="detail-header">
              <div className="detail-icon">💼</div>
              <div>
                <h4>{selectedJob.title}</h4>
                <p className="company">{selectedJob.company}</p>
              </div>
            </div>

            <div className="detail-section">
              <h5>📍 الموقع</h5>
              <p>{selectedJob.location}</p>
            </div>

            <div className="detail-section">
              <h5>💰 الراتب</h5>
              <p className="salary-highlight">{selectedJob.salary} USD</p>
            </div>

            <div className="detail-section">
              <h5>👥 المتقدمون</h5>
              <p>{selectedJob.applicants} متقدم</p>
            </div>

            <div className="detail-section">
              <h5>📊 الحالة</h5>
              <span className={`status-badge ${selectedJob.status}`}>
                {selectedJob.status === 'active' ? '✅ نشط' : '❌ مغلق'}
              </span>
            </div>

            <div className="detail-actions">
              <button className="btn-primary">👁️ عرض الوظيفة</button>
              <button className="btn-secondary">✏️ تعديل</button>
              <button className="btn-secondary">📍 عرض على الخريطة</button>
            </div>
          </div>
        ) : (
          <div className="sidebar-empty">
            <p>اختر وظيفة على الخريطة لعرض تفاصيلها</p>
          </div>
        )}

        {/* Jobs List */}
        <div className="jobs-list-sidebar">
          <h5>قائمة الوظائف</h5>
          <div className="jobs-list">
            {jobs.map((job) => (
              <div
                key={job.id}
                className={`job-list-item ${selectedJob?.id === job.id ? 'active' : ''}`}
                onClick={() => setSelectedJob(job)}
              >
                <div className="item-icon">💼</div>
                <div className="item-info">
                  <p className="item-title">{job.title}</p>
                  <p className="item-location">{job.location}</p>
                </div>
                <span className={`item-status ${job.status}`}>
                  {job.status === 'active' ? '🟢' : '🔴'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
