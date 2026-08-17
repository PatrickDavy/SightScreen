import { render, screen } from '@testing-library/react-native';
import React from 'react';

import { WorkloadMeter, workloadTone } from './WorkloadMeter';

describe('workloadTone', () => {
  it('is good below 80% of the limit', () => {
    expect(workloadTone(14, 21)).toBe('good');
    expect(workloadTone(0, 21)).toBe('good');
  });
  it('is watch at or above 80%', () => {
    expect(workloadTone(16.8, 21)).toBe('watch');
    expect(workloadTone(20, 21)).toBe('watch');
  });
  it('is over at or above the limit', () => {
    expect(workloadTone(21, 21)).toBe('over');
    expect(workloadTone(30, 21)).toBe('over');
  });
  it('treats a zero limit as good rather than dividing by zero', () => {
    expect(workloadTone(5, 0)).toBe('good');
  });
});

describe('WorkloadMeter', () => {
  it('shows the status word for the derived tone', async () => {
    await render(<WorkloadMeter label="This week" used={18} limit={21} unit="overs" />);
    expect(screen.getByText('Near limit')).toBeTruthy();
  });
  it('never paywalls: renders the guideline footnote plainly', async () => {
    await render(
      <WorkloadMeter used={6} limit={21} guideline="U17 guideline · illustrative" />,
    );
    expect(screen.getByText('U17 guideline · illustrative')).toBeTruthy();
  });
});
