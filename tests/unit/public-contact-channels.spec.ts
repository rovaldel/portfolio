import { expect, it } from 'vitest';
import type { ContactChannel } from '../../src/content/site';
import { siteProfile } from '../../src/content/site';
import { getPublicContactChannels } from '../../src/lib/contact';

it('omits pending and excluded channels and renders approved values only', () => {
  const channels: Record<string, ContactChannel> = {
    email: { ...siteProfile.channels.email, approval: 'pending' as const },
    phone: { ...siteProfile.channels.phone, approval: 'excluded' as const },
    linkedin: { ...siteProfile.channels.linkedin, approval: 'approved' as const },
  };
  expect(getPublicContactChannels(channels).map(({ kind }) => kind)).toEqual(['linkedin']);
});
it('omits an approved channel with an empty value or href', () => {
  const channels: Record<string, ContactChannel> = {
    ...siteProfile.channels,
    email: { ...siteProfile.channels.email, approval: 'approved' as const, href: '' },
  };
  expect(getPublicContactChannels(channels).map(({ kind }) => kind)).not.toContain('email');
});
it('keeps unapproved real channels and location out of the public contact set', () => {
  expect(getPublicContactChannels(siteProfile.channels)).toEqual([]);
  expect(siteProfile.locationApproval).toBe('pending');
});
