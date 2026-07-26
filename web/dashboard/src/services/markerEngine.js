/**
 * Marker Engine - Scalable marker rendering for Map Core
 * 
 * Responsibilities:
 * - Create marker objects from job data
 * - Manage marker visibility (virtualization)
 * - Handle marker clustering logic (P2-B)
 * - Optimize rendering for 1000+ markers
 * 
 * Separated from UI layer for testing & reusability
 */

import L from 'leaflet';

/**
 * Creates a Leaflet DivIcon for a job marker with green checkmark pin
 * @param {number} salaryMin - Minimum salary for color coding
 * @param {boolean} isSelected - Whether this marker is currently selected
 * @returns {L.Icon} Leaflet icon
 */
export const createJobMarkerIcon = (salaryMin, isSelected = false) => {
  // Green checkmark pin icon (SVG)
  const checkmarkPinSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 80" width="40" height="50">
      <!-- Pin body -->
      <path d="M32 2 C18 2, 8 12, 8 26 C8 42, 32 78, 32 78 C32 78, 56 42, 56 26 C56 12, 46 2, 32 2" 
            fill="#22c55e" stroke="white" stroke-width="2"/>
      <!-- Checkmark -->
      <g transform="translate(32, 24)">
        <polyline points="-8,-2 -2,4 8,-8" 
                  stroke="white" stroke-width="3" fill="none" 
                  stroke-linecap="round" stroke-linejoin="round"/>
      </g>
    </svg>
  `;

  // Highlight if selected
  const boxShadow = isSelected
    ? '0 4px 12px rgba(34, 197, 94, 0.6)'
    : '0 2px 8px rgba(0, 0, 0, 0.3)';

  return L.divIcon({
    html: `
      <div style="
        filter: drop-shadow(${isSelected ? '0 4px 12px rgba(34, 197, 94, 0.6)' : '0 2px 8px rgba(0, 0, 0, 0.3)'});
        transform: ${isSelected ? 'scale(1.2)' : 'scale(1)'};
        transition: transform 0.2s ease;
      ">
        ${checkmarkPinSvg}
      </div>
    `,
    iconSize: [40, 50],
    iconAnchor: [20, 50],
    popupAnchor: [0, -50],
    className: 'custom-job-marker-checkmark',
  });
};

/**
 * Creates a Leaflet icon for user location
 * @returns {L.Icon} Leaflet icon
 */
export const createUserMarkerIcon = () => {
  return L.icon({
    iconUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23667eea" width="32" height="32"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="2" fill="white"/></svg>',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

/**
 * Marker Manager - Handles marker lifecycle
 * 
 * Features:
 * - Create markers from jobs
 * - Track marker instances
 * - Update selection state
 * - Support future clustering
 */
export class MarkerManager {
  constructor() {
    this.markers = new Map(); // jobId → marker instance
    this.visibleMarkers = new Set(); // Currently rendered marker IDs
    this.selectedMarkerId = null;
  }

  /**
   * Create or update markers from jobs array
   * @param {Array} jobs - Job data with id, latitude, longitude, salaryMin
   * @param {Object} map - Leaflet map instance
   * @param {Function} onMarkerClick - Callback for marker click
   * @returns {Array} Array of marker instances
   */
  createMarkers(jobs, map, onMarkerClick) {
    const newMarkers = [];

    for (const job of jobs) {
      // Skip if already created and not updated
      if (this.markers.has(job.id)) {
        newMarkers.push(this.markers.get(job.id));
        continue;
      }

      // Create new marker
      const marker = L.marker([job.latitude, job.longitude], {
        icon: createJobMarkerIcon(job.salaryMin),
      });

      // Attach job data
      marker.jobData = job;

      // Add click handler
      marker.on('click', () => {
        this.selectMarker(job.id, map);
        onMarkerClick(job);
      });

      // Add popup
      const popupContent = `
        <div style="text-align: center; font-size: 12px; min-width: 150px;">
          <strong>${job.title}</strong>
          <p style="margin: 4px 0; color: #667eea; font-weight: 600;">${job.company}</p>
          <p style="margin: 4px 0; color: #666; font-size: 11px;">${job.salary}</p>
        </div>
      `;
      marker.bindPopup(popupContent);

      // Store marker
      this.markers.set(job.id, marker);
      newMarkers.push(marker);
    }

    return newMarkers;
  }

  /**
   * Add markers to map (virtualization: only visible ones)
   * @param {Array} markers - Marker instances
   * @param {Object} map - Leaflet map instance
   * @param {Object} bounds - Current map bounds (optional)
   */
  renderMarkers(markers, map, bounds = null) {
    // If bounds provided, only render markers within bounds
    for (const marker of markers) {
      // Check if marker should be visible
      const shouldShow = !bounds || this.isMarkerInBounds(marker, bounds);

      if (shouldShow) {
        marker.addTo(map);
        this.visibleMarkers.add(marker.jobData.id);
      } else {
        // Remove from map if out of bounds
        map.removeLayer(marker);
        this.visibleMarkers.delete(marker.jobData.id);
      }
    }
  }

  /**
   * Clear all markers from map
   * @param {Object} map - Leaflet map instance
   */
  clearMarkers(map) {
    for (const marker of this.markers.values()) {
      if (map.hasLayer(marker)) {
        map.removeLayer(marker);
      }
    }
    this.visibleMarkers.clear();
  }

  /**
   * Select a marker and update its visual state
   * @param {string} jobId - Job ID to select
   * @param {Object} map - Leaflet map instance
   */
  selectMarker(jobId, map) {
    // Deselect previous
    if (this.selectedMarkerId && this.markers.has(this.selectedMarkerId)) {
      const prevMarker = this.markers.get(this.selectedMarkerId);
      const prevJob = prevMarker.jobData;
      prevMarker.setIcon(createJobMarkerIcon(prevJob.salaryMin, false));
    }

    // Select new
    if (this.markers.has(jobId)) {
      const marker = this.markers.get(jobId);
      const job = marker.jobData;
      marker.setIcon(createJobMarkerIcon(job.salaryMin, true));
      this.selectedMarkerId = jobId;

      // Open popup
      marker.openPopup();
    }
  }

  /**
   * Deselect current marker
   */
  deselectMarker(map) {
    if (this.selectedMarkerId && this.markers.has(this.selectedMarkerId)) {
      const marker = this.markers.get(this.selectedMarkerId);
      const job = marker.jobData;
      marker.setIcon(createJobMarkerIcon(job.salaryMin, false));
      marker.closePopup();
      this.selectedMarkerId = null;
    }
  }

  /**
   * Check if marker is within bounds (for virtualization)
   * @private
   */
  isMarkerInBounds(marker, bounds) {
    if (!bounds) return true;

    const { _northEast, _southWest } = bounds;
    const { lat, lng } = marker.getLatLng();

    return lat >= _southWest.lat &&
           lat <= _northEast.lat &&
           lng >= _southWest.lng &&
           lng <= _northEast.lng;
  }

  /**
   * Get total marker count
   */
  getTotalCount() {
    return this.markers.size;
  }

  /**
   * Get visible marker count
   */
  getVisibleCount() {
    return this.visibleMarkers.size;
  }

  /**
   * Get marker by job ID
   */
  getMarker(jobId) {
    return this.markers.get(jobId);
  }

  /**
   * Check if marker is visible
   */
  isMarkerVisible(jobId) {
    return this.visibleMarkers.has(jobId);
  }

  /**
   * Future: prepare for clustering (P2-B)
   * Group markers by proximity
   */
  getMarkerClusters(clusterRadius = 80) {
    // TODO: Implement clustering algorithm
    // This is a placeholder for P2-B
    return {
      clusters: [],
      unclustered: Array.from(this.markers.values()),
    };
  }
}

/**
 * Marker Renderer Hook-like utilities
 * For React integration without being tied to React
 */

export const markerEngineUtils = {
  /**
   * Calculate visible markers based on bounds
   */
  getVisibleMarkers(jobs, bounds) {
    if (!bounds) return jobs;

    const { _northEast, _southWest } = bounds;
    return jobs.filter(job =>
      job.latitude >= _southWest.lat &&
      job.latitude <= _northEast.lat &&
      job.longitude >= _southWest.lng &&
      job.longitude <= _northEast.lng
    );
  },

  /**
   * Batch update markers (useful for large datasets)
   */
  batchUpdateMarkers(markerManager, jobs, map, onMarkerClick) {
    // Create all markers
    const markers = markerManager.createMarkers(jobs, map, onMarkerClick);

    // Render in batches to avoid UI freezing
    const batchSize = 100;
    for (let i = 0; i < markers.length; i += batchSize) {
      const batch = markers.slice(i, i + batchSize);
      requestAnimationFrame(() => {
        markerManager.renderMarkers(batch, map);
      });
    }
  },

  /**
   * Get marker statistics
   */
  getMarkerStats(markerManager) {
    return {
      total: markerManager.getTotalCount(),
      visible: markerManager.getVisibleCount(),
      visibilityRatio: markerManager.getVisibleCount() / markerManager.getTotalCount(),
    };
  },
};

export default MarkerManager;
