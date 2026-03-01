# Calm Learning MVP (React Native)

Sensory-friendly educational prototype for children with ASD/ADHD (ages 2-6).

This app focuses on predictable interaction, calm visuals, and simple cognitive activities.

## MVP goals

- Structured React Native CLI + TypeScript baseline
- Minimal and accessible UI
- 4 simple educational mini-games
- Calm sensory design (pastel palette, no flashing, gentle feedback)

## Activities

1. Match the Colors
2. Sort the Shapes
3. Find the Emotion
4. Tap & React

## Tech stack

- React Native CLI (`0.84.x`)
- TypeScript
- React Navigation (native stack)
- `react-native-svg` for placeholder icons
- `react-native-sound` for soft tap feedback in Tap & React
- ESLint + Prettier
- Jest + React Native Testing Library

## Project structure

```text
src/
  app/
  navigation/
  screens/
  features/
  components/
  shared/
  theme/
  assets/
```

## Prerequisites

- Node.js `>=22.11.0`
- npm
- Xcode + CocoaPods (iOS)
- Android Studio SDK + emulator/device (Android)
- Java 17

## Install

```bash
npm install
cp .env.example .env
```

## iOS setup

```bash
cd ios
bundle install
bundle exec pod install
cd ..
```

## Run

Start Metro:

```bash
npm start
```

Run iOS:

```bash
npm run ios
```

Run Android:

```bash
npm run android
```

## Quality checks

```bash
npm run lint
npm run typecheck
npm test
npm run format:check
```

## Sensory-friendly constraints used

- Soft off-white background + pastel palette
- No flashing or intense motion
- Large touch targets (`>=60`)
- Simple language and short instructions
- Gentle feedback animations (`~150-250ms`)
- Predictable navigation and transitions

## Notes

- This is an MVP prototype for product validation and UX testing.
- No backend, auth, or remote storage is included.
