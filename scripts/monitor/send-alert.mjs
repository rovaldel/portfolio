import nodemailer from 'nodemailer';

const healthy = process.env.HEALTHY === 'true';
const repository = process.env.GITHUB_REPOSITORY;
const currentRunId = process.env.GITHUB_RUN_ID;
const githubToken = process.env.GITHUB_TOKEN;
const smtpPassword = process.env.GMAIL_SMTP_APP_PASSWORD?.replaceAll(' ', '');
const smtpUser = 'rodr.valdelvira@gmail.com';
const alertTo = 'rodrigo.valdelvira@gmail.com';
const siteUrl = 'https://rodrigovaldelvira.com';

if (!repository || !currentRunId || !githubToken)
  throw new Error('Falta configuración del historial de monitorización');

async function githubJson(path) {
  const response = await fetch('https://api.github.com/repos/' + repository + path, {
    headers: {
      Authorization: 'Bearer ' + githubToken,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'portfolio-health-monitor',
    },
    signal: AbortSignal.timeout(15_000),
  });
  if (!response.ok) throw new Error('No se pudo consultar el estado anterior del monitor');
  return response.json();
}

async function previousOutageWasReported() {
  const runs = await githubJson('/actions/workflows/monitor-production.yml/runs?per_page=20');
  const previous = (runs.workflow_runs ?? [])
    .filter((run) => String(run.id) !== currentRunId && run.status === 'completed')
    .sort((left, right) => right.id - left.id)[0];
  if (!previous) return false;
  const jobs = await githubJson('/actions/runs/' + previous.id + '/jobs?per_page=100');
  const steps = (jobs.jobs ?? []).flatMap((job) => job.steps ?? []);
  const notification = steps.find((step) => step.name === 'Send operational notification');
  const outageMarker = steps.find((step) => step.name === 'Mark service as unhealthy');
  return notification?.conclusion === 'success' && outageMarker?.conclusion === 'failure';
}

let alreadyReported;
try {
  alreadyReported = await previousOutageWasReported();
} catch {
  // If the Actions API is temporarily unavailable, favor delivery over suppression.
  alreadyReported = false;
}

if (!healthy && alreadyReported) {
  console.log('La incidencia ya está notificada; se omite el aviso repetido.');
  process.exit(0);
}
if (healthy && !alreadyReported) {
  console.log('No hay una incidencia previa que notificar como resuelta.');
  process.exit(0);
}
if (!smtpPassword) throw new Error('Falta el secreto SMTP para entregar la notificación operativa');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: { user: smtpUser, pass: smtpPassword },
  connectionTimeout: 15_000,
  greetingTimeout: 10_000,
  socketTimeout: 20_000,
  tls: { minVersion: 'TLSv1.2' },
});

try {
  await transporter.sendMail({
    from: smtpUser,
    to: alertTo,
    subject: healthy
      ? 'Portfolio recuperado: rodrigovaldelvira.com'
      : 'Portfolio no disponible: rodrigovaldelvira.com',
    text: healthy
      ? 'La comprobación externa vuelve a recibir la respuesta de salud esperada en ' +
        siteUrl +
        '.\n\nEjecución: ' +
        repository +
        ' · ' +
        currentRunId
      : 'La comprobación externa no recibe la respuesta de salud esperada en ' +
        siteUrl +
        '. Se notificó una vez para esta incidencia y se repetirá el aviso solo si falla la entrega del correo.\n\nEjecución: ' +
        repository +
        ' · ' +
        currentRunId,
    headers: { 'Auto-Submitted': 'auto-generated' },
  });
  console.log(healthy ? 'Aviso de recuperación entregado.' : 'Aviso operativo entregado.');
} catch {
  console.error('No se pudo entregar la notificación operativa por SMTP.');
  process.exitCode = 1;
} finally {
  transporter.close();
}
