import 'package:flutter/material.dart';
import 'package:flutter_staggered_animations/flutter_staggered_animations.dart';

import '../../core/models/menu.dart';
import '../../core/localization/app_localizations.dart';
import 'menu_item_card.dart';

class MenuGrid extends StatelessWidget {
  final List<Menu> menus;
  final void Function(Menu) onMenuTap;

  const MenuGrid({
    super.key,
    required this.menus,
    required this.onMenuTap,
  });

  @override
  Widget build(BuildContext context) {
    // Limit to show first 8 menus + "All Menus" button
    final limitedMenus = menus.take(8).toList();
    final showAllButton = menus.length > 8;

    return AnimationLimiter(
      child: GridView.builder(
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 4,
          crossAxisSpacing: 16,
          mainAxisSpacing: 16,
          childAspectRatio: 0.8,
        ),
        itemCount: showAllButton ? limitedMenus.length + 1 : limitedMenus.length,
        itemBuilder: (context, index) {
          return AnimationConfiguration.staggeredGrid(
            position: index,
            duration: const Duration(milliseconds: 375),
            columnCount: 4,
            child: ScaleAnimation(
              child: FadeInAnimation(
                child: index < limitedMenus.length
                    ? MenuItemCard(
                        menu: limitedMenus[index],
                        onTap: () => onMenuTap(limitedMenus[index]),
                      )
                    : _buildAllMenusButton(context),
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildAllMenusButton(BuildContext context) {
    return GestureDetector(
      onTap: () {
        // Show all menus dialog or navigate to all menus page
        _showAllMenusDialog(context);
      },
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
                color: const Color(0xFFF3F4F6),
                borderRadius: BorderRadius.circular(8),
              ),
              child: const Icon(
                Icons.grid_view,
                color: Color(0xFF6B7280),
                size: 20,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              context.t('allMenus'),
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

  void _showAllMenusDialog(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => Container(
        height: MediaQuery.of(context).size.height * 0.8,
        decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.only(
            topLeft: Radius.circular(20),
            topRight: Radius.circular(20),
          ),
        ),
        child: Column(
          children: [
            // Handle
            Container(
              width: 40,
              height: 4,
              margin: const EdgeInsets.symmetric(vertical: 12),
              decoration: BoxDecoration(
                color: Colors.grey[300],
                borderRadius: BorderRadius.circular(2),
              ),
            ),
            
            // Header
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Row(
                children: [
                  Text(
                    context.t('allMenus'),
                    style: Theme.of(context).textTheme.headlineSmall,
                  ),
                  const Spacer(),
                  IconButton(
                    onPressed: () => Navigator.of(context).pop(),
                    icon: const Icon(Icons.close),
                  ),
                ],
              ),
            ),
            
            // Menu Grid
            Expanded(
              child: Padding(
                padding: const EdgeInsets.all(20),
                child: GridView.builder(
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 3,
                    crossAxisSpacing: 16,
                    mainAxisSpacing: 16,
                    childAspectRatio: 0.8,
                  ),
                  itemCount: menus.length,
                  itemBuilder: (context, index) {
                    return MenuItemCard(
                      menu: menus[index],
                      onTap: () {
                        Navigator.of(context).pop();
                        onMenuTap(menus[index]);
                      },
                    );
                  },
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}