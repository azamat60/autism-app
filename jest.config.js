module.exports = {
  preset: 'react-native',
  setupFiles: ['<rootDir>/jest/setup.ts'],
  moduleNameMapper: {
    '^react-native-config$': '<rootDir>/jest/mocks/react-native-config.ts',
  },
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native|@react-navigation|react-native-safe-area-context)/)',
  ],
};
