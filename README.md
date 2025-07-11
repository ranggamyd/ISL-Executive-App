# ISL Executive App - Flutter Version

A comprehensive executive management application for PT Inti Surya Laboratorium, converted from React/TypeScript to Flutter.

## Features

### 🔐 Authentication
- Secure login with email/username and password
- JWT token-based authentication
- Automatic token refresh
- Secure storage using Flutter Secure Storage

### 📱 Dashboard
- Dynamic greeting based on time of day
- Animated typewriter effect for welcome messages
- Menu grid with search functionality
- Quick access to all features

### 👥 Recruitment Management
- Candidate listing and management
- Salary offer management
- Interview tracking
- Document management

### 💰 Sales Management
- Daily quotes tracking
- Point of sales analytics
- Sales reports and insights
- Revenue tracking

### 👨‍💼 Employee Management
- Employee directory
- Access door controls
- GPS vehicle tracking
- Employee profiles and details

### ⚙️ Settings & Preferences
- Multi-language support (English, Indonesian, Chinese)
- Theme switching (Light, Dark, System)
- Profile management
- Secure logout

## Architecture

### 🏗️ Project Structure
```
lib/
├── core/                   # Core functionality
│   ├── app.dart           # Main app configuration
│   ├── models/            # Data models
│   ├── providers/         # State management
│   ├── router/            # Navigation routing
│   ├── services/          # API and storage services
│   ├── theme/             # App theming
│   └── localization/      # Internationalization
├── features/              # Feature modules
│   ├── auth/              # Authentication
│   ├── dashboard/         # Dashboard
│   ├── profile/           # User profile
│   ├── recruitment/       # Recruitment management
│   ├── sales/             # Sales management
│   └── employees/         # Employee management
└── shared/                # Shared components
    ├── widgets/           # Reusable widgets
    └── pages/             # Common pages
```

### 🔧 State Management
- **Provider**: For state management across the app
- **SharedPreferences**: For simple key-value storage
- **Flutter Secure Storage**: For sensitive data like tokens

### 🌐 API Integration
- **Dio**: HTTP client for API calls
- **Interceptors**: For request/response handling
- **Error handling**: Comprehensive error management
- **Token management**: Automatic token injection

### 🎨 UI/UX
- **Material Design 3**: Modern Material Design components
- **Custom themes**: Light and dark theme support
- **Animations**: Smooth transitions and micro-interactions
- **Responsive design**: Optimized for different screen sizes

## Getting Started

### Prerequisites
- Flutter SDK (>=3.10.0)
- Dart SDK (>=3.0.0)
- Android Studio / VS Code
- iOS development tools (for iOS deployment)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd isl_executive_app
   ```

2. **Install dependencies**
   ```bash
   flutter pub get
   ```

3. **Configure environment**
   Create a `.env` file in the root directory:
   ```env
   API_URL=https://your-api-url.com
   PUBLIC_URL=https://your-public-assets-url.com
   ```

4. **Run the app**
   ```bash
   flutter run
   ```

### Building for Production

#### Android
```bash
flutter build apk --release
# or for app bundle
flutter build appbundle --release
```

#### iOS
```bash
flutter build ios --release
```

## Key Features Implementation

### 🔐 Authentication Flow
- Secure login with credential validation
- Token-based session management
- Automatic logout on token expiration
- Biometric authentication support (future enhancement)

### 📊 Dashboard Analytics
- Real-time data visualization
- Interactive charts and graphs
- Quick action buttons
- Recent activity feeds

### 🌍 Internationalization
- Support for 3 languages (EN, ID, ZH)
- Dynamic language switching
- Localized date/time formats
- RTL support ready

### 🎨 Theming System
- Material Design 3 implementation
- Dynamic color schemes
- Dark/Light mode switching
- Custom component theming

### 📱 Responsive Design
- Adaptive layouts for different screen sizes
- Tablet-optimized interfaces
- Landscape mode support
- Accessibility features

## API Integration

### Base Configuration
```dart
// API Service configuration
final apiService = ApiService();
apiService.setBaseUrl('https://your-api.com');
apiService.setToken(userToken);
```

### Authentication Endpoints
- `POST /login` - User authentication
- `POST /logout` - User logout
- `GET /profile/me` - Get user profile
- `POST /profile/update` - Update user profile

### Data Endpoints
- `GET /recruitment/candidates` - Get candidates
- `GET /sales/daily-quotes` - Get daily quotes
- `GET /employees/list` - Get employees
- `GET /dashboard/stats` - Get dashboard statistics

## Security Features

### 🔒 Data Protection
- Encrypted local storage
- Secure API communication
- Token-based authentication
- Input validation and sanitization

### 🛡️ Privacy
- No sensitive data logging
- Secure credential storage
- GDPR compliance ready
- Data encryption at rest

## Performance Optimizations

### 📈 App Performance
- Lazy loading of screens
- Image caching and optimization
- Efficient state management
- Memory leak prevention

### 🚀 Network Optimization
- Request/response caching
- Retry mechanisms
- Offline support (future enhancement)
- Compression and optimization

## Testing

### Unit Tests
```bash
flutter test
```

### Integration Tests
```bash
flutter test integration_test/
```

### Widget Tests
```bash
flutter test test/widget_test.dart
```

## Deployment

### Android Play Store
1. Configure signing keys
2. Build release APK/AAB
3. Upload to Play Console
4. Configure store listing

### iOS App Store
1. Configure provisioning profiles
2. Build release IPA
3. Upload via Xcode or Transporter
4. Submit for review

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is proprietary software owned by PT Inti Surya Laboratorium.

## Support

For technical support or questions, please contact the development team.

---

**Built with ❤️ using Flutter**