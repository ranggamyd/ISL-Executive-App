import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_staggered_animations/flutter_staggered_animations.dart';

import '../../../core/providers/auth_provider.dart';
import '../../../core/localization/app_localizations.dart';
import '../../../shared/widgets/menu_grid.dart';
import '../../../shared/widgets/search_bar_widget.dart';
import '../../../shared/widgets/animated_greeting.dart';

class DashboardPage extends StatefulWidget {
  const DashboardPage({super.key});

  @override
  State<DashboardPage> createState() => _DashboardPageState();
}

class _DashboardPageState extends State<DashboardPage> {
  final TextEditingController _searchController = TextEditingController();
  String _searchQuery = '';

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Consumer<AuthProvider>(
        builder: (context, authProvider, child) {
          final user = authProvider.user;
          final menus = authProvider.menus ?? [];
          
          // Filter menus based on search
          final filteredMenus = _searchQuery.isEmpty
              ? menus
              : menus.where((menu) {
                  final menuName = context.t(menu.name).toLowerCase();
                  return menuName.contains(_searchQuery.toLowerCase());
                }).toList();

          return CustomScrollView(
            slivers: [
              // Greeting Section
              SliverToBoxAdapter(
                child: Container(
                  padding: const EdgeInsets.all(24),
                  child: AnimationLimiter(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: AnimationConfiguration.toStaggeredList(
                        duration: const Duration(milliseconds: 375),
                        childAnimationBuilder: (widget) => SlideAnimation(
                          horizontalOffset: 50.0,
                          child: FadeInAnimation(child: widget),
                        ),
                        children: [
                          AnimatedGreeting(userName: user?.name ?? ''),
                          const SizedBox(height: 24),
                          SearchBarWidget(
                            controller: _searchController,
                            onChanged: (value) {
                              setState(() {
                                _searchQuery = value;
                              });
                            },
                            hintText: context.t('search'),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
              
              // Menu Grid
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 24),
                  child: MenuGrid(
                    menus: filteredMenus,
                    onMenuTap: (menu) {
                      // Handle menu navigation
                      // This will be implemented based on the menu path
                    },
                  ),
                ),
              ),
              
              // Quick Stats or Recent Activities could go here
              const SliverToBoxAdapter(
                child: SizedBox(height: 100), // Bottom padding for navigation
              ),
            ],
          );
        },
      ),
    );
  }
}