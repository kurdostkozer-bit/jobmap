// Location Anonymization Service
// Randomizes job coordinates within district bounds for privacy

export interface AnonymizedCoordinates {
  lat: number;
  lng: number;
  radiusKm: number;
}

/**
 * Anonymizes job coordinates by adding random offset within district bounds
 * This ensures actual company location is not visible to job seekers
 * 
 * @param realLat - Actual job location latitude
 * @param realLng - Actual job location longitude
 * @param location - District or governorate name for radius calculation
 * @returns Anonymized coordinates with randomized offset
 */
export function anonymizeCoordinates(
  realLat: number,
  realLng: number,
  location: string,
): AnonymizedCoordinates {
  // Different radius for different location types
  let radiusKm = 2; // Default 2km radius

  // Larger districts get larger anonymization radius
  if (location?.toLowerCase().includes('karrada')) radiusKm = 1.5;
  if (location?.toLowerCase().includes('mansour')) radiusKm = 2.0;
  if (location?.toLowerCase().includes('baghdad')) radiusKm = 5.0;

  // Random offset in meters
  const offsetMeters = Math.random() * (radiusKm * 1000);
  const offsetAngle = Math.random() * 2 * Math.PI;

  // Convert to degrees (1 degree ~ 111km at equator)
  const latOffset = (offsetMeters / 111000) * Math.cos(offsetAngle);
  const lngOffset = (offsetMeters / 111000) * Math.sin(offsetAngle);

  return {
    lat: parseFloat((realLat + latOffset).toFixed(8)),
    lng: parseFloat((realLng + lngOffset).toFixed(8)),
    radiusKm,
  };
}

/**
 * Creates a bounding box for district-level searches
 * Used to show jobs within a district without revealing exact location
 */
export function getDistrictBoundingBox(
  centerLat: number,
  centerLng: number,
  districtRadiusKm: number = 2,
) {
  const latOffset = districtRadiusKm / 111;
  const lngOffset = districtRadiusKm / (111 * Math.cos((centerLat * Math.PI) / 180));

  return {
    north: centerLat + latOffset,
    south: centerLat - latOffset,
    east: centerLng + lngOffset,
    west: centerLng - lngOffset,
  };
}

/**
 * Clusters nearby jobs for map visualization
 * Groups jobs within proximity to reduce visual clutter
 */
export function clusterJobs(
  jobs: any[],
  clusterRadiusKm: number = 1,
): Map<string, any[]> {
  const clusters = new Map<string, any[]>();

  for (const job of jobs) {
    let clusterId = null;

    // Find if job belongs to existing cluster
    for (const [id, clusterJobs] of clusters.entries()) {
      const baseJob = clusterJobs[0];
      const distance = calculateDistance(
        job.anonymizedLatitude,
        job.anonymizedLongitude,
        baseJob.anonymizedLatitude,
        baseJob.anonymizedLongitude,
      );

      if (distance <= clusterRadiusKm) {
        clusterId = id;
        break;
      }
    }

    // Create new cluster if needed
    if (clusterId === null) {
      clusterId = `${job.anonymizedLatitude},${job.anonymizedLongitude}`;
    }

    if (!clusters.has(clusterId)) {
      clusters.set(clusterId, []);
    }

    clusters.get(clusterId)?.push(job);
  }

  return clusters;
}

/**
 * Haversine formula to calculate distance between two coordinates
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
