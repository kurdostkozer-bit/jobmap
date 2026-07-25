import '../datasources/applications_remote_datasource.dart';
import '../models/application_model.dart';

class ApplicationsRepository {
  final ApplicationsRemoteDataSource _remoteDataSource;

  ApplicationsRepository(this._remoteDataSource);

  Future<ApplicationModel> createApplication({
    required String jobId,
    String? coverLetter,
    String? cvUrl,
  }) async {
    try {
      return await _remoteDataSource.createApplication(
        jobId: jobId,
        coverLetter: coverLetter,
        cvUrl: cvUrl,
      );
    } catch (e) {
      rethrow;
    }
  }

  Future<List<ApplicationModel>> getMyApplications() async {
    try {
      return await _remoteDataSource.getMyApplications();
    } catch (e) {
      rethrow;
    }
  }

  Future<void> withdrawApplication(String applicationId) async {
    try {
      await _remoteDataSource.withdrawApplication(applicationId);
    } catch (e) {
      rethrow;
    }
  }

  Future<ApplicationModel> getApplicationStatus(String applicationId) async {
    try {
      return await _remoteDataSource.getApplicationStatus(applicationId);
    } catch (e) {
      rethrow;
    }
  }
}
