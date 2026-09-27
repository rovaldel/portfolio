type Attempt = { count: number; expiresAt: number };

export class ContactAbuseGuard {
  private readonly byConnection = new Map<string, Attempt>();
  private readonly idempotency = new Map<string, number>();
  private global: Attempt = { count: 0, expiresAt: 0 };

  constructor(
    private readonly now = () => Date.now(),
    private readonly windowMs = 900_000,
    private readonly maxGlobal = 100,
  ) {}

  take(connectionKey: string, idempotencyKey: string): 'allowed' | 'rate-limited' | 'duplicate' {
    const now = this.now();
    this.prune(now);
    if (this.idempotency.has(idempotencyKey)) return 'duplicate';
    const local = this.byConnection.get(connectionKey);
    if (local && local.count >= 5) return 'rate-limited';
    if (this.global.count >= this.maxGlobal) return 'rate-limited';
    this.byConnection.set(connectionKey, {
      count: (local?.count ?? 0) + 1,
      expiresAt: local?.expiresAt ?? now + this.windowMs,
    });
    this.global = {
      count: this.global.count + 1,
      expiresAt: this.global.expiresAt > now ? this.global.expiresAt : now + this.windowMs,
    };
    this.idempotency.set(idempotencyKey, now + 120_000);
    return 'allowed';
  }

  private prune(now: number) {
    for (const [key, item] of this.byConnection) if (item.expiresAt <= now) this.byConnection.delete(key);
    for (const [key, expiresAt] of this.idempotency) if (expiresAt <= now) this.idempotency.delete(key);
    if (this.global.expiresAt <= now) this.global = { count: 0, expiresAt: 0 };
    while (this.byConnection.size > 10_000) this.byConnection.delete(this.byConnection.keys().next().value!);
    while (this.idempotency.size > 10_000) this.idempotency.delete(this.idempotency.keys().next().value!);
  }
}

export const contactAbuseGuard = new ContactAbuseGuard();
