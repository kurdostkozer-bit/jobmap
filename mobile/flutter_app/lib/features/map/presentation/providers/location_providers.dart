import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/datasources/location_remote_datasource.dart';
import '../../data/models/location_model.dart';
import '../../data/repositories/location_repository.dart';
import '../../../../core/services/api_client.dart';

// Location Remote DataSource Provider
final locationRemoteDataSourceProvider = Provider<LocationRemoteDataSource>((ref) {
  final apiClient = ref.watch(apiClientProvider);
  return LocationRemoteDataSource(apiClient);
});

// Location Repository Provider
final locationRepositoryProvider = Provider<LocationRepository>((ref) {
  final remoteDataSource = ref.watch(locationRemoteDataSourceProvider);
  return LocationRepository(remoteDataSource);
});

// Governorates Future Provider
final governoratesProvider = FutureProvider<List<GovernorateModel>>((ref) async {
  final repository = ref.watch(locationRepositoryProvider);
  return await repository.getAllGovernorates();
});

// Districts by Governorate
final districtsByGovernorateProvider = FutureProvider.family<
    List<DistrictModel>,
    String>((ref, governorateId) async {
  final repository = ref.watch(locationRepositoryProvider);
  return await repository.getDistrictsByGovernorate(governorateId);
});

// Neighborhoods by District
final neighborhoodsByDistrictProvider = FutureProvider.family<
    List<NeighborhoodModel>,
    String>((ref, districtId) async {
  final repository = ref.watch(locationRepositoryProvider);
  return await repository.getNeighborhoodsByDistrict(districtId);
});

// Location Drill Down (full hierarchy)
final locationDrillDownProvider = FutureProvider.family<
    Map<String, dynamic>,
    String>((ref, governorateId) async {
  final repository = ref.watch(locationRepositoryProvider);
  return await repository.getLocationDrillDown(governorateId);
});

// Selected Location State
class MapLocationState {
  final GovernorateModel? selectedGovernorate;
  final DistrictModel? selectedDistrict;
  final NeighborhoodModel? selectedNeighborhood;

  MapLocationState({
    this.selectedGovernorate,
    this.selectedDistrict,
    this.selectedNeighborhood,
  });

  MapLocationState copyWith({
    GovernorateModel? selectedGovernorate,
    DistrictModel? selectedDistrict,
    NeighborhoodModel? selectedNeighborhood,
  }) {
    return MapLocationState(
      selectedGovernorate: selectedGovernorate ?? this.selectedGovernorate,
      selectedDistrict: selectedDistrict ?? this.selectedDistrict,
      selectedNeighborhood: selectedNeighborhood ?? this.selectedNeighborhood,
    );
  }
}

class MapLocationNotifier extends StateNotifier<MapLocationState> {
  MapLocationNotifier() : super(MapLocationState());

  void selectGovernorate(GovernorateModel governorate) {
    state = state.copyWith(
      selectedGovernorate: governorate,
      selectedDistrict: null,
      selectedNeighborhood: null,
    );
  }

  void selectDistrict(DistrictModel district) {
    state = state.copyWith(
      selectedDistrict: district,
      selectedNeighborhood: null,
    );
  }

  void selectNeighborhood(NeighborhoodModel neighborhood) {
    state = state.copyWith(selectedNeighborhood: neighborhood);
  }

  void reset() {
    state = MapLocationState();
  }
}

final mapLocationProvider = StateNotifierProvider<MapLocationNotifier, MapLocationState>((ref) {
  return MapLocationNotifier();
});

// Api Client Provider (for import in other files)
final apiClientProvider = Provider<ApiClient>((ref) {
  return ApiClient();
});
