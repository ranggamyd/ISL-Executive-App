class User {
  final String id;
  final String name;
  final String email;
  final String? username;
  final String? phone;
  final String? avatar;

  User({
    required this.id,
    required this.name,
    required this.email,
    this.username,
    this.phone,
    this.avatar,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id']?.toString() ?? '',
      name: json['name'] ?? '',
      email: json['email'] ?? '',
      username: json['username'],
      phone: json['phone'],
      avatar: json['avatar'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'email': email,
      'username': username,
      'phone': phone,
      'avatar': avatar,
    };
  }

  User copyWith({
    String? id,
    String? name,
    String? email,
    String? username,
    String? phone,
    String? avatar,
  }) {
    return User(
      id: id ?? this.id,
      name: name ?? this.name,
      email: email ?? this.email,
      username: username ?? this.username,
      phone: phone ?? this.phone,
      avatar: avatar ?? this.avatar,
    );
  }
}