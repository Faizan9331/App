# React Native Gallery & Auth Mobile Application

A complete, production-ready React Native application built with **TypeScript**, **Zustand**, **React Navigation**, and **Expo**.

---

## 1. Project Architecture

```text
├── App.tsx                    # Root entry mounting Safe Area & Navigation
├── app.json                   # Expo / Android app metadata & native permissions
├── eas.json                   # Cloud APK build profiles (EAS Build)
├── package.json               # Dependencies and build scripts
├── tsconfig.json              # TypeScript strict configuration
└── src/
    ├── components/            # Reusable UI elements (CustomButton, CustomInput)
    ├── hooks/                 # Custom hooks (useDebounce)
    ├── navigation/            # Auth and Tab Navigation flows
    ├── screens/               # Login, Register, Home, Favorites, Detail, Profile
    ├── store/                 # Zustand stores with AsyncStorage persistence
    └── types/                 # Shared data models & TypeScript definitions
```

---

## 2. Setup & Local Execution

1. **Extract and enter project**:
   ```bash
   unzip react_native_intern_assignment_project.zip
   cd react_native_intern_assignment_project
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npx expo start
   ```
   - Press **`a`** to open in Android Emulator.
   - Scan the terminal QR code with the **Expo Go** mobile app.

---

## 3. How to Generate the APK File

An `.apk` file is a compiled Android binary requiring Android SDK tools (Gradle/JDK) or cloud compilers. You can generate it using either method below:

### Method A: Cloud Build via EAS (No Android Studio required - Recommended)
1. Install EAS CLI globally:
   ```bash
   npm install -g eas-cli
   ```
2. Log in or create an account at [expo.dev](https://expo.dev):
   ```bash
   eas login
   ```
3. Initialize and trigger the APK build:
   ```bash
   eas build:configure
   eas build -p android --profile preview
   ```
4. EAS will compile the Android build in the cloud and return a direct download link for the standalone `.apk` file.

### Method B: Local Build via Gradle (Requires Android Studio & JDK)
1. Prebuild the native Android project folder:
   ```bash
   npx expo prebuild
   ```
2. Navigate to the `android/` directory and compile release APK:
   ```bash
   cd android
   ./gradlew assembleRelease
   ```
3. The generated APK will be located at:
   `android/app/build/outputs/apk/release/app-release.apk`
