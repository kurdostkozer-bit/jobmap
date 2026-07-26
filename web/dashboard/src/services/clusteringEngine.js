/**
 * Spatial Clustering Engine - P2-B
 * 
 * Responsibility:
 * - Group jobs by proximity based on zoom level
 * - Generate cluster statistics
 * - Provide stable cluster IDs
 * - Support smart zoom behavior
 * 
 * Independent from MarkerManager - can be swapped without affecting marker logic
 */

/**
 * Cluster object structure
 * 
 * @typedef {Object} Cluster
 * @property {string} id - Stable cluster identifier (based on grid)
 * @property {number} latitude - Center of cluster
 * @property {number} longitude - Center of cluster
 * @property {number} count - Number of jobs in cluster
 * @property {number} averageSalaryMin - Average minimum salary
 * @property {number} averageSalaryMax - Average maximum salary
 * @property {string[]} categories - Unique job categories
 * @property {number[]} latitudes - All job latitudes
 * @property {number[]} longitudes - All job longitudes
 * @property {Object} bounds - Cluster geographic bounds
 * @property {string[]} jobIds - All job IDs in cluster
 * @property {boolean} isCluster - Always true for clusters
 */

/**
 * Clustering Engine - Groups nearby jobs
 * 
 * Algorithm:
 * 1. Convert map to grid cells based on zoom + pixel radius
 * 2. Hash each job to a cell
 * 3. Group jobs by cell
 * 4. Calculate statistics per cell
 * 5. Return clusters + unclustered singles
 */
export class ClusteringEngine {
  constructor() {
    this.pixelRadiusMap = {
      // zoom level -> pixel radius for clustering
      7: 120,    // Far out: large clusters
      8: 110,
      9: 100,
      10: 90,
      11: 80,    // Medium: balanced
      12: 70,
      13: 60,
      14: 40,    // Zoomed in: small clusters
      15: 30,
      16: 20,
      17: 10,
      18: 5,     // Fully zoomed: no clustering
    };
  }

  /**
   * Get pixel radius for zoom level
   * Linear interpolation for missing levels
   */
  getPixelRadius(zoomLevel) {
    const zoom = Math.round(zoomLevel);
    if (this.pixelRadiusMap[zoom]) {
      return this.pixelRadiusMap[zoom];
    }

    // Interpolate between known values
    const lower = Math.floor(zoom);
    const upper = Math.ceil(zoom);
    if (this.pixelRadiusMap[lower] && this.pixelRadiusMap[upper]) {
      const fraction = zoom - lower;
      return (
        this.pixelRadiusMap[lower] * (1 - fraction) +
        this.pixelRadiusMap[upper] * fraction
      );
    }

    return 80; // Default
  }

  /**
   * Convert geographic coordinates to pixel coordinates
   * (For clustering algorithm, not for display)
   * 
   * Uses Web Mercator projection approximation
   */
  latLngToPixels(lat, lng, zoomLevel) {
    const zoom = Math.pow(2, zoomLevel);
    const x = ((lng + 180) / 360) * zoom * 256;
    const y =
      ((1 -
        Math.log(Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)) /
          Math.PI) /
        2) *
      zoom *
      256;
    return { x, y };
  }

  /**
   * Create stable grid cell ID from coordinates
   * Ensures same location always hashes to same cell
   */
  getGridCellId(lat, lng, zoomLevel, pixelRadius) {
    const pixels = this.latLngToPixels(lat, lng, zoomLevel);
    const cellX = Math.floor(pixels.x / pixelRadius);
    const cellY = Math.floor(pixels.y / pixelRadius);
    return `${zoomLevel}-${cellX}-${cellY}`;
  }

  /**
   * Cluster jobs based on zoom level
   * 
   * @param {Array} jobs - Job objects with latitude, longitude, category, salaryMin, salaryMax
   * @param {number} zoomLevel - Current map zoom
   * @returns {Object} { clusters, unclustered, stats }
   */
  cluster(jobs, zoomLevel) {
    if (!jobs || jobs.length === 0) {
      return { clusters: [], unclustered: [], stats: { total: 0 } };
    }

    // Don't cluster if zoomed in far enough
    if (zoomLevel >= 16) {
      return {
        clusters: [],
        unclustered: jobs.map(job => ({
          ...job,
          isCluster: false,
        })),
        stats: {
          total: jobs.length,
          clustered: 0,
          unclustered: jobs.length,
        },
      };
    }

    const pixelRadius = this.getPixelRadius(zoomLevel);
    const grid = new Map(); // cellId -> jobs

    // Hash jobs to grid cells
    for (const job of jobs) {
      const cellId = this.getGridCellId(
        job.latitude,
        job.longitude,
        zoomLevel,
        pixelRadius
      );

      if (!grid.has(cellId)) {
        grid.set(cellId, []);
      }
      grid.get(cellId).push(job);
    }

    // Convert cells to clusters or unclustered
    const clusters = [];
    const unclustered = [];

    for (const [cellId, cellJobs] of grid.entries()) {
      if (cellJobs.length === 1) {
        // Single job, don't cluster
        unclustered.push({
          ...cellJobs[0],
          isCluster: false,
        });
      } else {
        // Multiple jobs, create cluster
        clusters.push(this.createCluster(cellId, cellJobs));
      }
    }

    return {
      clusters,
      unclustered,
      stats: {
        total: jobs.length,
        clustered: clusters.reduce((sum, c) => sum + c.count, 0),
        unclustered: unclustered.length,
        clusterCount: clusters.length,
      },
    };
  }

  /**
   * Create cluster object from grouped jobs
   * @private
   */
  createCluster(cellId, jobs) {
    // Calculate center (centroid)
    const centerLat = jobs.reduce((sum, j) => sum + j.latitude, 0) / jobs.length;
    const centerLng = jobs.reduce((sum, j) => sum + j.longitude, 0) / jobs.length;

    // Calculate salary statistics
    const salaryMins = jobs.map(j => j.salaryMin || 0).filter(s => s > 0);
    const salaryMaxs = jobs.map(j => j.salaryMax || 0).filter(s => s > 0);

    const avgSalaryMin = salaryMins.length > 0
      ? Math.round(salaryMins.reduce((a, b) => a + b, 0) / salaryMins.length)
      : null;

    const avgSalaryMax = salaryMaxs.length > 0
      ? Math.round(salaryMaxs.reduce((a, b) => a + b, 0) / salaryMaxs.length)
      : null;

    // Extract unique categories
    const categories = [...new Set(jobs.map(j => j.category).filter(Boolean))];

    // Calculate bounds
    const lats = jobs.map(j => j.latitude);
    const lngs = jobs.map(j => j.longitude);
    const bounds = {
      north: Math.max(...lats),
      south: Math.min(...lats),
      east: Math.max(...lngs),
      west: Math.min(...lngs),
    };

    return {
      id: cellId,
      latitude: centerLat,
      longitude: centerLng,
      count: jobs.length,
      averageSalaryMin: avgSalaryMin,
      averageSalaryMax: avgSalaryMax,
      categories,
      bounds,
      jobIds: jobs.map(j => j.id),
      isCluster: true,
      zoomRecommendation: this.getZoomForCluster(jobs.length),
    };
  }

  /**
   * Recommend zoom level to expand cluster
   * More jobs = zoom in more
   */
  getZoomForCluster(count) {
    if (count < 10) return 14;
    if (count < 50) return 13;
    if (count < 200) return 12;
    return 11;
  }

  /**
   * Merge clusters and unclustered into single array for rendering
   * Clusters sorted by job count (largest first for visual priority)
   */
  getMergedResults(clusters, unclustered) {
    const sorted = clusters.sort((a, b) => b.count - a.count);
    return [...sorted, ...unclustered];
  }

  /**
   * Get cluster statistics for UI display
   */
  getClusterStats(cluster) {
    return {
      count: cluster.count,
      salary: cluster.averageSalaryMin && cluster.averageSalaryMax
        ? `${cluster.averageSalaryMin}-${cluster.averageSalaryMax}`
        : 'N/A',
      topCategories: cluster.categories.slice(0, 2).join(', '),
      bounds: cluster.bounds,
    };
  }

  /**
   * Check if clustering is needed (multiple markers to cluster)
   */
  shouldCluster(jobs, zoomLevel) {
    if (zoomLevel >= 16) return false;
    if (!jobs || jobs.length < 2) return false;
    return true;
  }

  /**
   * Estimate cluster size on map (visual radius in pixels)
   * Helps with determining marker icon size
   */
  estimateClusterRadius(count) {
    if (count < 5) return 25;
    if (count < 20) return 30;
    if (count < 100) return 35;
    return 40;
  }
}

/**
 * Clustering utilities
 */
export const clusteringUtils = {
  /**
   * Create a cluster marker icon for display
   * Shows count and top category
   */
  createClusterIcon(cluster, isSelected = false) {
    const size = new ClusteringEngine().estimateClusterRadius(cluster.count);
    const fontSize = cluster.count > 99 ? '12px' : '14px';
    const borderWidth = isSelected ? '3px' : '2px';
    const bgColor = isSelected ? '#667eea' : '#667eea';
    const textColor = isSelected ? 'white' : 'white';

    return {
      html: `
        <div style="
          background: ${bgColor};
          border: ${borderWidth} solid #764ba2;
          border-radius: 50%;
          width: ${size}px;
          height: ${size}px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: ${fontSize};
          color: ${textColor};
          cursor: pointer;
          box-shadow: ${isSelected ? '0 4px 12px rgba(102, 126, 234, 0.5)' : '0 2px 8px rgba(0, 0, 0, 0.2)'};
          z-index: 10;
        ">
          ${cluster.count}
        </div>
      `,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
      popupAnchor: [0, -(size / 2)],
      className: 'cluster-marker',
    };
  },

  /**
   * Create cluster popup content
   */
  createClusterPopupContent(cluster) {
    return `
      <div style="text-align: center; min-width: 180px; font-size: 12px;">
        <strong>${cluster.count} وظيفة</strong>
        <p style="margin: 4px 0; color: #666;">
          ${cluster.categories.length > 0 ? cluster.categories.slice(0, 2).join(', ') : 'متنوعة'}
        </p>
        <p style="margin: 4px 0; color: #667eea; font-weight: 600;">
          ${cluster.averageSalaryMin ? `${cluster.averageSalaryMin}-${cluster.averageSalaryMax}` : 'N/A'}
        </p>
        <p style="margin: 4px 0; font-size: 11px; color: #999;">
          اضغط لتكبير
        </p>
      </div>
    `;
  },

  /**
   * Zoom to cluster bounds with padding
   */
  zoomToCluster(map, cluster, padding = 50) {
    if (!map) return;

    const bounds = [
      [cluster.bounds.south, cluster.bounds.west],
      [cluster.bounds.north, cluster.bounds.east],
    ];

    map.fitBounds(bounds, { padding: [padding, padding] });
  },
};

export default ClusteringEngine;
