import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useWelcome } from '../useWelcome';

describe('useWelcome', () => {
  it('returns welcome data', () => {
    const { result } = renderHook(() => useWelcome());

    expect(result.current.message).toBeDefined();
    expect(result.current.version).toBeDefined();
    expect(result.current.contributors).toBeInstanceOf(Array);
  });
});
