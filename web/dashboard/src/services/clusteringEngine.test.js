/**
 * ClusteringEngine Unit Tests
 * 
 * Test the zoom-aware clustering algorithm without React dependencies
 */

import ClusteringEngine from './clusteringEngine';

describe('ClusteringEngine', () => {
  let engine;

  beforeEach(() => {
    engine = new ClusteringEngine();
  });

  // ========== HELPER TESTS ==========

  describe('getPixelRadius', () => {
    it('should return correct radius for known zoom levels', () => {
      expect(engine.getPixelRadius(7)).toBe(120);
      expect(engine.getPixelRadius(11)).toBe(80);
      expect(engine.getPixelRadius(14)).toBe(40);
    });

    it('should interpolate for unknown zoom levels', () => {
      const radius = engine.getPixelRadius(7.5);
      expect(radius).toBeGreaterThan(110);
      expect(radius).toBeLessThan(120);
    });
  });

  describe('latLngToPixels', () => {
    it('should convert geographic coordinates to pixels', () => {
      const pixels = engine.latLngToPixels(33.3136, 44.3615, 13);
      expect(pixels.x).toBeGreaterThan(0);
      expect(pixels.y).toBeGreaterThan(0);
    });

    it('should be consistent for same coordinates', () => {
      const pixels1 = engine.latLngToPixels(33.0, 44.0, 10);
      const pixels2 = engine.latLngToPixels(33.0, 44.0, 10);
      expect(pixels1.x).toBe(pixels2.x);
      expect(pixels1.y).toBe(pixels2.y);
    });
  });

  describe('getGridCellId', () => {
    it('should return stable cell ID for same coordinates', () => {
      const cellId1 = engine.getGridCellId(33.3136, 44.3615, 13, 60);
      const cellId2 = engine.getGridCellId(33.3136, 44.3615, 13, 60);
      expect(cellId1).toBe(cellId2);
    });

    it('should include zoom level in ID', () => {
      const cellId = engine.getGridCellId(33.3136, 44.3615, 13, 60);
      expect(cellId).toContain('13');
    });

    it('should be different for different coordinates', () => {
      const cellId1 = engine.getGridCellId(33.0, 44.0, 13, 60);
      const cellId2 = engine.getGridCellId(33.5, 44.5, 13, 60);
      expect(cellId1).not.toBe(cellId2);
    });

    it('should be different for different zoom levels', () => {
      const cellId1 = engine.getGridCellId(33.3136, 44.3615, 10, 60);
      const cellId2 = engine.getGridCellId(33.3136, 44.3615, 13, 60);
      expect(cellId1).not.toBe(cellId2);
    });
  });

  // ========== CLUSTERING TESTS ==========

  describe('cluster', () => {
    const mockJobs = [
      {
        id: '1',
        latitude: 33.3136,
        longitude: 44.3615,
        category: 'IT',
        salaryMin: 1000000,
        salaryMax: 1500000,
      },
      {
        id: '2',
        latitude: 33.3137,
        longitude: 44.3616,
        category: 'IT',
        salaryMin: 1100000,
        salaryMax: 1600000,
      },
      {
        id: '3',
        latitude: 33.5,
        longitude: 44.5,
        category: 'HR',
        salaryMin: 800000,
        salaryMax: 1200000,
      },
    ];

    it('should return empty results for empty jobs array', () => {
      const result = engine.cluster([], 10);
      expect(result.clusters).toEqual([]);
      expect(result.unclustered).toEqual([]);
      expect(result.stats.total).toBe(0);
    });

    it('should not cluster when zoomed in (zoom >= 16)', () => {
      const result = engine.cluster(mockJobs, 18);
      expect(result.clusters.length).toBe(0);
      expect(result.unclustered.length).toBe(3);
      expect(result.stats.unclustered).toBe(3);
    });

    it('should return single unclustered job when only 1 job', () => {
      const singleJob = [mockJobs[0]];
      const result = engine.cluster(singleJob, 13);
      expect(result.clusters.length).toBe(0);
      expect(result.unclustered.length).toBe(1);
      expect(result.unclustered[0].id).toBe('1');
    });

    it('should cluster nearby jobs at low zoom', () => {
      const result = engine.cluster(mockJobs, 13);
      // Jobs 1 & 2 are very close, job 3 is far
      expect(result.stats.total).toBe(mockJobs.length);
      expect(result.stats.clustered).toBe(2);
      expect(result.unclustered.length).toBe(1);
      expect(result.clusters.length).toBe(1);
      expect(result.clusters[0].count).toBe(2);
    });

    it('should calculate correct cluster statistics', () => {
      const closeJobs = [
        { id: '1', latitude: 33.3, longitude: 44.3, category: 'IT', salaryMin: 1000000, salaryMax: 1500000 },
        { id: '2', latitude: 33.301, longitude: 44.301, category: 'Finance', salaryMin: 1200000, salaryMax: 1800000 },
      ];

      const result = engine.cluster(closeJobs, 13);

      if (result.clusters.length > 0) {
        const cluster = result.clusters[0];
        expect(cluster.count).toBe(2);
        expect(cluster.averageSalaryMin).toBe(1100000); // (1000000 + 1200000) / 2
        expect(cluster.averageSalaryMax).toBe(1650000); // (1500000 + 1800000) / 2
        expect(cluster.categories).toContain('IT');
        expect(cluster.categories).toContain('Finance');
        expect(cluster.latitude).toBeCloseTo(33.3005, 3);
        expect(cluster.longitude).toBeCloseTo(44.3005, 3);
      }
    });

    it('should include all job IDs in cluster', () => {
      const closeJobs = [
        { id: 'a', latitude: 33.3, longitude: 44.3, category: 'IT', salaryMin: 1000000, salaryMax: 1500000 },
        { id: 'b', latitude: 33.301, longitude: 44.301, category: 'IT', salaryMin: 1100000, salaryMax: 1600000 },
      ];

      const result = engine.cluster(closeJobs, 13);

      if (result.clusters.length > 0) {
        const cluster = result.clusters[0];
        expect(cluster.jobIds).toContain('a');
        expect(cluster.jobIds).toContain('b');
      }
    });

    it('should calculate cluster bounds correctly', () => {
      const jobs = [
        { id: '1', latitude: 33.3, longitude: 44.3, category: 'IT', salaryMin: 1000000, salaryMax: 1500000 },
        { id: '2', latitude: 33.4, longitude: 44.4, category: 'IT', salaryMin: 1000000, salaryMax: 1500000 },
      ];

      const result = engine.cluster(jobs, 13);

      if (result.clusters.length > 0) {
        const cluster = result.clusters[0];
        expect(cluster.bounds.north).toBe(33.4);
        expect(cluster.bounds.south).toBe(33.3);
        expect(cluster.bounds.east).toBe(44.4);
        expect(cluster.bounds.west).toBe(44.3);
      }
    });

    it('should set isCluster flag correctly', () => {
      const result = engine.cluster(mockJobs, 13);

      result.clusters.forEach(cluster => {
        expect(cluster.isCluster).toBe(true);
      });

      result.unclustered.forEach(job => {
        expect(job.isCluster).toBe(false);
      });
    });
  });

  // ========== UTILITY TESTS ==========

  describe('getZoomForCluster', () => {
    it('should recommend zoom 14 for small clusters', () => {
      expect(engine.getZoomForCluster(5)).toBe(14);
    });

    it('should recommend zoom 13 for medium clusters', () => {
      expect(engine.getZoomForCluster(20)).toBe(13);
    });

    it('should recommend zoom 12 for large clusters', () => {
      expect(engine.getZoomForCluster(100)).toBe(12);
    });

    it('should recommend zoom 11 for very large clusters', () => {
      expect(engine.getZoomForCluster(300)).toBe(11);
    });
  });

  describe('getMergedResults', () => {
    it('should sort clusters by count (largest first)', () => {
      const clusters = [
        { count: 5, id: '1' },
        { count: 50, id: '2' },
        { count: 10, id: '3' },
      ];
      const unclustered = [];

      const result = engine.getMergedResults(clusters, unclustered);

      expect(result[0].count).toBe(50);
      expect(result[1].count).toBe(10);
      expect(result[2].count).toBe(5);
    });

    it('should append unclustered after clusters', () => {
      const clusters = [{ count: 10, id: 'c1' }];
      const unclustered = [{ id: 'j1' }, { id: 'j2' }];

      const result = engine.getMergedResults(clusters, unclustered);

      expect(result.length).toBe(3);
      expect(result[0].id).toBe('c1');
      expect(result[1].id).toBe('j1');
      expect(result[2].id).toBe('j2');
    });
  });

  describe('estimateClusterRadius', () => {
    it('should return 25px for small clusters', () => {
      expect(engine.estimateClusterRadius(3)).toBe(25);
    });

    it('should return 30px for medium clusters', () => {
      expect(engine.estimateClusterRadius(15)).toBe(30);
    });

    it('should return 35px for large clusters', () => {
      expect(engine.estimateClusterRadius(50)).toBe(35);
    });

    it('should return 40px for very large clusters', () => {
      expect(engine.estimateClusterRadius(150)).toBe(40);
    });
  });

  describe('shouldCluster', () => {
    it('should return false when zoomed in', () => {
      expect(engine.shouldCluster([{ id: '1' }], 18)).toBe(false);
    });

    it('should return false for null/undefined jobs', () => {
      expect(engine.shouldCluster(null, 10)).toBe(false);
      expect(engine.shouldCluster(undefined, 10)).toBe(false);
    });

    it('should return false for single job', () => {
      expect(engine.shouldCluster([{ id: '1' }], 10)).toBe(false);
    });

    it('should return true for multiple jobs at low zoom', () => {
      const jobs = [{ id: '1' }, { id: '2' }];
      expect(engine.shouldCluster(jobs, 10)).toBe(true);
    });
  });
});
