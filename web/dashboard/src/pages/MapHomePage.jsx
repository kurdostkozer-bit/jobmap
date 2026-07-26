import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { OnboardingPage } from './OnboardingPage';
import MarkerManager, { 
  createJobMarkerIcon, 
  createUserMarkerIcon,
  markerEngineUtils 
} from '../services/markerEngine';
import './MapHomePage.css';

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

/**
 * Map Core Engine - P1.5 with P2-A Marker Engine
 * 
 * Architecture:
 * - MarkerEngine: Handles marker lifecycle independently
 * - MapHomePage: Orchestrates data flow
 * - Separation of concerns: Data ≠ Rendering
 */

export const MapHomePage = () => {
  // ========== CORE STATE ==========
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [userLocation, setUserLocation] = useState({ lat: 33.3136, lng: 44.3615 });
  
  // ========== MAP STATE ==========
  const [mapBounds, setMapBounds] = useState(null);
  const [previousBounds, setPreviousBounds] = useState(null);
  const [mapZoom, setMapZoom] = useState(7);
  const [mapCenter, setMapCenter] = useState([33.3136, 44.3615]);
  const [boundsDirty, setBoundsDirty] = useState(false);
  const mapRef = useRef(null);
  const debounceTimerRef = useRef(null);
  
  // ========== JOB DATA STATE ==========
  const [jobs, setJobs] = useState([]);
  const [jobsStats, setJobsStats] = useState({ total: 0, filtered: 0 });
  const [selectedJob, setSelectedJob] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // ========== SEARCH STATE ==========
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  
  // ========== CACHE ==========
  const cacheRef = useRef(new Map());
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  
  // ========== MARKER ENGINE ==========
  const markerManagerRef = useRef(null);
  const [markerStats, setMarkerStats] = useState({ total: 0, visible: 0 });
  
  // Initialize Marker Manager
  useEffect(() => {
    if (!markerManagerRef.current) {
      markerManagerRef.current = new MarkerManager();
    }
  }, []);
  
  // Check if bounds significantly changed
  const hasBoundsChanged = useCallback((newBounds, oldBounds) => {
    if (!oldBounds) return true;
    
    const threshold = 0.01;
    const { _northEast: ne, _southWest: sw } = newBounds;
    const { _northEast: oldNe, _southWest: oldSw } = oldBounds;
    
    return Math.abs(ne.lat - oldNe.lat) > threshold ||
           Math.abs(ne.lng - oldNe.lng) > threshold ||
           Math.abs(sw.lat - oldSw.lat) > threshold ||
           Math.abs(sw.lng - oldSw.lng) > threshold;
  }, []);

  // Check onboarding status
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

  // Handle map movement
  const handleMapMove = useCallback(() => {
    if (!mapRef.current) return;
    
    const bounds = mapRef.current.getBounds();
    const zoom = mapRef.current.getZoom();
    const center = mapRef.current.getCenter();
    
    setMapBounds(bounds);
    setMapZoom(zoom);
    setMapCenter([center.lat, center.lng]);
    setBoundsDirty(true);
    setError(null);
    
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
  }, []);

  // Execute search
  const handleSearchThisArea = useCallback(() => {
    if (!mapBounds) return;
    
    if (!hasBoundsChanged(mapBounds, previousBounds)) {
      console.log('Bounds unchanged, checking cache...');
      setBoundsDirty(false);
      return;
    }
    
    const { _southWest, _northEast } = mapBounds;
    const cacheKey = `${_northEast.lat.toFixed(4)}-${_southWest.lat.toFixed(4)}-${_northEast.lng.toFixed(4)}-${_southWest.lng.toFixed(4)}`;
    
    // Check cache
    const cached = cacheRef.current.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log('Using cached results');
      setJobs(cached.jobs);
      setJobsStats(cached.stats);
      setPreviousBounds(mapBounds);
      setBoundsDirty(false);
      return;
    }
    
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
      filters: {},
      limit: 100,
      offset: 0,
    };
    
    console.log('Searching bounds:', searchPayload);
    setIsLoading(true);
    setError(null);
    
    // Call real API
    fetch('/api/jobs/search/bounds', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(searchPayload),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('API Response:', data);
        
        setJobs(data.jobs || []);
        setJobsStats({
          total: data.stats?.totalFound || 0,
          filtered: data.stats?.returnedCount || 0,
        });
        setPreviousBounds(mapBounds);
        setBoundsDirty(false);
        setError(null);
        setRetryCount(0);
        
        // Cache results
        cacheRef.current.set(cacheKey, {
          jobs: data.jobs || [],
          stats: data.stats || {},
          timestamp: Date.now(),
        });
      })
      .catch(err => {
        console.error('Search error:', err);
        setError('تعذر تحميل الوظائف في هذه المنطقة');
        setRetryCount(prev => prev + 1);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [mapBounds, mapZoom, mapCenter, previousBounds, hasBoundsChanged]);

  // My Location
  const handleMyLocation = useCallback(() => {
    if (mapRef.current) {
      mapRef.current.flyTo([userLocation.lat, userLocation.lng], 12, {
        duration: 0.5,
      });
      
      setTimeout(() => {
        const bounds = mapRef.current.getBounds();
        setMapBounds(bounds);
        setMapZoom(12);
        const center = mapRef.current.getCenter();
        setMapCenter([center.lat, center.lng]);
        setBoundsDirty(true);
        
        setTimeout(() => {
          handleSearchThisArea();
        }, 100);
      }, 600);
    }
  }, [userLocation, handleSearchThisArea]);

  // Onboarding complete
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

  // Early return if onboarding
  if (showOnboarding) {
    return <OnboardingPage onComplete={handleOnboardingComplete} />;
  }

  // Calculate distance
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

  // Filter and sort jobs
  const jobsWithDistance = jobs
    .filter(job =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .map(job => ({
      ...job,
      distance: calculateDistance(userLocation.lat, userLocation.lng, job.latitude, job.longitude),
    }))
    .sort((a, b) => a.distance - b.distance);

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
          <button className="btn-my-location" onClick={handleMyLocation} disabled={isLoading}>
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

            {/* User Location */}
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

            {/* Job Markers - Rendered by MarkerEngine for scalability */}
            {jobsWithDistance.map((job) => {
              const isSelected = selectedJob?.id === job.id;
              return (
                <Marker
                  key={job.id}
                  position={[job.latitude, job.longitude]}
                  icon={createJobMarkerIcon(job.salaryMin, isSelected)}
                  eventHandlers={{
                    click: () => {
                      setSelectedJob(job);
                      markerManagerRef.current?.selectMarker(job.id, mapRef.current);
                    },
                  }}
                >
                  <Popup>
                    <div style={{ textAlign: 'center', fontSize: '12px', minWidth: '150px' }}>
                      <strong>{job.title}</strong>
                      <p style={{ margin: '4px 0', color: '#667eea', fontWeight: '600' }}>
                        {job.company}
                      </p>
                      <p style={{ margin: '4px 0', color: '#666', fontSize: '11px' }}>
                        {job.salary}
                      </p>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>

          {/* Search Button */}
          {boundsDirty && !isLoading && (
            <div className="search-button-container">
              <button
                className="btn-search-area"
                onClick={handleSearchThisArea}
              >
                🔄 ابحث في هذه المنطقة
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

          {/* Error Message */}
          {error && (
            <div className="error-message">
              <p>{error}</p>
              <button onClick={handleSearchThisArea} className="btn-retry">
                🔄 إعادة محاولة ({retryCount})
              </button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="jobs-sidebar">
          <div className="sidebar-header">
            <h3>الوظائف ({jobsWithDistance.length})</h3>
          </div>

          <div className="jobs-list">
            {isLoading && jobs.length === 0 ? (
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
                <span className="value">{selectedJob.salary}</span>
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
