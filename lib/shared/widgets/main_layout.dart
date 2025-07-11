import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';

import '../../core/providers/auth_provider.dart';
import '../../core/providers/theme_provider.dart';
import '../../core/localization/app_localizations.dart';
import 'gradient_background.dart';

class MainLayout extends StatefulWidget {
  final Widget child;

  const MainLayout({
    super.key,
    required this.child,
  });

  @override
  State<MainLayout> createState() => _MainLayoutState();
}

class _MainLayoutState extends State<MainLayout> {
  int _currentIndex = 0;

  final List<BottomNavigationBarItem> _bottomNavItems = [
    const BottomNavigationBarItem(
      icon: Icon(Icons.home_outlined),
      activeIcon: Icon(Icons.home),
      label: 'Home',
    ),
    const BottomNavigationBarItem(
      icon: Icon(Icons.people_outline),
      activeIcon: Icon(Icons.people),
      label: 'Recruitment',
    ),
    const BottomNavigationBarItem(
      icon: Icon(Icons.trending_up_outlined),
      activeIcon: Icon(Icons.trending_up),
      label: 'Sales',
    ),
    const BottomNavigationBarItem(
      icon: Icon(Icons.badge_outlined),
      activeIcon: Icon(Icons.badge),
      label: 'Employees',
    ),
    const BottomNavigationBarItem(
      icon: Icon(Icons.person_outline),
      activeIcon: Icon(Icons.person),
      label: 'Profile',
    ),
  ];

  void _onBottomNavTap(int index) {
    setState(() {
      _currentIndex = index;
    });

    switch (index) {
      case 0:
        context.go('/');
        break;
      case 1:
        context.go('/recruitment/candidates');
        break;
      case 2:
        context.go('/sales/daily-quotes');
        break;
      case 3:
        context.go('/employees/list');
        break;
      case 4:
        context.go('/profile');
        break;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          // Gradient Background
          const GradientBackground(),
          
          // Main Content
          SafeArea(
            child: Column(
              children: [
                // Header
                _buildHeader(context),
                
                // Content
                Expanded(
                  child: widget.child,
                ),
              ],
            ),
          ),
        ],
      ),
      bottomNavigationBar: Consumer<ThemeProvider>(
        builder: (context, themeProvider, child) {
          return Container(
            decoration: BoxDecoration(
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.1),
                  blurRadius: 10,
                  offset: const Offset(0, -5),
                ),
              ],
            ),
            child: ClipRRect(
              borderRadius: const BorderRadius.only(
                topLeft: Radius.circular(20),
                topRight: Radius.circular(20),
              ),
              child: BottomNavigationBar(
                currentIndex: _currentIndex,
                onTap: _onBottomNavTap,
                type: BottomNavigationBarType.fixed,
                items: _bottomNavItems.map((item) {
                  final index = _bottomNavItems.indexOf(item);
                  return BottomNavigationBarItem(
                    icon: item.icon,
                    activeIcon: item.activeIcon,
                    label: context.t(_getBottomNavLabel(index)),
                  );
                }).toList(),
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildHeader(BuildContext context) {
    return Consumer2<AuthProvider, ThemeProvider>(
      builder: (context, authProvider, themeProvider, child) {
        final user = authProvider.user;
        
        return Container(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
          child: Row(
            children: [
              // Logo
              Image.asset(
                themeProvider.isDarkMode 
                    ? 'assets/images/dark-logo.png'
                    : 'assets/images/light-logo.png',
                height: 32,
              ),
              const Spacer(),
              
              // User Avatar
              GestureDetector(
                onTap: () => context.go('/profile'),
                child: Container(
                  width: 40,
                  height: 40,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    border: Border.all(
                      color: Colors.white.withOpacity(0.3),
                      width: 2,
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
              ),
            ],
          ),
        );
      },
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
            fontSize: 16,
          ),
        ),
      ),
    );
  }

  String _getBottomNavLabel(int index) {
    switch (index) {
      case 0:
        return 'home';
      case 1:
        return 'recruitment';
      case 2:
        return 'sales';
      case 3:
        return 'employee';
      case 4:
        return 'profile';
      default:
        return '';
    }
  }
}