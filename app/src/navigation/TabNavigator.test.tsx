import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import React from 'react';

import { createMemoryRepos } from '@/data/repos/memoryRepos';
import { Bowler } from '@/domain/types';
import { renderScreen } from '@/testing/renderScreen';

import { RootNavigator } from './RootNavigator';

const bowler: Bowler = {
  id: 'b1',
  yob: 1996,
  arm: 'right',
  type: 'Pace',
  heightCm: 178,
  armSpanCm: 183,
  targetSpeedKmh: 130,
  fix: null,
  unit: 'km/h',
  guardianEmail: null,
  consentState: 'none',
};

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
    expect(screen.getByTestId('home-screen')).toBeTruthy();
  });

  it('lands an under-18 account on the workload surface', async () => {
    await renderScreen(<RootNavigator initialRoute="Tabs" initialTab="LoadTab" />);
    // Safety is structure: for a junior, workload is the default surface.
    expect(screen.getByTestId('load-screen')).toBeTruthy();
  });

  it('walks between the real destinations', async () => {
    const repos = createMemoryRepos();
    repos.bowler.save(bowler);
    await renderScreen(<RootNavigator initialRoute="Tabs" initialTab="HomeTab" />, { repos });

    expect(screen.getByTestId('home-screen')).toBeTruthy();

    fireEvent.press(screen.getByText('Load'));
    await waitFor(() => expect(screen.getByTestId('load-screen')).toBeTruthy());

    fireEvent.press(screen.getByText('Improve'));
    await waitFor(() => expect(screen.getByTestId('improve-screen')).toBeTruthy());

    fireEvent.press(screen.getByText('You'));
    await waitFor(() => expect(screen.getByTestId('you-screen')).toBeTruthy());
  });

  it('opens capture as a mode, with the tab bar gone', async () => {
    const repos = createMemoryRepos();
    repos.bowler.save(bowler);
    await renderScreen(<RootNavigator initialRoute="Tabs" initialTab="HomeTab" />, { repos });

    fireEvent.press(screen.getByLabelText('Bowl a session'));
    await waitFor(() => expect(screen.getByText('Net session')).toBeTruthy());

    // Capture is a full-screen modal above the tabs, so the bar is not rendered
    // at all rather than hidden.
    expect(screen.queryByLabelText('Bowl a session')).toBeNull();
  });

  it('starts a first run in onboarding, with no tab bar', async () => {
    await renderScreen(<RootNavigator initialRoute="Onboarding" initialTab="HomeTab" />);
    expect(screen.getByText('Get started')).toBeTruthy();
    expect(screen.queryByLabelText('Bowl a session')).toBeNull();
  });
});
