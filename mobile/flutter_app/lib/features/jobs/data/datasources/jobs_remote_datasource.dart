import '../../../../core/services/api_client.dart';
import '../models/job_model.dart';

class JobsRemoteDataSource {
  final ApiClient _apiClient;

  JobsRemoteDataSource(this._apiClient);

  Future<List<JobModel>> getJobsByGovernorate(String governorate) async {
    try {
      final response = await _apiClient.get('/jobs/governorate/$governorate');
      return (response as List)
          .map((job) => JobModel.fromJson(job as Map<String, dynamic>))
          .toList();
    } catch (e) {
      rethrow;
    }
  }

  Future<List<JobModel>> searchJobs({
    required String query,
    String? governorate,
    double? salaryMin,
    double? salaryMax,
  }) async {
    try {
      String path = '/jobs/search?q=$query';
      if (governorate != null) path += '&governorate=$governorate';
      if (salaryMin != null) path += '&salaryMin=$salaryMin';
      if (salaryMax != null) path += '&salaryMax=$salaryMax';

      final response = await _apiClient.get(path);
      return (response as List)
          .map((job) => JobModel.fromJson(job as Map<String, dynamic>))
          .toList();
    } catch (e) {
      rethrow;
    }
  }

  Future<List<JobModel>> getNearbyJobs({
    required double latitude,
    required double longitude,
    double radius = 50,
  }) async {
    try {
      final response = await _apiClient.get(
        '/jobs/location/nearby?lat=$latitude&lng=$longitude&radius=$radius',
      );
      return (response as List)
          .map((job) => JobModel.fromJson(job as Map<String, dynamic>))
          .toList();
    } catch (e) {
      rethrow;
    }
  }

  Future<JobModel> getJobById(String id) async {
    try {
      final response = await _apiClient.get('/jobs/$id');
      return JobModel.fromJson(response as Map<String, dynamic>);
    } catch (e) {
      rethrow;
    }
  }
}
