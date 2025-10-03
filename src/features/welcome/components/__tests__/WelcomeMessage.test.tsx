import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { WelcomeMessage } from '../WelcomeMessage';

describe('WelcomeMessage', () => {
  it('renders welcome message with app name', () => {
    render(<WelcomeMessage />);

    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.getByText(/Test Button/)).toBeInTheDocument();
  });

  it('displays version information', () => {
    render(<WelcomeMessage />);

    expect(screen.getByText(/v\d+\.\d+\.\d+/)).toBeInTheDocument();
  });
});
