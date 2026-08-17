import { render, screen } from '@testing-library/react-native';
import React from 'react';

import { Metric } from './Metric';

describe('Metric', () => {
  it('renders value with its band and sample in the mono line', async () => {
    await render(
      <Metric label="Fastest ball" value={116.2} unit="km/h" band={2.3} sample="from 26 frames" />,
    );
    expect(screen.getByText('116.2')).toBeTruthy();
    expect(screen.getByText('±2.3 km/h · from 26 frames')).toBeTruthy();
  });

  it('announces measurements in words for screen readers', async () => {
    await render(<Metric label="Ball speed" value={116.2} unit="km/h" band={2.3} />);
    expect(
      screen.getByLabelText('Ball speed: 116.2 plus or minus 2.3 kilometres per hour'),
    ).toBeTruthy();
  });

  it('warns in dev when a measured number has no band — the no-bare-number invariant', async () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    await render(<Metric label="Speed" value={128.4} unit="km/h" />);
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('without a band'));
    spy.mockRestore();
  });

  it('does not warn for non-numeric values', async () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    await render(<Metric label="Change" value="148 → 153" unit="°" band={5} />);
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });
});
