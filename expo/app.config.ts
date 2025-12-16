import { ConfigContext, ExpoConfig } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
    ...config,
    name: 'WarikeApp', // The name of your app as it appears on the home screen
    slug: 'warikeapp', // The URL slug for your app's Expo project page
    version: '1.0.0', // The version of your app
    orientation: 'portrait', // Lock the app to portrait mode
    scheme: 'warikeapp', // The URL scheme for linking into your app
    userInterfaceStyle: 'automatic', // Follow system light/dark mode settings
    newArchEnabled: true, // Enable the New Architecture (Fabric/TurboModules)

    // Patterns to match files to bundle with the app binary
    assetBundlePatterns: [
        'assets/**/*'
    ],

    // Expo plugins configuration
    plugins: [
        [
            'expo-router',
            {
                origin: 'https://app.fullstack.company' // The exact origin of the dev server
            }
        ],
        'expo-secure-store', // Provides a way to encrypt and securely store key–value pairs
        [
            'expo-build-properties', // Configure native build properties
            {
                ios: {
                    deploymentTarget: '15.1', // Minimum iOS version
                },
                android: {
                    kotlinVersion: '1.6.21' // Kotlin version for Android build
                }
            }
        ],
        [
            'expo-splash-screen', // Control the splash screen visibility
            {
                "backgroundColor": "#FFFFFF",
                "image": "./assets/splash-icon.png",
                "imageWidth": 200,
                "resizeMode": 'contain',
            }
        ],
        [
            'expo-media-library', // Access to the media library
            {
                photosPermission: 'Allow $(PRODUCT_NAME) to access your photos.',
                savePhotosPermission: 'Allow $(PRODUCT_NAME) to save photos.',
                isAccessMediaLocationEnabled: true
            }
        ],
        'expo-sqlite', // SQLite database access
        'expo-font' // Load custom fonts
    ],

    // Experimental features
    experiments: {
        typedRoutes: true, // Generate TypeScript types for routes
        reactCompiler: true // Enable React Compiler (React Forget)
    },

    // iOS specific configuration
    ios: {
        supportsTablet: true,
        bundleIdentifier: 'com.wariketech.warikeapp', // Unique ID for the app store
        infoPlist: {
            ITSAppUsesNonExemptEncryption: false, // Skip encryption compliance docs on App Store Connect
            NSAppTransportSecurity: {
                NSAllowsArbitraryLoads: true, // Allow HTTP connections for development
                NSAllowsLocalNetworking: true, // Allow local network connections
                NSExceptionDomains: {
                    localhost: {
                        NSExceptionAllowsInsecureHTTPLoads: true,
                    },
                    // Allow ngrok tunnel domains
                    'ngrok.io': {
                        NSExceptionAllowsInsecureHTTPLoads: true,
                        NSIncludesSubdomains: true,
                    },
                    'ngrok-free.app': {
                        NSExceptionAllowsInsecureHTTPLoads: true,
                        NSIncludesSubdomains: true,
                    },
                    // Allow cloudflare tunnel domains
                    'trycloudflare.com': {
                        NSExceptionAllowsInsecureHTTPLoads: true,
                        NSIncludesSubdomains: true,
                    },
                    // Allow loca.lt tunnel domains
                    'loca.lt': {
                        NSExceptionAllowsInsecureHTTPLoads: true,
                        NSIncludesSubdomains: true,
                    },
                    // Allow Expo tunnel domains
                    'exp.direct': {
                        NSExceptionAllowsInsecureHTTPLoads: true,
                        NSIncludesSubdomains: true,
                    },
                },
            },
        }
    },

    // Android specific configuration
    android: {
        adaptiveIcon: {
            foregroundImage: './assets/adaptive-icon.png',
            backgroundColor: '#FFFFFF'
        },
        edgeToEdgeEnabled: true, // Enable edge-to-edge display
        predictiveBackGestureEnabled: false,
        package: 'com.wariketech.warikeapp', // Unique ID for the Play Store
        permissions: [
            'android.permission.READ_EXTERNAL_STORAGE',
            'android.permission.WRITE_EXTERNAL_STORAGE',
            'android.permission.READ_MEDIA_VISUAL_USER_SELECTED',
            'android.permission.ACCESS_MEDIA_LOCATION',
            'android.permission.READ_MEDIA_IMAGES',
            'android.permission.READ_MEDIA_VIDEO',
            'android.permission.READ_MEDIA_AUDIO'
        ]
    },

    // Web specific configuration
    web: {
        favicon: './assets/favicon.png',
        output: 'server', // Server-side rendering output
        bundler: 'metro'
    },

    // Update configuration
    runtimeVersion: {
        policy: 'appVersion' // Runtime version matches app version
    },

    // Extra configuration exposed via Constants.manifest.extra
    extra: {
        router: {},
        eas: {
            projectId: 'd7a159b5-4244-4b6a-8396-920a5a4f860d'
        }
    },

    owner: 'sergioestebance', // Expo account owner

    // Splash screen configuration (deprecated in favor of plugin but still used by some tools)
    splash: {
        image: "./assets/splash-icon.png",
        resizeMode: 'contain',
        backgroundColor: '#ffffff'
    },

    icon: './assets/icon.png', // App icon
});