class ApplicationModel {
  final String id;
  final String userId;
  final String jobId;
  final String status; // APPLIED, REVIEWED, INTERVIEW, OFFERED, REJECTED, WITHDRAWN
  final String? coverLetter;
  final String? cvUrl;
  final DateTime? reviewedAt;
  final DateTime appliedAt;
  final DateTime updatedAt;

  ApplicationModel({
    required this.id,
    required this.userId,
    required this.jobId,
    required this.status,
    this.coverLetter,
    this.cvUrl,
    this.reviewedAt,
    required this.appliedAt,
    required this.updatedAt,
  });

  factory ApplicationModel.fromJson(Map<String, dynamic> json) {
    return ApplicationModel(
      id: json['id'] as String,
      userId: json['userId'] as String,
      jobId: json['jobId'] as String,
      status: json['status'] as String? ?? 'APPLIED',
      coverLetter: json['coverLetter'] as String?,
      cvUrl: json['cvUrl'] as String?,
      reviewedAt: json['reviewedAt'] != null ? DateTime.parse(json['reviewedAt'] as String) : null,
      appliedAt: DateTime.parse(json['appliedAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'userId': userId,
      'jobId': jobId,
      'status': status,
      'coverLetter': coverLetter,
      'cvUrl': cvUrl,
      'reviewedAt': reviewedAt?.toIso8601String(),
      'appliedAt': appliedAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }
}
