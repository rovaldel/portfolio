import { execFileSync } from 'node:child_process';
import { expect, test } from '@playwright/test';

test.setTimeout(180_000);
const hostPort = process.env['PORT'] ?? '3000';

test('el contenedor endurecido queda saludable cuando se solicita explícitamente', async () => {
  test.skip(
    !process.env['RUN_CONTAINER_TESTS'],
    'Se ejecuta por separado para evitar competir por el puerto 3000.',
  );
  try {
    execFileSync('docker', ['compose', 'up', '--build', '--wait'], { stdio: 'inherit' });
    const containerId = execFileSync('docker', ['compose', 'ps', '-q', 'portfolio'], {
      encoding: 'utf8',
    }).trim();
    const [inspect] = JSON.parse(execFileSync('docker', ['inspect', containerId], { encoding: 'utf8' }));
    expect(inspect.State.Health.Status).toBe('healthy');
    expect(inspect.Config.User).toBe('portfolio');
    expect(execFileSync('docker', ['exec', containerId, 'id', '-u'], { encoding: 'utf8' }).trim()).toBe(
      '10001',
    );
    expect(inspect.HostConfig.ReadonlyRootfs).toBe(true);
    expect(inspect.HostConfig.CapDrop).toContain('ALL');
    expect(inspect.HostConfig.SecurityOpt).toContain('no-new-privileges:true');
    expect((await fetch(`http://127.0.0.1:${hostPort}/api/salud`)).status).toBe(200);
    const processes = execFileSync('docker', ['top', containerId], {
      encoding: 'utf8',
    });
    expect(processes.match(/node dist\/server\/entry\.mjs/g)).toHaveLength(1);
  } finally {
    execFileSync('docker', ['compose', 'down'], { stdio: 'inherit' });
    expect(execFileSync('docker', ['compose', 'ps', '-q', 'portfolio'], { encoding: 'utf8' }).trim()).toBe(
      '',
    );
  }
});
