class Menu {
  final String id;
  final String name;
  final String group;
  final String? groupIcon;
  final String path;
  final String icon;
  final String theme;

  Menu({
    required this.id,
    required this.name,
    required this.group,
    this.groupIcon,
    required this.path,
    required this.icon,
    required this.theme,
  });

  factory Menu.fromJson(Map<String, dynamic> json) {
    return Menu(
      id: json['id']?.toString() ?? '',
      name: json['name'] ?? '',
      group: json['group'] ?? '',
      groupIcon: json['groupIcon'],
      path: json['path'] ?? '',
      icon: json['icon'] ?? '',
      theme: json['theme'] ?? 'gray',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'group': group,
      'groupIcon': groupIcon,
      'path': path,
      'icon': icon,
      'theme': theme,
    };
  }
}