import React, { useState, useEffect, useRef, useCallback } from 'react';
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

/**
 * Map Core Engine - P1
 * 
 * Architecture:
 * 1. Onboarding → Get user GPS location
 * 2. Map loads at user location
 * 3. When user pans/zooms → Track map bounds (debounce 400ms)
 * 4. Show "🔄 Search this area" button
 * 5. User clicks → Send (north, south, east, west) to backend
 * 6. Backend returns jobs in bounds
 * 7. Update markers + job list + header count
 * 8. Repeat from step 3
 * 
 * Key Principle: Map Bounds = Source of Truth
 */

// Create custom job marker icon
const createJobMarkerIcon = (salaryMin) => {
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

// Create user location marker icon
const createUserMarkerIcon = () => {
  return L.icon({
    iconUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23667eea" width="32" height="32"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="2" fill="white"/></svg>',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

export const MapHomePage = () => {
  // ========== CORE STATE ==========
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [userLocation, setUserLocation] = useState({ lat: 33.3136, lng: 44.3615 }); // Baghdad default
  
  // ========== MAP STATE ==========
  const [mapBounds, setMapBounds] = useState(null);
  const [previousBounds, setPreviousBounds] = useState(null); // Track previous bounds to avoid duplicate requests
  const [mapZoom, setMapZoom] = useState(7);
  const [mapCenter, setMapCenter] = useState([33.3136, 44.3615]);
  const [boundsDirty, setBoundsDirty] = useState(false); // User moved map
  const mapRef = useRef(null);
  const debounceTimerRef = useRef(null);
  
  // ========== JOB DATA STATE ==========
  const [jobs, setJobs] = useState([]); // Jobs from API within bounds
  const [jobsStats, setJobsStats] = useState({ total: 0, filtered: 0 }); // Stats from current bounds
  const [selectedJob, setSelectedJob] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // ========== SEARCH STATE ==========
  const [searchTerm, setSearchTerm] = useState('');
  
  // ========== HELPER: Check if bounds significantly changed ==========
  const hasBoundsChanged = useCallback((newBounds, oldBounds) => {
    if (!oldBounds) return true;
    
    const threshold = 0.01; // Roughly 1km at equator
    const { _northEast: ne, _southWest: sw } = newBounds;
    const { _northEast: oldNe, _southWest: oldSw } = oldBounds;
    
    return Math.abs(ne.lat - oldNe.lat) > threshold ||
           Math.abs(ne.lng - oldNe.lng) > threshold ||
           Math.abs(sw.lat - oldSw.lat) > threshold ||
           Math.abs(sw.lng - oldSw.lng) > threshold;
  }, []);

  // ========== LIFECYCLE ==========
  
  // Check if onboarding already completed
  useEffect(() => {
    const locationGranted = localStorage.getItem('jobmap_location_granted');
    if (locationGranted === 'true') {
      const savedLocation = localStorage.getItem('jobmap_last_location');
      if (savedLocation) {
        const loc = JSON.parse(savedLocation);
        setUserLocation(loc);
      }
      setShowOnboarding(false);
    }
  }, []);

  // Handle map movement (pan/zoom)
  const handleMapMove = useCallback(() => {
    if (!mapRef.current) return;
    
    const bounds = mapRef.current.getBounds();
    const zoom = mapRef.current.getZoom();
    const center = mapRef.current.getCenter();
    
    setMapBounds(bounds);
    setMapZoom(zoom);
    setMapCenter([center.lat, center.lng]);
    setBoundsDirty(true);
    
    // Debounce: show button only after user stops moving
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      // Debounce complete - button stays visible
    }, 400);
  }, []);

  // Execute search for current bounds
  const handleSearchThisArea = useCallback(() => {
    if (!mapBounds) return;
    
    // Check if bounds actually changed (prevent duplicate requests)
    if (!hasBoundsChanged(mapBounds, previousBounds)) {
      console.log('Bounds unchanged, skipping search');
      setBoundsDirty(false);
      return;
    }
    
    const { _southWest, _northEast } = mapBounds;
    
    // New API structure: bounds as object
    const searchPayload = {
      bounds: {
        north: _northEast.lat,
        south: _southWest.lat,
        east: _northEast.lng,
        west: _southWest.lng,
      },
      zoom: mapZoom,
      center: {
        lat: mapCenter[0],
        lng: mapCenter[1],
      },
      // Ready for future filters
      filters: {
        // employmentType: [],
        // category: [],
        // salaryMin: null,
        // salaryMax: null,
      },
    };
    
    console.log('Searching bounds:', searchPayload);
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Mock jobs with expanded data model
      const jobsInBounds = [
        {
          id: 1,
          latitude: 33.3136,
          longitude: 44.3615,
          company: 'Tech Solutions',
          title: 'Senior Developer',
          salary: '6000-8000',
          salaryMin: 6000,
          salaryMax: 8000,
          employmentType: 'full-time',
          category: 'IT',
          status: 'active',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          updatedAt: new Date(Date.now() - 3600000).toISOString(),
          description: 'نبحث عن مطور React خبير',
          skills: ['React', 'Node.js', 'TypeScript'],
          applicants: 12,
        },
        {
          id: 2,
          latitude: 33.3200,
          longitude: 44.3700,
          company: 'Design Studio',
          title: 'UI/UX Designer',
          salary: '3500-4500',
          salaryMin: 3500,
          salaryMax: 4500,
          employmentType: 'full-time',
          category: 'Design',
          status: 'active',
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          updatedAt: new Date(Date.now() - 86400000).toISOString(),
          description: 'مصمم واجهات ذو خبرة في Figma',
          skills: ['Figma', 'UI Design', 'Prototyping'],
          applicants: 8,
        },
        {
          id: 6,
          latitude: 36.1920,
          longitude: 44.0075,
          company: 'Cloud Systems',
          title: 'DevOps Engineer',
          salary: '5500-7000',
          salaryMin: 5500,
          salaryMax: 7000,
          employmentType: 'full-time',
          category: 'IT',
          status: 'active',
          createdAt: new Date(Date.now() - 259200000).toISOString(),
          updatedAt: new Date(Date.now() - 259200000).toISOString(),
          description: 'مهندس DevOps لإدارة البنية التحتية السحابية',
          skills: ['Docker', 'Kubernetes', 'AWS'],
          applicants: 7,
        },
      ];
      
      setJobs(jobsInBounds);
      setPreviousBounds(mapBounds); // Save bounds to prevent duplicate requests
      setBoundsDirty(false);
      setIsLoading(false);
      setJobsStats({
        total: jobsInBounds.length,
        filtered: jobsInBounds.length,
      });
      
      console.log('Jobs found:', jobsInBounds.length);
    }, 600);
  }, [mapBounds, mapZoom, mapCenter, previousBounds, hasBoundsChanged]);

  // Return to user location and search
  const handleMyLocation = useCallback(() => {
    if (mapRef.current) {
      mapRef.current.flyTo([userLocation.lat, userLocation.lng], 12, {
        duration: 0.5,
      });
      
      // Wait for animation to complete, then search
      setTimeout(() => {
        const bounds = mapRef.current.getBounds();
        setMapBounds(bounds);
        setMapZoom(12);
        const center = mapRef.current.getCenter();
        setMapCenter([center.lat, center.lng]);
        setBoundsDirty(true);
        
        // Execute search after animation
        setTimeout(() => {
          setBoundsDirty(false); // Will trigger handleSearchThisArea
        }, 100);
      }, 600);
    }
  }, [userLocation]);

  // Handle onboarding completion
  const handleOnboardingComplete = (location) => {
    console.log('Onboarding complete:', location);
    setUserLocation({
      lat: location.latitude,
      lng: location.longitude,
    });
    setShowOnboarding(false);
    
    localStorage.setItem('jobmap_location_granted', location.granted);
    if (location.granted) {
      localStorage.setItem('jobmap_last_location', JSON.stringify({
        lat: location.latitude,
        lng: location.longitude,
      }));
    }
  };

  // If onboarding not complete, show it (AFTER all hooks)
  if (showOnboarding) {
    return <OnboardingPage onComplete={handleOnboardingComplete} />;
  }

  // ========== HELPER FUNCTIONS ==========

  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Filter jobs by search term
  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Add distance to jobs
  const jobsWithDistance = filteredJobs.map(job => ({
    ...job,
    distance: calculateDistance(userLocation.lat, userLocation.lng, job.latitude, job.longitude),
  })).sort((a, b) => a.distance - b.distance);

  // ========== RENDER ==========

  return (
    <div className="map-home-page">
      {/* Header */}
      <header className="map-header">
        <div className="header-left">
          <h1 className="app-logo">🗺️ JobMap</h1>
        </div>

        <div className="header-center">
          <div className="job-count-badge">
            💼 {jobsStats.filtered} وظيفة
          </div>
        </div>

        <div className="header-right">
          <button className="btn-my-location" onClick={handleMyLocation}>
            📍 موقعي
          </button>
          <button className="btn-login">دخول</button>
        </div>
      </header>

      {/* Search Bar */}
      <div className="search-bar">
        <div className="search-box">
          <input
            type="text"
            placeholder="ابحث في الوظائف..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="map-container-main">
        {/* Map Section */}
        <div className="map-section">
          <MapContainer
            ref={mapRef}
            center={[userLocation.lat, userLocation.lng]}
            zoom={mapZoom}
            style={{ width: '100%', height: '100%' }}
            className="leaflet-map"
            onMoveend={handleMapMove}
            onZoomend={handleMapMove}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />

            {/* User Location Marker */}
            <Marker
              position={[userLocation.lat, userLocation.lng]}
              icon={createUserMarkerIcon()}
            >
              <Popup>
                <div style={{ textAlign: 'center', fontSize: '12px' }}>
                  <strong>📍 موقعك الحالي</strong>
                </div>
              </Popup>
            </Marker>

            {/* Job Markers */}
            {jobsWithDistance.map((job) => (
              <Marker
                key={job.id}
                position={[job.latitude, job.longitude]}
                icon={createJobMarkerIcon(job.salaryMin)}
                eventHandlers={{
                  click: () => setSelectedJob(job),
                }}
              >
                <Popup>
                  <div style={{ textAlign: 'center', fontSize: '12px' }}>
                    <strong>{job.title}</strong>
                    <p>{job.company}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Search Button (shows when user moved map) */}
          {boundsDirty && (
            <div className="search-button-container">
              <button
                className="btn-search-area"
                onClick={handleSearchThisArea}
                disabled={isLoading}
              >
                {isLoading ? '⏳ جاري البحث...' : '🔄 ابحث في هذه المنطقة'}
              </button>
            </div>
          )}

          {/* Loading Overlay */}
          {isLoading && (
            <div className="map-loading-overlay">
              <div className="spinner"></div>
              <p>جاري البحث...</p>
            </div>
          )}
        </div>

        {/* Sidebar - Jobs List */}
        <aside className="jobs-sidebar">
          <div className="sidebar-header">
            <h3>الوظائف ({jobsWithDistance.length})</h3>
          </div>

          <div className="jobs-list">
            {isLoading ? (
              <div className="loading-state">جاري التحميل...</div>
            ) : jobsWithDistance.length === 0 ? (
              <div className="empty-state">
                <p>لا توجد وظائف في هذه المنطقة</p>
                <p style={{ fontSize: '12px', opacity: 0.6 }}>حرّك الخريطة ثم ابحث</p>
              </div>
            ) : (
              jobsWithDistance.map((job) => (
                <div
                  key={job.id}
                  className={`job-card ${selectedJob?.id === job.id ? 'active' : ''}`}
                  onClick={() => setSelectedJob(job)}
                >
                  <div className="job-header">
                    <h4>{job.title}</h4>
                    <span className="job-type">
                      {job.employmentType === 'full-time' ? 'دوام كامل' : 'جزئي'}
                    </span>
                  </div>

                  <p className="job-company">{job.company}</p>
                  <p className="job-category">📂 {job.category}</p>
                  
                  <div className="job-meta">
                    <span className="salary">💰 {job.salary}</span>
                    <span className="distance">📍 {job.distance.toFixed(1)} كم</span>
                  </div>

                  <button className="btn-apply">عرض التفاصيل</button>
                </div>
              ))
            )}
          </div>
        </aside>
      </div>

      {/* Job Bubble */}
      {selectedJob && (
        <div className="job-bubble">
          <button className="bubble-close" onClick={() => setSelectedJob(null)}>✕</button>
          <div className="bubble-content">
            <div className="bubble-header">
              <h3>{selectedJob.title}</h3>
              <span className="bubble-type">
                {selectedJob.employmentType === 'full-time' ? '🏢 دوام كامل' : '⏰ جزئي'}
              </span>
            </div>
            
            <p className="bubble-company">{selectedJob.company}</p>
            <p className="bubble-category">📂 {selectedJob.category}</p>
            
            <div className="bubble-divider"></div>
            
            <div className="bubble-meta">
              <div className="meta-item">
                <span className="label">💰</span>
                <span className="value">{selectedJob.salary} USD</span>
              </div>
              <div className="meta-item">
                <span className="label">📍</span>
                <span className="value">
                  {jobsWithDistance.find(j => j.id === selectedJob.id)?.distance.toFixed(1) || '?'} كم
                </span>
              </div>
            </div>
            
            <p className="bubble-description">{selectedJob.description}</p>
            
            <div className="bubble-actions">
              <button className="btn-save-bubble">❤️ حفظ</button>
              <button className="btn-apply-bubble">تقديم الطلب</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
