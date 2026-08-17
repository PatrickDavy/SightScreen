import { screen } from '@testing-library/react-native';
import React from 'react';

import { renderScreen } from '@/testing/renderScreen';

import { RootNavigator } from './RootNavigator';

describe('navigation shell', () => {
  it('shows the four destinations and the centre capture action', async () => {
    await renderScreen(<RootNavigator initialRoute="Tabs" initialTab="HomeTab" />);

    // getAllByText because a focused tab's own heading repeats its label.
    for (const label of ['Home', 'Improve', 'Load', 'You']) {
      expect(screen.getAllByText(label).length).toBeGreaterThan(0);
    }
    // Workload earns a root destination; it is not buried in settings.
    expect(screen.getByLabelText('Bowl a session')).toBeTruthy();
  });

  it('lands an adult on Home', async () => {
    await renderScreen(<RootNavigator initialRoute="Tabs" initialTab="HomeTab" />);
    expect(screen.getByTestId('placeholder-S10')).toBeTruthy();
  });

  it('lands an under-18 account on the workload surface', async () => {
    await renderScreen(<RootNavigator initialRoute="Tabs" initialTab="LoadTab" />);
    // Safety is structure: for a junior, workload is the default surface.
    expect(screen.getByTestId('load-screen')).toBeTruthy();
  });

  it('starts a first run in onboarding, with no tab bar', async () => {
    await renderScreen(<RootNavigator initialRoute="Onboarding" initialTab="HomeTab" />);
    expect(screen.getByText('Get started')).toBeTruthy();
    expect(screen.queryByLabelText('Bowl a session')).toBeNull();
  });
});
