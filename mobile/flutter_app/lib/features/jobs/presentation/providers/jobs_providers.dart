import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/datasources/jobs_remote_datasource.dart';
import '../../data/models/job_model.dart';
import '../../data/repositories/jobs_repository.dart';
import '../../../../core/services/api_client.dart';

// Jobs Remote DataSource Provider
final jobsRemoteDataSourceProvider = Provider<JobsRemoteDataSource>((ref) {
  final apiClient = ref.watch(apiClientProvider);
  return JobsRemoteDataSource(apiClient);
});

// Jobs Repository Provider
final jobsRepositoryProvider = Provider<JobsRepository>((ref) {
  final remoteDataSource = ref.watch(jobsRemoteDataSourceProvider);
  return JobsRepository(remoteDataSource);
});

// Jobs State
class JobsState {
  final List<JobModel> jobs;
  final bool isLoading;
  final String? error;
  final String? selectedGovernorate;

  JobsState({
    this.jobs = const [],
    this.isLoading = false,
    this.error,
    this.selectedGovernorate,
  });

  JobsState copyWith({
    List<JobModel>? jobs,
    bool? isLoading,
    String? error,
    String? selectedGovernorate,
  }) {
    return JobsState(
      jobs: jobs ?? this.jobs,
      isLoading: isLoading ?? this.isLoading,
      error: error,
      selectedGovernorate: selectedGovernorate ?? this.selectedGovernorate,
    );
  }
}

// Jobs Notifier
class JobsNotifier extends StateNotifier<JobsState> {
  final JobsRepository _repository;

  JobsNotifier(this._repository) : super(JobsState());

  Future<void> loadJobsByGovernorate(String governorate) async {
    state = state.copyWith(isLoading: true, error: null, selectedGovernorate: governorate);
    try {
      final jobs = await _repository.getJobsByGovernorate(governorate);
      state = state.copyWith(jobs: jobs, isLoading: false);
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }

  Future<void> searchJobs({
    required String query,
    String? governorate,
    double? salaryMin,
    double? salaryMax,
  }) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final jobs = await _repository.searchJobs(
        query: query,
        governorate: governorate,
        salaryMin: salaryMin,
        salaryMax: salaryMax,
      );
      state = state.copyWith(jobs: jobs, isLoading: false);
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }

  Future<void> loadNearbyJobs({
    required double latitude,
    required double longitude,
    double radius = 50,
  }) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final jobs = await _repository.getNearbyJobs(
        latitude: latitude,
        longitude: longitude,
        radius: radius,
      );
      state = state.copyWith(jobs: jobs, isLoading: false);
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }
}

// Jobs Provider
final jobsProvider = StateNotifierProvider<JobsNotifier, JobsState>((ref) {
  final repository = ref.watch(jobsRepositoryProvider);
  return JobsNotifier(repository);
});

// Api Client Provider (for import in other files)
final apiClientProvider = Provider<ApiClient>((ref) {
  return ApiClient();
});

// Single Job Provider
final singleJobProvider = FutureProvider.family<JobModel?, String>((ref, jobId) async {
  final repository = ref.watch(jobsRepositoryProvider);
  try {
    return await repository.getJobById(jobId);
  } catch (e) {
    return null;
  }
});
