import { expect, it } from 'vitest';
import { ContactAbuseGuard } from '../../src/lib/contact-abuse';

it('limits five attempts, deduplicates briefly and expires in-memory state', () => {
  let now = 1000;
  const guard = new ContactAbuseGuard(() => now, 900_000, 6);
  for (let i = 0; i < 5; i++)
    expect(guard.take('ephemeral-connection', `key-${i}-abcdefghijk`)).toBe('allowed');
  expect(guard.take('ephemeral-connection', 'key-6-abcdefghijk')).toBe('rate-limited');
  expect(guard.take('other', 'key-0-abcdefghijk')).toBe('duplicate');
  now += 900_001;
  expect(guard.take('ephemeral-connection', 'key-6-abcdefghijk')).toBe('allowed');
});

it('applies a global defensive cap', () => {
  const guard = new ContactAbuseGuard(() => 100, 900_000, 1);
  expect(guard.take('one', 'first-key-abcdefgh')).toBe('allowed');
  expect(guard.take('two', 'second-key-abcdefg')).toBe('rate-limited');
});
