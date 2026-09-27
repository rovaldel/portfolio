import { services } from '../content/site';
import type { ContactChannel } from '../content/site';

export const getContactSubject = (value: string | null): string | null => {
  if (!value || value.length > 80) return null;
  const service = services.find((item) => item.slug === value);
  return service ? `Consulta sobre: ${service.title}` : null;
};

export const isAllowedContactSubject = (value: string | null) => getContactSubject(value) !== null;

export const getPublicContactChannels = (channels: Record<string, ContactChannel>) =>
  Object.values(channels).filter(
    (channel) => channel.approval === 'approved' && channel.displayValue.trim() && channel.href.trim(),
  );
