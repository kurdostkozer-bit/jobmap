import '../datasources/location_remote_datasource.dart';
import '../models/location_model.dart';

class LocationRepository {
  final LocationRemoteDataSource _remoteDataSource;

  LocationRepository(this._remoteDataSource);

  Future<List<GovernorateModel>> getAllGovernorates() async {
    try {
      return await _remoteDataSource.getAllGovernorates();
    } catch (e) {
      rethrow;
    }
  }

  Future<List<DistrictModel>> getDistrictsByGovernorate(String governorateId) async {
    try {
      return await _remoteDataSource.getDistrictsByGovernorate(governorateId);
    } catch (e) {
      rethrow;
    }
  }

  Future<List<NeighborhoodModel>> getNeighborhoodsByDistrict(String districtId) async {
    try {
      return await _remoteDataSource.getNeighborhoodsByDistrict(districtId);
    } catch (e) {
      rethrow;
    }
  }

  Future<Map<String, dynamic>> getLocationDrillDown(String governorateId) async {
    try {
      return await _remoteDataSource.getLocationDrillDown(governorateId);
    } catch (e) {
      rethrow;
    }
  }
}
