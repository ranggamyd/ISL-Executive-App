import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class LanguageProvider extends ChangeNotifier {
  static const String _languageKey = 'language';
  final SharedPreferences _prefs;
  
  Locale _locale = const Locale('en');

  LanguageProvider(this._prefs) {
    _loadLanguage();
  }

  Locale get locale => _locale;

  void _loadLanguage() {
    final languageCode = _prefs.getString(_languageKey) ?? 'en';
    _locale = Locale(languageCode);
    notifyListeners();
  }

  Future<void> setLanguage(String languageCode) async {
    _locale = Locale(languageCode);
    await _prefs.setString(_languageKey, languageCode);
    notifyListeners();
  }

  String get languageCode => _locale.languageCode;
  
  bool get isEnglish => _locale.languageCode == 'en';
  bool get isIndonesian => _locale.languageCode == 'id';
  bool get isChinese => _locale.languageCode == 'zh';
}