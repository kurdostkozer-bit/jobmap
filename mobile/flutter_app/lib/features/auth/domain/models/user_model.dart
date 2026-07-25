class UserModel {
  final String id;
  final String email;
  final String firstName;
  final String lastName;
  final String? phone;
  final String? avatarUrl;
  final String role; // seeker, employer, admin
  final bool? isEmailVerified;
  final DateTime createdAt;
  final DateTime? updatedAt;

  UserModel({
    required this.id,
    required this.email,
    required this.firstName,
    required this.lastName,
    this.phone,
    this.avatarUrl,
    required this.role,
    this.isEmailVerified,
    required this.createdAt,
    this.updatedAt,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'] as String,
      email: json['email'] as String,
      firstName: json['firstName'] as String,
      lastName: json['lastName'] as String,
      phone: json['phone'] as String?,
      avatarUrl: json['avatarUrl'] as String?,
      role: json['role'] as String? ?? 'seeker',
      isEmailVerified: json['isEmailVerified'] as bool?,
      createdAt: json['createdAt'] is String 
          ? DateTime.parse(json['createdAt'] as String)
          : json['createdAt'] as DateTime,
      updatedAt: json['updatedAt'] is String
          ? DateTime.parse(json['updatedAt'] as String)
          : json['updatedAt'] as DateTime?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      'firstName': firstName,
      'lastName': lastName,
      'phone': phone,
      'avatarUrl': avatarUrl,
      'role': role,
      'isEmailVerified': isEmailVerified,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt?.toIso8601String(),
    };
  }
}
