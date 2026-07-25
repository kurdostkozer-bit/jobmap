class JobModel {
  final String id;
  final String companyId;
  final String title;
  final String description;
  final String governorate;
  final String? district;
  final String? neighborhood;
  final double anonymizedLatitude;
  final double anonymizedLongitude;
  final double? salaryMin;
  final double? salaryMax;
  final String salaryCurrency;
  final List<String> skills;
  final List<String> languages;
  final String jobType;
  final String experienceLevel;
  final int applicantsCount;
  final DateTime createdAt;
  final DateTime? expiresAt;

  JobModel({
    required this.id,
    required this.companyId,
    required this.title,
    required this.description,
    required this.governorate,
    this.district,
    this.neighborhood,
    required this.anonymizedLatitude,
    required this.anonymizedLongitude,
    this.salaryMin,
    this.salaryMax,
    required this.salaryCurrency,
    required this.skills,
    required this.languages,
    required this.jobType,
    required this.experienceLevel,
    required this.applicantsCount,
    required this.createdAt,
    this.expiresAt,
  });

  factory JobModel.fromJson(Map<String, dynamic> json) {
    return JobModel(
      id: json['id'] as String,
      companyId: json['companyId'] as String,
      title: json['title'] as String,
      description: json['description'] as String,
      governorate: json['governorate'] as String,
      district: json['district'] as String?,
      neighborhood: json['neighborhood'] as String?,
      anonymizedLatitude: (json['anonymizedLatitude'] as num).toDouble(),
      anonymizedLongitude: (json['anonymizedLongitude'] as num).toDouble(),
      salaryMin: json['salaryMin'] != null ? (json['salaryMin'] as num).toDouble() : null,
      salaryMax: json['salaryMax'] != null ? (json['salaryMax'] as num).toDouble() : null,
      salaryCurrency: json['salaryCurrency'] as String? ?? 'IQD',
      skills: List<String>.from(json['skills'] as List? ?? []),
      languages: List<String>.from(json['languages'] as List? ?? []),
      jobType: json['jobType'] as String? ?? 'Full-Time',
      experienceLevel: json['experienceLevel'] as String? ?? 'Entry',
      applicantsCount: json['applicantsCount'] as int? ?? 0,
      createdAt: DateTime.parse(json['createdAt'] as String),
      expiresAt: json['expiresAt'] != null ? DateTime.parse(json['expiresAt'] as String) : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'companyId': companyId,
      'title': title,
      'description': description,
      'governorate': governorate,
      'district': district,
      'neighborhood': neighborhood,
      'anonymizedLatitude': anonymizedLatitude,
      'anonymizedLongitude': anonymizedLongitude,
      'salaryMin': salaryMin,
      'salaryMax': salaryMax,
      'salaryCurrency': salaryCurrency,
      'skills': skills,
      'languages': languages,
      'jobType': jobType,
      'experienceLevel': experienceLevel,
      'applicantsCount': applicantsCount,
      'createdAt': createdAt.toIso8601String(),
      'expiresAt': expiresAt?.toIso8601String(),
    };
  }
}
