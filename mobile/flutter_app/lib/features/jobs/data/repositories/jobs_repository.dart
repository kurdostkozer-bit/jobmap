import '../datasources/jobs_remote_datasource.dart';
import '../models/job_model.dart';

class JobsRepository {
  final JobsRemoteDataSource _remoteDataSource;

  JobsRepository(this._remoteDataSource);

  Future<List<JobModel>> getJobsByGovernorate(String governorate) async {
    try {
      return await _remoteDataSource.getJobsByGovernorate(governorate);
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
      return await _remoteDataSource.searchJobs(
        query: query,
        governorate: governorate,
        salaryMin: salaryMin,
        salaryMax: salaryMax,
      );
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
      return await _remoteDataSource.getNearbyJobs(
        latitude: latitude,
        longitude: longitude,
        radius: radius,
      );
    } catch (e) {
      rethrow;
    }
  }

  Future<JobModel> getJobById(String id) async {
    try {
      return await _remoteDataSource.getJobById(id);
    } catch (e) {
      rethrow;
    }
  }
}
