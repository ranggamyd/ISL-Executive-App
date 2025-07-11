import 'package:flutter/material.dart';

import '../../core/models/menu.dart';
import '../../core/localization/app_localizations.dart';

class MenuItemCard extends StatelessWidget {
  final Menu menu;
  final VoidCallback onTap;

  const MenuItemCard({
    super.key,
    required this.menu,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final themeColors = _getThemeColors(menu.theme);
    
    return GestureDetector(
      onTap: onTap,
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white.withOpacity(0.9),
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.1),
              blurRadius: 10,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                color: themeColors['background'],
                borderRadius: BorderRadius.circular(8),
                border: Border.all(
                  color: themeColors['border']!,
                  width: 1,
                ),
              ),
              child: Icon(
                _getIconData(menu.icon),
                color: themeColors['icon'],
                size: 20,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              context.t(menu.name),
              style: Theme.of(context).textTheme.bodySmall?.copyWith(
                fontWeight: FontWeight.w600,
                color: const Color(0xFF374151),
              ),
              textAlign: TextAlign.center,
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
          ],
        ),
      ),
    );
  }

  Map<String, Color> _getThemeColors(String theme) {
    switch (theme) {
      case 'blue':
        return {
          'background': const Color(0xFFDBEAFE),
          'border': const Color(0xFFBFDBFE),
          'icon': const Color(0xFF2563EB),
        };
      case 'red':
        return {
          'background': const Color(0xFFFEE2E2),
          'border': const Color(0xFFFECACA),
          'icon': const Color(0xFFDC2626),
        };
      case 'green':
        return {
          'background': const Color(0xFFDCFCE7),
          'border': const Color(0xFFBBF7D0),
          'icon': const Color(0xFF16A34A),
        };
      case 'purple':
        return {
          'background': const Color(0xFFF3E8FF),
          'border': const Color(0xFFE9D5FF),
          'icon': const Color(0xFF9333EA),
        };
      case 'yellow':
        return {
          'background': const Color(0xFFFEF3C7),
          'border': const Color(0xFFFDE68A),
          'icon': const Color(0xFFD97706),
        };
      case 'orange':
        return {
          'background': const Color(0xFFFED7AA),
          'border': const Color(0xFFFDBA74),
          'icon': const Color(0xFFEA580C),
        };
      default:
        return {
          'background': const Color(0xFFF3F4F6),
          'border': const Color(0xFFE5E7EB),
          'icon': const Color(0xFF6B7280),
        };
    }
  }

  IconData _getIconData(String iconName) {
    // Map icon names to Flutter icons
    switch (iconName.toLowerCase()) {
      case 'home':
        return Icons.home;
      case 'users':
      case 'people':
        return Icons.people;
      case 'trending_up':
      case 'trendingup':
        return Icons.trending_up;
      case 'badge':
        return Icons.badge;
      case 'user':
      case 'person':
        return Icons.person;
      case 'briefcase':
        return Icons.work;
      case 'chart':
      case 'barchart':
        return Icons.bar_chart;
      case 'calendar':
        return Icons.calendar_today;
      case 'settings':
        return Icons.settings;
      case 'door':
        return Icons.door_front_door;
      case 'map':
      case 'gps':
        return Icons.map;
      case 'money':
      case 'dollar':
        return Icons.attach_money;
      default:
        return Icons.apps;
    }
  }
}