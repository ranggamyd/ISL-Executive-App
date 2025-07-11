import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../providers/auth_provider.dart';
import '../../features/auth/pages/login_page.dart';
import '../../features/dashboard/pages/dashboard_page.dart';
import '../../features/profile/pages/profile_page.dart';
import '../../features/recruitment/pages/candidates_page.dart';
import '../../features/recruitment/pages/salary_offers_page.dart';
import '../../features/sales/pages/daily_quotes_page.dart';
import '../../features/sales/pages/point_of_sales_page.dart';
import '../../features/sales/pages/sales_ins_page.dart';
import '../../features/employees/pages/employees_page.dart';
import '../../features/employees/pages/access_doors_page.dart';
import '../../features/employees/pages/gps_view_page.dart';
import '../../shared/widgets/main_layout.dart';
import '../../shared/pages/not_found_page.dart';
import '../../shared/pages/forbidden_page.dart';

class AppRouter {
  static GoRouter createRouter(AuthProvider authProvider) {
    return GoRouter(
      initialLocation: '/',
      redirect: (context, state) {
        final isAuthenticated = authProvider.isAuthenticated;
        final isLoading = authProvider.isLoading;
        
        // Show loading screen while checking auth
        if (isLoading) return null;
        
        final isLoginRoute = state.matchedLocation == '/login';
        
        // Redirect to login if not authenticated and not already on login page
        if (!isAuthenticated && !isLoginRoute) {
          return '/login';
        }
        
        // Redirect to dashboard if authenticated and on login page
        if (isAuthenticated && isLoginRoute) {
          return '/';
        }
        
        return null;
      },
      routes: [
        // Auth routes
        GoRoute(
          path: '/login',
          builder: (context, state) => const LoginPage(),
        ),
        
        // Main app routes with layout
        ShellRoute(
          builder: (context, state, child) => MainLayout(child: child),
          routes: [
            GoRoute(
              path: '/',
              builder: (context, state) => const DashboardPage(),
            ),
            GoRoute(
              path: '/dashboard',
              builder: (context, state) => const DashboardPage(),
            ),
            GoRoute(
              path: '/profile',
              builder: (context, state) => const ProfilePage(),
            ),
            
            // Recruitment routes
            GoRoute(
              path: '/recruitment/candidates',
              builder: (context, state) => const CandidatesPage(),
            ),
            GoRoute(
              path: '/recruitment/salary-offers',
              builder: (context, state) => const SalaryOffersPage(),
            ),
            
            // Sales routes
            GoRoute(
              path: '/sales/daily-quotes',
              builder: (context, state) => const DailyQuotesPage(),
            ),
            GoRoute(
              path: '/sales/point-of-sales',
              builder: (context, state) => const PointOfSalesPage(),
            ),
            GoRoute(
              path: '/sales/sales-ins',
              builder: (context, state) => const SalesInsPage(),
            ),
            
            // Employee routes
            GoRoute(
              path: '/employees/list',
              builder: (context, state) => const EmployeesPage(),
            ),
            GoRoute(
              path: '/employees/access-doors',
              builder: (context, state) => const AccessDoorsPage(),
            ),
            GoRoute(
              path: '/employees/gps-view',
              builder: (context, state) => const GpsViewPage(),
            ),
            
            // Error routes
            GoRoute(
              path: '/forbidden',
              builder: (context, state) => const ForbiddenPage(),
            ),
          ],
        ),
      ],
      errorBuilder: (context, state) => const NotFoundPage(),
    );
  }
}