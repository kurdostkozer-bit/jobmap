import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/datasources/applications_remote_datasource.dart';
import '../../data/models/application_model.dart';
import '../../data/repositories/applications_repository.dart';
import '../../../../core/services/api_client.dart';

// Applications Remote DataSource Provider
final applicationsRemoteDataSourceProvider = Provider<ApplicationsRemoteDataSource>((ref) {
  final apiClient = ref.watch(apiClientProvider);
  return ApplicationsRemoteDataSource(apiClient);
});

// Applications Repository Provider
final applicationsRepositoryProvider = Provider<ApplicationsRepository>((ref) {
  final remoteDataSource = ref.watch(applicationsRemoteDataSourceProvider);
  return ApplicationsRepository(remoteDataSource);
});

// My Applications Future Provider
final myApplicationsProvider = FutureProvider<List<ApplicationModel>>((ref) async {
  final repository = ref.watch(applicationsRepositoryProvider);
  return await repository.getMyApplications();
});

// Application Status
class ApplicationsState {
  final List<ApplicationModel> applications;
  final bool isLoading;
  final String? error;

  ApplicationsState({
    this.applications = const [],
    this.isLoading = false,
    this.error,
  });

  ApplicationsState copyWith({
    List<ApplicationModel>? applications,
    bool? isLoading,
    String? error,
  }) {
    return ApplicationsState(
      applications: applications ?? this.applications,
      isLoading: isLoading ?? this.isLoading,
      error: error,
    );
  }
}

// Applications Notifier
class ApplicationsNotifier extends StateNotifier<ApplicationsState> {
  final ApplicationsRepository _repository;

  ApplicationsNotifier(this._repository) : super(ApplicationsState());

  Future<void> applyForJob({
    required String jobId,
    String? coverLetter,
    String? cvUrl,
  }) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final application = await _repository.createApplication(
        jobId: jobId,
        coverLetter: coverLetter,
        cvUrl: cvUrl,
      );
      state = state.copyWith(
        applications: [...state.applications, application],
        isLoading: false,
      );
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }

  Future<void> loadMyApplications() async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final applications = await _repository.getMyApplications();
      state = state.copyWith(applications: applications, isLoading: false);
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }

  Future<void> withdrawApplication(String applicationId) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      await _repository.withdrawApplication(applicationId);
      state = state.copyWith(
        applications: state.applications
            .where((app) => app.id != applicationId)
            .toList(),
        isLoading: false,
      );
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }
}

// Applications Provider
final applicationsProvider = StateNotifierProvider<ApplicationsNotifier, ApplicationsState>((ref) {
  final repository = ref.watch(applicationsRepositoryProvider);
  return ApplicationsNotifier(repository);
});

// Api Client Provider (for import in other files)
final apiClientProvider = Provider<ApiClient>((ref) {
  return ApiClient();
});
