import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { HomeScreen } from '../src/screens/HomeScreen';

describe('HomeScreen', () => {
  it('renders activity title and cards', () => {
    const navigation = { navigate: jest.fn() } as any;

    render(
      <HomeScreen
        navigation={navigation}
        route={{ key: 'Home', name: 'Home' } as any}
      />,
    );

    expect(screen.getByText('Choose an Activity')).toBeTruthy();
    expect(screen.getByLabelText('Match the Colors')).toBeTruthy();
    expect(screen.getByLabelText('Sort the Shapes')).toBeTruthy();
    expect(screen.getByLabelText('Find the Emotion')).toBeTruthy();
    expect(screen.getByLabelText('Tap & React')).toBeTruthy();
  });
});
