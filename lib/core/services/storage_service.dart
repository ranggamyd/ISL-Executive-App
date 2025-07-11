import 'dart:convert';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../models/user.dart';
import '../models/menu.dart';
import '../providers/auth_provider.dart';

class StorageService {
  static const _storage = FlutterSecureStorage(
    aOptions: AndroidOptions(
      encryptedSharedPreferences: true,
    ),
    iOptions: IOSOptions(
      accessibility: KeychainItemAccessibility.first_unlock_this_device,
    ),
  );

  static const String _userKey = 'user';
  static const String _tokenKey = 'token';
  static const String _menusKey = 'menus';
  static const String _permissionsKey = 'permissions';

  // User
  Future<void> saveUser(User user) async {
    await _storage.write(key: _userKey, value: jsonEncode(user.toJson()));
  }

  Future<User?> getUser() async {
    final userJson = await _storage.read(key: _userKey);
    if (userJson != null) {
      return User.fromJson(jsonDecode(userJson));
    }
    return null;
  }

  // Token
  Future<void> saveToken(String token) async {
    await _storage.write(key: _tokenKey, value: token);
  }

  Future<String?> getToken() async {
    return await _storage.read(key: _tokenKey);
  }

  // Menus
  Future<void> saveMenus(List<Menu> menus) async {
    final menusJson = menus.map((menu) => menu.toJson()).toList();
    await _storage.write(key: _menusKey, value: jsonEncode(menusJson));
  }

  Future<List<Menu>?> getMenus() async {
    final menusJson = await _storage.read(key: _menusKey);
    if (menusJson != null) {
      final List<dynamic> menusList = jsonDecode(menusJson);
      return menusList.map((menu) => Menu.fromJson(menu)).toList();
    }
    return null;
  }

  // Permissions
  Future<void> savePermissions(List<Permission> permissions) async {
    final permissionsJson = permissions.map((permission) => permission.toJson()).toList();
    await _storage.write(key: _permissionsKey, value: jsonEncode(permissionsJson));
  }

  Future<List<Permission>?> getPermissions() async {
    final permissionsJson = await _storage.read(key: _permissionsKey);
    if (permissionsJson != null) {
      final List<dynamic> permissionsList = jsonDecode(permissionsJson);
      return permissionsList.map((permission) => Permission.fromJson(permission)).toList();
    }
    return null;
  }

  // Clear all
  Future<void> clearAll() async {
    await _storage.deleteAll();
  }
}