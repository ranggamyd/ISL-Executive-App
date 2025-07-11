import 'package:flutter/foundation.dart';
import '../models/user.dart';
import '../models/menu.dart';
import '../services/api_service.dart';
import '../services/storage_service.dart';

class AuthProvider extends ChangeNotifier {
  final StorageService _storageService;
  final ApiService _apiService;
  
  User? _user;
  String? _token;
  List<Menu>? _menus;
  List<Permission>? _permissions;
  bool _isLoading = false;
  bool _isAuthenticated = false;

  AuthProvider(this._storageService, this._apiService) {
    _initializeAuth();
  }

  // Getters
  User? get user => _user;
  String? get token => _token;
  List<Menu>? get menus => _menus;
  List<Permission>? get permissions => _permissions;
  bool get isLoading => _isLoading;
  bool get isAuthenticated => _isAuthenticated;

  Future<void> _initializeAuth() async {
    _isLoading = true;
    notifyListeners();

    try {
      final userData = await _storageService.getUser();
      final tokenData = await _storageService.getToken();
      final menusData = await _storageService.getMenus();
      final permissionsData = await _storageService.getPermissions();

      if (userData != null && tokenData != null) {
        _user = userData;
        _token = tokenData;
        _menus = menusData;
        _permissions = permissionsData;
        _isAuthenticated = true;
        
        // Set token for API service
        _apiService.setToken(tokenData);
      }
    } catch (e) {
      debugPrint('Error initializing auth: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> login(String credential, String password) async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await _apiService.post('/login', {
        'credential': credential,
        'password': password,
      });

      final data = response['data'];
      
      _user = User.fromJson(data['user']);
      _token = data['token'];
      _menus = (data['menus'] as List)
          .map((menu) => Menu.fromJson(menu))
          .toList();
      _permissions = (data['permissions'] as List)
          .map((permission) => Permission.fromJson(permission))
          .toList();
      
      // Store data
      await _storageService.saveUser(_user!);
      await _storageService.saveToken(_token!);
      await _storageService.saveMenus(_menus!);
      await _storageService.savePermissions(_permissions!);
      
      // Set token for API service
      _apiService.setToken(_token!);
      
      _isAuthenticated = true;
      _isLoading = false;
      notifyListeners();
      
      return true;
    } catch (e) {
      _isLoading = false;
      notifyListeners();
      throw e;
    }
  }

  Future<void> logout() async {
    _isLoading = true;
    notifyListeners();

    try {
      await _apiService.post('/logout');
    } catch (e) {
      debugPrint('Error during logout: $e');
    } finally {
      // Clear local data regardless of API call result
      await _clearAuthData();
    }
  }

  Future<void> _clearAuthData() async {
    _user = null;
    _token = null;
    _menus = null;
    _permissions = null;
    _isAuthenticated = false;
    _isLoading = false;
    
    await _storageService.clearAll();
    _apiService.clearToken();
    
    notifyListeners();
  }

  Future<void> refreshUserData() async {
    if (!_isAuthenticated || _token == null) return;

    try {
      final response = await _apiService.get('/profile/me');
      final data = response['data'];
      
      _user = User.fromJson(data['user']);
      _menus = (data['menus'] as List)
          .map((menu) => Menu.fromJson(menu))
          .toList();
      _permissions = (data['permissions'] as List)
          .map((permission) => Permission.fromJson(permission))
          .toList();
      
      // Update stored data
      await _storageService.saveUser(_user!);
      await _storageService.saveMenus(_menus!);
      await _storageService.savePermissions(_permissions!);
      
      notifyListeners();
    } catch (e) {
      debugPrint('Error refreshing user data: $e');
    }
  }

  bool canAccess(String menuName, String accessType) {
    if (_permissions == null) return false;
    
    final permission = _permissions!.firstWhere(
      (p) => p.menu == menuName,
      orElse: () => Permission(menu: '', access: []),
    );
    
    return permission.access.contains(accessType);
  }
}

class Permission {
  final String menu;
  final List<String> access;

  Permission({
    required this.menu,
    required this.access,
  });

  factory Permission.fromJson(Map<String, dynamic> json) {
    return Permission(
      menu: json['menu'] ?? '',
      access: List<String>.from(json['access'] ?? []),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'menu': menu,
      'access': access,
    };
  }
}