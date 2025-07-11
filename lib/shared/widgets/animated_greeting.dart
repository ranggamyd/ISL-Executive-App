import 'package:flutter/material.dart';
import 'package:flutter_staggered_animations/flutter_staggered_animations.dart';

import '../../core/localization/app_localizations.dart';

class AnimatedGreeting extends StatefulWidget {
  final String userName;

  const AnimatedGreeting({
    super.key,
    required this.userName,
  });

  @override
  State<AnimatedGreeting> createState() => _AnimatedGreetingState();
}

class _AnimatedGreetingState extends State<AnimatedGreeting>
    with TickerProviderStateMixin {
  late AnimationController _typewriterController;
  late Animation<int> _typewriterAnimation;
  
  int _currentTextIndex = 0;
  List<String> _texts = [];

  @override
  void initState() {
    super.initState();
    _setupTexts();
    _setupAnimations();
    _startTypewriterAnimation();
  }

  void _setupTexts() {
    final greeting = _getGreeting();
    _texts = [
      '$greeting, ${widget.userName}!',
      context.t('welcomeMessage'),
    ];
  }

  void _setupAnimations() {
    _typewriterController = AnimationController(
      duration: const Duration(milliseconds: 2000),
      vsync: this,
    );

    _typewriterAnimation = IntTween(
      begin: 0,
      end: _texts[_currentTextIndex].length,
    ).animate(CurvedAnimation(
      parent: _typewriterController,
      curve: Curves.easeInOut,
    ));
  }

  void _startTypewriterAnimation() {
    _typewriterController.forward().then((_) {
      Future.delayed(const Duration(milliseconds: 3000), () {
        if (mounted) {
          setState(() {
            _currentTextIndex = (_currentTextIndex + 1) % _texts.length;
          });
          _typewriterController.reset();
          _typewriterAnimation = IntTween(
            begin: 0,
            end: _texts[_currentTextIndex].length,
          ).animate(CurvedAnimation(
            parent: _typewriterController,
            curve: Curves.easeInOut,
          ));
          _startTypewriterAnimation();
        }
      });
    });
  }

  String _getGreeting() {
    final hour = DateTime.now().hour;
    if (hour >= 5 && hour < 11) {
      return context.t('greeting_morning');
    } else if (hour >= 11 && hour < 15) {
      return context.t('greeting_afternoon');
    } else if (hour >= 15 && hour < 18) {
      return context.t('greeting_evening');
    } else {
      return context.t('greeting_night');
    }
  }

  @override
  void dispose() {
    _typewriterController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimationLimiter(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: AnimationConfiguration.toStaggeredList(
          duration: const Duration(milliseconds: 375),
          childAnimationBuilder: (widget) => SlideAnimation(
            horizontalOffset: 50.0,
            child: FadeInAnimation(child: widget),
          ),
          children: [
            Text(
              _getGreeting(),
              style: Theme.of(context).textTheme.displaySmall?.copyWith(
                color: Colors.white,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            SizedBox(
              height: 24,
              child: AnimatedBuilder(
                animation: _typewriterAnimation,
                builder: (context, child) {
                  final currentText = _texts[_currentTextIndex];
                  final displayText = currentText.substring(
                    0,
                    _typewriterAnimation.value.clamp(0, currentText.length),
                  );
                  
                  return Text(
                    displayText,
                    style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                      color: Colors.white.withOpacity(0.8),
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}