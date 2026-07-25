import '../../../../core/services/api_client.dart';
import '../models/application_model.dart';

class ApplicationsRemoteDataSource {
  final ApiClient _apiClient;

  ApplicationsRemoteDataSource(this._apiClient);

  Future<ApplicationModel> createApplication({
    required String jobId,
    String? coverLetter,
    String? cvUrl,
  }) async {
    try {
      final response = await _apiClient.post(
        '/applications',
        data: {
          'jobId': jobId,
          'coverLetter': coverLetter,
          'cvUrl': cvUrl,
        },
      );
      return ApplicationModel.fromJson(response as Map<String, dynamic>);
    } catch (e) {
      rethrow;
    }
  }

  Future<List<ApplicationModel>> getMyApplications() async {
    try {
      final response = await _apiClient.get('/applications/user/my-applications');
      return (response as List)
          .map((app) => ApplicationModel.fromJson(app as Map<String, dynamic>))
          .toList();
    } catch (e) {
      rethrow;
    }
  }

  Future<void> withdrawApplication(String applicationId) async {
    try {
      await _apiClient.delete('/applications/$applicationId');
    } catch (e) {
      rethrow;
    }
  }

  Future<ApplicationModel> getApplicationStatus(String applicationId) async {
    try {
      final response = await _apiClient.get('/applications/$applicationId');
      return ApplicationModel.fromJson(response as Map<String, dynamic>);
    } catch (e) {
      rethrow;
    }
  }
}
