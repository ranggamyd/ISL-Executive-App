import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';

import 'providers/auth_provider.dart';
import 'providers/theme_provider.dart';
import 'providers/language_provider.dart';
import 'router/app_router.dart';
import 'theme/app_theme.dart';
import 'localization/app_localizations.dart';

class ISLExecutiveApp extends StatelessWidget {
  const ISLExecutiveApp({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer3<ThemeProvider, LanguageProvider, AuthProvider>(
      builder: (context, themeProvider, languageProvider, authProvider, child) {
        final router = AppRouter.createRouter(authProvider);
        
        return MaterialApp.router(
          title: 'ISL Executive App',
          debugShowCheckedModeBanner: false,
          
          // Theme
          theme: AppTheme.lightTheme,
          darkTheme: AppTheme.darkTheme,
          themeMode: themeProvider.themeMode,
          
          // Localization
          locale: languageProvider.locale,
          supportedLocales: AppLocalizations.supportedLocales,
          localizationsDelegates: AppLocalizations.localizationsDelegates,
          
          // Router
          routerConfig: router,
        );
      },
    );
  }
}