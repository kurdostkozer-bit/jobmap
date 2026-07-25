class GovernorateModel {
  final String id;
  final String name;
  final double latitude;
  final double longitude;
  final int? populationEstimate;

  GovernorateModel({
    required this.id,
    required this.name,
    required this.latitude,
    required this.longitude,
    this.populationEstimate,
  });

  factory GovernorateModel.fromJson(Map<String, dynamic> json) {
    return GovernorateModel(
      id: json['id'] as String,
      name: json['name'] as String,
      latitude: (json['latitude'] as num).toDouble(),
      longitude: (json['longitude'] as num).toDouble(),
      populationEstimate: json['populationEstimate'] as int?,
    );
  }
}

class DistrictModel {
  final String id;
  final String governorateId;
  final String name;
  final double latitude;
  final double longitude;

  DistrictModel({
    required this.id,
    required this.governorateId,
    required this.name,
    required this.latitude,
    required this.longitude,
  });

  factory DistrictModel.fromJson(Map<String, dynamic> json) {
    return DistrictModel(
      id: json['id'] as String,
      governorateId: json['governorateId'] as String,
      name: json['name'] as String,
      latitude: (json['latitude'] as num).toDouble(),
      longitude: (json['longitude'] as num).toDouble(),
    );
  }
}

class NeighborhoodModel {
  final String id;
  final String districtId;
  final String name;
  final double latitude;
  final double longitude;

  NeighborhoodModel({
    required this.id,
    required this.districtId,
    required this.name,
    required this.latitude,
    required this.longitude,
  });

  factory NeighborhoodModel.fromJson(Map<String, dynamic> json) {
    return NeighborhoodModel(
      id: json['id'] as String,
      districtId: json['districtId'] as String,
      name: json['name'] as String,
      latitude: (json['latitude'] as num).toDouble(),
      longitude: (json['longitude'] as num).toDouble(),
    );
  }
}
