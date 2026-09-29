import { getContent } from '../content';
import type { ContactChannel } from '../content/site';
import type { Locale } from './i18n';

export const getContactSubject = (value: string | null, locale: Locale = 'es'): string | null => {
  if (!value || value.length > 80) return null;
  const service = getContent(locale).services.find((item) => item.slug === value);
  return service ? service.contactSubject : null;
};

export const isAllowedContactSubject = (value: string | null) => getContactSubject(value) !== null;

export const getPublicContactChannels = (channels: Record<string, ContactChannel>) =>
  Object.values(channels).filter(
    (channel) => channel.approval === 'approved' && channel.displayValue.trim() && channel.href.trim(),
  );
