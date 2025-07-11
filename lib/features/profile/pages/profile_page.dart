import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../../core/providers/auth_provider.dart';
import '../../../core/providers/theme_provider.dart';
import '../../../core/providers/language_provider.dart';
import '../../../core/localization/app_localizations.dart';
import '../../../shared/widgets/custom_button.dart';

class ProfilePage extends StatelessWidget {
  const ProfilePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Consumer3<AuthProvider, ThemeProvider, LanguageProvider>(
        builder: (context, authProvider, themeProvider, languageProvider, child) {
          final user = authProvider.user;
          
          return CustomScrollView(
            slivers: [
              // Profile Header
              SliverToBoxAdapter(
                child: Container(
                  padding: const EdgeInsets.all(24),
                  child: Column(
                    children: [
                      // Avatar
                      Container(
                        width: 100,
                        height: 100,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          border: Border.all(
                            color: Colors.white.withOpacity(0.3),
                            width: 3,
                          ),
                        ),
                        child: ClipOval(
                          child: user?.avatar != null
                              ? Image.network(
                                  '${const String.fromEnvironment('PUBLIC_URL')}/directorApp/avatars/${user!.avatar}',
                                  fit: BoxFit.cover,
                                  errorBuilder: (context, error, stackTrace) {
                                    return _buildAvatarFallback(user.name);
                                  },
                                )
                              : _buildAvatarFallback(user?.name ?? ''),
                        ),
                      ),
                      const SizedBox(height: 16),
                      
                      // User Info
                      Text(
                        user?.name ?? '',
                        style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        user?.email ?? '',
                        style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                          color: Colors.white.withOpacity(0.8),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              
              // Profile Options
              SliverToBoxAdapter(
                child: Container(
                  margin: const EdgeInsets.symmetric(horizontal: 24),
                  decoration: BoxDecoration(
                    color: Theme.of(context).cardColor,
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Column(
                    children: [
                      // Account Settings
                      _buildSectionHeader(context, context.t('accountSettings')),
                      _buildProfileOption(
                        context,
                        icon: Icons.person_outline,
                        title: context.t('personalInformation'),
                        onTap: () {
                          // Navigate to edit profile
                        },
                      ),
                      _buildProfileOption(
                        context,
                        icon: Icons.lock_outline,
                        title: context.t('changePassword'),
                        onTap: () {
                          // Navigate to change password
                        },
                      ),
                      _buildProfileOption(
                        context,
                        icon: Icons.notifications_outline,
                        title: context.t('notifications'),
                        onTap: () {
                          // Navigate to notifications settings
                        },
                      ),
                      
                      // App Preferences
                      _buildSectionHeader(context, context.t('appPreferences')),
                      _buildProfileOption(
                        context,
                        icon: Icons.language,
                        title: context.t('language'),
                        trailing: Text(
                          _getLanguageName(languageProvider.languageCode),
                          style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                            color: Colors.grey[600],
                          ),
                        ),
                        onTap: () {
                          _showLanguageDialog(context, languageProvider);
                        },
                      ),
                      _buildProfileOption(
                        context,
                        icon: Icons.palette_outlined,
                        title: context.t('theme'),
                        trailing: Text(
                          _getThemeName(context, themeProvider.themeMode),
                          style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                            color: Colors.grey[600],
                          ),
                        ),
                        onTap: () {
                          _showThemeDialog(context, themeProvider);
                        },
                      ),
                      
                      // Support
                      _buildSectionHeader(context, context.t('support')),
                      _buildProfileOption(
                        context,
                        icon: Icons.help_outline,
                        title: context.t('helpCenter'),
                        onTap: () {
                          // Navigate to help center
                        },
                      ),
                      _buildProfileOption(
                        context,
                        icon: Icons.contact_support_outlined,
                        title: context.t('contactSupport'),
                        onTap: () {
                          // Navigate to contact support
                        },
                      ),
                      
                      const SizedBox(height: 16),
                    ],
                  ),
                ),
              ),
              
              // Logout Button
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.all(24),
                  child: CustomButton(
                    onPressed: () => _showLogoutDialog(context, authProvider),
                    text: context.t('logout'),
                    icon: Icons.logout,
                    backgroundColor: Colors.red,
                  ),
                ),
              ),
              
              const SliverToBoxAdapter(
                child: SizedBox(height: 100), // Bottom padding
              ),
            ],
          );
        },
      ),
    );
  }

  Widget _buildAvatarFallback(String name) {
    return Container(
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          colors: [Color(0xFF6B7280), Color(0xFF9CA3AF)],
        ),
      ),
      child: Center(
        child: Text(
          name.isNotEmpty ? name[0].toUpperCase() : '?',
          style: const TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.bold,
            fontSize: 32,
          ),
        ),
      ),
    );
  }

  Widget _buildSectionHeader(BuildContext context, String title) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
      child: Text(
        title,
        style: Theme.of(context).textTheme.titleMedium?.copyWith(
          fontWeight: FontWeight.w600,
          color: Theme.of(context).primaryColor,
        ),
      ),
    );
  }

  Widget _buildProfileOption(
    BuildContext context, {
    required IconData icon,
    required String title,
    Widget? trailing,
    required VoidCallback onTap,
  }) {
    return ListTile(
      leading: Icon(
        icon,
        color: Theme.of(context).primaryColor,
      ),
      title: Text(title),
      trailing: trailing ?? const Icon(Icons.chevron_right),
      onTap: onTap,
    );
  }

  String _getLanguageName(String languageCode) {
    switch (languageCode) {
      case 'en':
        return 'English';
      case 'id':
        return 'Indonesian';
      case 'zh':
        return 'Chinese';
      default:
        return 'English';
    }
  }

  String _getThemeName(BuildContext context, ThemeMode themeMode) {
    switch (themeMode) {
      case ThemeMode.light:
        return context.t('light');
      case ThemeMode.dark:
        return context.t('dark');
      case ThemeMode.system:
        return context.t('system');
    }
  }

  void _showLanguageDialog(BuildContext context, LanguageProvider languageProvider) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(context.t('language')),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            _buildLanguageOption(context, languageProvider, 'en', 'English', '🇺🇸'),
            _buildLanguageOption(context, languageProvider, 'id', 'Indonesian', '🇮🇩'),
            _buildLanguageOption(context, languageProvider, 'zh', 'Chinese', '🇨🇳'),
          ],
        ),
      ),
    );
  }

  Widget _buildLanguageOption(
    BuildContext context,
    LanguageProvider languageProvider,
    String code,
    String name,
    String flag,
  ) {
    final isSelected = languageProvider.languageCode == code;
    
    return ListTile(
      leading: Text(flag, style: const TextStyle(fontSize: 24)),
      title: Text(name),
      trailing: isSelected ? const Icon(Icons.check, color: Colors.green) : null,
      onTap: () {
        languageProvider.setLanguage(code);
        Navigator.of(context).pop();
      },
    );
  }

  void _showThemeDialog(BuildContext context, ThemeProvider themeProvider) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(context.t('theme')),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            _buildThemeOption(context, themeProvider, ThemeMode.light, context.t('light'), Icons.light_mode),
            _buildThemeOption(context, themeProvider, ThemeMode.dark, context.t('dark'), Icons.dark_mode),
            _buildThemeOption(context, themeProvider, ThemeMode.system, context.t('system'), Icons.settings_system_daydream),
          ],
        ),
      ),
    );
  }

  Widget _buildThemeOption(
    BuildContext context,
    ThemeProvider themeProvider,
    ThemeMode mode,
    String name,
    IconData icon,
  ) {
    final isSelected = themeProvider.themeMode == mode;
    
    return ListTile(
      leading: Icon(icon),
      title: Text(name),
      trailing: isSelected ? const Icon(Icons.check, color: Colors.green) : null,
      onTap: () {
        themeProvider.setThemeMode(mode);
        Navigator.of(context).pop();
      },
    );
  }

  void _showLogoutDialog(BuildContext context, AuthProvider authProvider) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(context.t('confirmLogout')),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: Text(context.t('cancel')),
          ),
          TextButton(
            onPressed: () {
              Navigator.of(context).pop();
              authProvider.logout();
            },
            child: Text(
              context.t('logout'),
              style: const TextStyle(color: Colors.red),
            ),
          ),
        ],
      ),
    );
  }
}