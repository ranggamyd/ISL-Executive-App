import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../core/localization/app_localizations.dart';
import '../widgets/custom_button.dart';

class ForbiddenPage extends StatelessWidget {
  const ForbiddenPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              // Illustration
              Icon(
                Icons.block,
                size: 120,
                color: Colors.red[400],
              ),
              const SizedBox(height: 24),
              
              // Title
              Text(
                context.t('forbidden'),
                style: Theme.of(context).textTheme.displaySmall?.copyWith(
                  fontWeight: FontWeight.bold,
                  color: Colors.red[600],
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 16),
              
              // Description
              Text(
                context.t('forbiddenDesc'),
                style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                  color: Colors.grey[600],
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 32),
              
              // Back to Home Button
              CustomButton(
                onPressed: () => context.go('/'),
                text: context.t('backToHome'),
                icon: Icons.home,
              ),
            ],
          ),
        ),
      ),
    );
  }
}