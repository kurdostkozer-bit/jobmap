import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { OnboardingPage } from './OnboardingPage';
import MarkerManager, { 
  createJobMarkerIcon, 
  createUserMarkerIcon
} from '../services/markerEngine';
import { ClusteringEngine, clusteringUtils } from '../services/clusteringEngine';
import apiClient from '../core/api/apiClient';
import './MapHomePage.css';

const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

/**
 * Map Events Component - Properly handles map movement with useMap hook
 */
function MapEvents({ onMapMove, onZoom }) {
  const map = useMap();
  
  useEffect(() => {
    if (!map) return;
    
    const handleMoveEnd = () => {
      onMapMove?.();
    };
    
    const handleZoom = () => {
      onZoom?.();
    };
    
    map.on('moveend', handleMoveEnd);
    map.on('zoomend', handleZoom);
    
    return () => {
      map.off('moveend', handleMoveEnd);
      map.off('zoomend', handleZoom);
    };
  }, [map, onMapMove, onZoom]);
  
  return null;
}

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
  const requestIdRef = useRef(0);
  
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
  
  // ========== MARKER ENGINE ==========
  const markerManagerRef = useRef(null);
  
  // ========== CLUSTERING ENGINE ==========
  const clusteringEngineRef = useRef(null);
  const [clusteredResults, setClusteredResults] = useState({ clusters: [], unclustered: [], stats: {} });
  
  // Prevent duplicate auto-search in React Strict Mode or repeated initial renders
  const autoSearchTriggeredRef = useRef(false);

  // Initialize Engines
  useEffect(() => {
    if (!markerManagerRef.current) {
      markerManagerRef.current = new MarkerManager();
    }
    if (!clusteringEngineRef.current) {
      clusteringEngineRef.current = new ClusteringEngine();
    }
  }, []);
  
  // Check if bounds significantly changed
  const normalizeBounds = useCallback((bounds) => {
    if (!bounds) return null;
    const southWest = bounds.getSouthWest();
    const northEast = bounds.getNorthEast();
    return {
      south: southWest.lat,
      west: southWest.lng,
      north: northEast.lat,
      east: northEast.lng,
      bbox: `${northEast.lat.toFixed(6)}-${southWest.lat.toFixed(6)}-${northEast.lng.toFixed(6)}-${southWest.lng.toFixed(6)}`,
    };
  }, []);

  const hasBoundsChanged = useCallback((newBounds, oldBounds) => {
    if (!oldBounds) return true;
    if (!newBounds) return true;

    const threshold = 0.0005;
    return (
      Math.abs(newBounds.north - oldBounds.north) > threshold ||
      Math.abs(newBounds.south - oldBounds.south) > threshold ||
      Math.abs(newBounds.east - oldBounds.east) > threshold ||
      Math.abs(newBounds.west - oldBounds.west) > threshold
    );
  }, []);

  // Execute search
  const handleSearchThisArea = useCallback(async () => {
    if (!mapBounds) return;
    if (isLoading) return;

    if (!hasBoundsChanged(mapBounds, previousBounds)) {
      console.log('Bounds unchanged, checking cache...');
      setBoundsDirty(false);
      return;
    }

    const cacheKey = `${mapBounds.bbox}-${mapZoom}`;
    
    // Check cache
    const cached = cacheRef.current.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION_MS) {
      console.log('Using cached results');
      setJobs(cached.jobs);
      setJobsStats(cached.stats);
      setPreviousBounds(mapBounds);
      setBoundsDirty(false);
      return;
    }
    
    const searchPayload = {
      bounds: {
        north: mapBounds.north,
        south: mapBounds.south,
        east: mapBounds.east,
        west: mapBounds.west,
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

    const requestId = ++requestIdRef.current;
    try {
      const data = await apiClient.post('/jobs/search/bounds', searchPayload);
      if (requestId !== requestIdRef.current) {
        console.warn('Stale search response ignored', requestId);
        return;
      }

      console.log('API Response:', data);

      const returnedJobs = data.jobs || [];
      setJobs(returnedJobs);
      setJobsStats({
        total: data.stats?.totalFound || 0,
        filtered: data.stats?.returnedCount || returnedJobs.length,
      });
      setPreviousBounds(mapBounds);
      setBoundsDirty(false);
      setError(null);
      setRetryCount(0);

      // ========== CLUSTERING ENGINE - P2-B ==========
      // Run clustering on fetched jobs
      const clustering = clusteringEngineRef.current.cluster(returnedJobs, mapZoom);
      setClusteredResults(clustering);
      console.log('Clustering results:', clustering);

      // Cache results
      cacheRef.current.set(cacheKey, {
        jobs: returnedJobs,
        stats: data.stats || {},
        timestamp: Date.now(),
      });
    } catch (err) {
      console.error('Search error:', err);
      setError('تعذر تحميل الوظائف في هذه المنطقة');
      setRetryCount(prev => prev + 1);
    } finally {
      setIsLoading(false);
    }
  }, [mapBounds, mapZoom, mapCenter, previousBounds, hasBoundsChanged, isLoading]);

  // Auto-search on first load when bounds become available
  useEffect(() => {
    if (mapRef.current && mapBounds && !jobs.length && !isLoading && !autoSearchTriggeredRef.current) {
      console.log('✅ Auto-search conditions met:', {
        hasMapRef: !!mapRef.current,
        hasBounds: !!mapBounds,
        jobsEmpty: !jobs.length,
        notLoading: !isLoading,
      });

      autoSearchTriggeredRef.current = true;
      const timer = setTimeout(() => {
        console.log('🔍 Starting first load auto-search...');
        handleSearchThisArea();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [mapBounds, jobs.length, isLoading, handleSearchThisArea]);

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

    setMapBounds(normalizeBounds(bounds));
    setMapZoom(zoom);
    setMapCenter([center.lat, center.lng]);
    setBoundsDirty(true);
    setError(null);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
  }, [normalizeBounds]);

  const handleMapReady = useCallback((mapInstance) => {
    if (!mapInstance) return;

    mapRef.current = mapInstance;
    const bounds = mapInstance.getBounds();
    const zoom = mapInstance.getZoom();
    const center = bounds.getCenter();

    setMapBounds(normalizeBounds(bounds));
    setMapZoom(zoom);
    setMapCenter([center.lat, center.lng]);
  }, [normalizeBounds]);

  const handleMyLocation = useCallback(() => {
    if (!mapRef.current) return;

    mapRef.current.flyTo([userLocation.lat, userLocation.lng], 12, {
      duration: 0.5,
    });

    setTimeout(() => {
      if (!mapRef.current) return;
      const bounds = mapRef.current.getBounds();
      const center = mapRef.current.getCenter();

      setMapBounds(normalizeBounds(bounds));
      setMapZoom(12);
      setMapCenter([center.lat, center.lng]);
      setBoundsDirty(true);

      setTimeout(() => {
        handleSearchThisArea();
      }, 100);
    }, 600);
  }, [userLocation, handleSearchThisArea, normalizeBounds]);

  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const jobsWithDistance = jobs
    .filter((job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .map((job) => ({
      ...job,
      distance: calculateDistance(userLocation.lat, userLocation.lng, job.latitude, job.longitude),
    }))
    .sort((a, b) => a.distance - b.distance);

  return (
    <div className="map-home-page">
      <header className="map-header">
        <div className="header-left">
          <h1 className="app-logo">🗺️ JobMap</h1>
        </div>

        <div className="header-right">
          <button className="btn-my-location" onClick={handleMyLocation} disabled={isLoading}>
            📍 موقعي
          </button>
          <button className="btn-login" onClick={() => navigate('/login')}>
            دخول
          </button>
          <button className="btn-register" onClick={() => navigate('/register')}>
            تسجيل
          </button>
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
            whenCreated={handleMapReady}
            center={[userLocation.lat, userLocation.lng]}
            zoom={mapZoom}
            style={{ width: '100%', height: '100%' }}
            className="leaflet-map"
          >
            <MapEvents onMapMove={handleMapMove} onZoom={handleMapMove} />
            
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

            {/* Job Markers & Clusters - P2-A + P2-B */}
            
            {/* Render Clusters */}
            {clusteredResults.clusters && clusteredResults.clusters.map((cluster) => {
              const isSelected = selectedJob?.id === cluster.id;
              return (
                <Marker
                  key={`cluster-${cluster.id}`}
                  position={[cluster.latitude, cluster.longitude]}
                  icon={L.divIcon(clusteringUtils.createClusterIcon(cluster, isSelected))}
                  eventHandlers={{
                    click: () => {
                      // Zoom to cluster
                      clusteringUtils.zoomToCluster(mapRef.current, cluster);
                      setSelectedJob(null);
                    },
                  }}
                >
                  <Popup>
                    <div dangerouslySetInnerHTML={{ 
                      __html: clusteringUtils.createClusterPopupContent(cluster) 
                    }} />
                  </Popup>
                </Marker>
              );
            })}
            
            {/* Render Unclustered Jobs */}
            {clusteredResults.unclustered && clusteredResults.unclustered.map((job) => {
              const isSelected = selectedJob?.id === job.id;
              return (
                <Marker
                  key={`job-${job.id}`}
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
            
            {/* Fallback: Render all jobs if no clustering */}
            {(!clusteredResults.clusters || clusteredResults.clusters.length === 0) && 
             (!clusteredResults.unclustered || clusteredResults.unclustered.length === 0) &&
             jobsWithDistance.map((job) => {
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
