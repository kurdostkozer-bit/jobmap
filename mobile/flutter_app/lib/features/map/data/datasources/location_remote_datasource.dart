import '../../../../core/services/api_client.dart';
import '../models/location_model.dart';

class LocationRemoteDataSource {
  final ApiClient _apiClient;

  LocationRemoteDataSource(this._apiClient);

  Future<List<GovernorateModel>> getAllGovernorates() async {
    try {
      final response = await _apiClient.get('/map/governorates');
      return (response as List)
          .map((gov) => GovernorateModel.fromJson(gov as Map<String, dynamic>))
          .toList();
    } catch (e) {
      rethrow;
    }
  }

  Future<List<DistrictModel>> getDistrictsByGovernorate(String governorateId) async {
    try {
      final response = await _apiClient.get('/map/governorates/$governorateId/districts');
      return (response as List)
          .map((dist) => DistrictModel.fromJson(dist as Map<String, dynamic>))
          .toList();
    } catch (e) {
      rethrow;
    }
  }

  Future<List<NeighborhoodModel>> getNeighborhoodsByDistrict(String districtId) async {
    try {
      final response = await _apiClient.get('/map/districts/$districtId/neighborhoods');
      return (response as List)
          .map((neigh) => NeighborhoodModel.fromJson(neigh as Map<String, dynamic>))
          .toList();
    } catch (e) {
      rethrow;
    }
  }

  Future<Map<String, dynamic>> getLocationDrillDown(String governorateId) async {
    try {
      return await _apiClient.get('/map/governorates/$governorateId/drill-down');
    } catch (e) {
      rethrow;
    }
  }
}
