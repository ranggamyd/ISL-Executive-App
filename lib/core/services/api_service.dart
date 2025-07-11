import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';

class ApiService {
  late final Dio _dio;
  String? _token;

  ApiService() {
    _dio = Dio(BaseOptions(
      baseURL: const String.fromEnvironment('API_URL', defaultValue: 'https://api.example.com'),
      connectTimeout: const Duration(seconds: 10),
      receiveTimeout: const Duration(seconds: 10),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    ));

    _setupInterceptors();
  }

  void _setupInterceptors() {
    _dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) {
          if (_token != null) {
            options.headers['Authorization'] = 'Bearer $_token';
          }
          if (kDebugMode) {
            print('REQUEST: ${options.method} ${options.path}');
            print('HEADERS: ${options.headers}');
            if (options.data != null) {
              print('DATA: ${options.data}');
            }
          }
          handler.next(options);
        },
        onResponse: (response, handler) {
          if (kDebugMode) {
            print('RESPONSE: ${response.statusCode} ${response.requestOptions.path}');
            print('DATA: ${response.data}');
          }
          handler.next(response);
        },
        onError: (error, handler) {
          if (kDebugMode) {
            print('ERROR: ${error.response?.statusCode} ${error.requestOptions.path}');
            print('MESSAGE: ${error.message}');
            print('DATA: ${error.response?.data}');
          }
          
          // Handle 401 Unauthorized
          if (error.response?.statusCode == 401) {
            // Clear token and redirect to login
            _token = null;
            // You might want to emit an event here to notify the app
          }
          
          handler.next(error);
        },
      ),
    );
  }

  void setToken(String token) {
    _token = token;
  }

  void clearToken() {
    _token = null;
  }

  Future<Map<String, dynamic>> get(String path, {Map<String, dynamic>? queryParameters}) async {
    try {
      final response = await _dio.get(path, queryParameters: queryParameters);
      return _handleResponse(response);
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  Future<Map<String, dynamic>> post(String path, [dynamic data]) async {
    try {
      final response = await _dio.post(path, data: data);
      return _handleResponse(response);
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  Future<Map<String, dynamic>> put(String path, [dynamic data]) async {
    try {
      final response = await _dio.put(path, data: data);
      return _handleResponse(response);
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  Future<Map<String, dynamic>> delete(String path) async {
    try {
      final response = await _dio.delete(path);
      return _handleResponse(response);
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  Future<Map<String, dynamic>> postFormData(String path, FormData formData) async {
    try {
      final response = await _dio.post(
        path,
        data: formData,
        options: Options(
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        ),
      );
      return _handleResponse(response);
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  Map<String, dynamic> _handleResponse(Response response) {
    if (response.statusCode! >= 200 && response.statusCode! < 300) {
      return response.data as Map<String, dynamic>;
    } else {
      throw ApiException(
        message: 'HTTP ${response.statusCode}: ${response.statusMessage}',
        statusCode: response.statusCode,
      );
    }
  }

  ApiException _handleError(DioException error) {
    String message = 'An error occurred';
    int? statusCode = error.response?.statusCode;

    if (error.type == DioExceptionType.connectionTimeout ||
        error.type == DioExceptionType.receiveTimeout) {
      message = 'Connection timeout';
    } else if (error.type == DioExceptionType.connectionError) {
      message = 'No internet connection';
    } else if (error.response?.data != null) {
      final data = error.response!.data;
      if (data is Map<String, dynamic>) {
        message = data['message'] ?? message;
      }
    }

    return ApiException(
      message: message,
      statusCode: statusCode,
      originalError: error,
    );
  }
}

class ApiException implements Exception {
  final String message;
  final int? statusCode;
  final DioException? originalError;

  ApiException({
    required this.message,
    this.statusCode,
    this.originalError,
  });

  @override
  String toString() => message;
}