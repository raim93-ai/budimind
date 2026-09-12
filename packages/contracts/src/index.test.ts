import { describe, expect, it } from 'vitest';
import { CorporateRole } from './index';

describe('corporate roles', () => {
  it('includes the privileged G2 review roles', () => {
    expect(CorporateRole.PRIVACY_REVIEWER).toBe('privacy_reviewer');
    expect(CorporateRole.PLATFORM_OPERATIONS).toBe('platform_operations');
  });
});
