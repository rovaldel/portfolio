export type ThemeId = 'light' | 'dark' | 'cobalto' | 'rioja' | 'bosque';

export interface ImageSource {
  src: string;
  type: 'image/avif' | 'image/webp';
}

export interface ImageAsset {
  src: string;
  alt: string;
  width: number;
  height: number;
  sources: ImageSource[];
  sourceHash: string;
  fallbackLabel: string;
}

export interface ContactChannel {
  kind: 'email' | 'phone' | 'linkedin';
  approval: 'pending' | 'approved' | 'excluded';
  approvalEvidence: { actor: string; date: string; reference: string } | null;
  label: string;
  value: string;
  displayValue: string;
  href: string;
}

export interface EducationRecord {
  id: string;
  title: string;
  institution: string;
  startYear: number;
  endYear: number;
  years: string;
  description: string;
  order: number;
  provenance: string[];
}

export interface LegalDocument {
  kind: 'privacy' | 'cookies' | 'terms';
  title: string;
  kicker: string;
  sections: { title: string; body: string }[];
  status: 'working-draft' | 'approved';
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface NavigationAction {
  id: string;
  label: string;
  destination: string;
  responseKind: 'profile' | 'skills' | 'services' | 'projects' | 'experience' | 'education' | 'contact';
  contentRefs: string[];
  response: string;
}

export interface Service {
  slug: string;
  title: string;
  summary: string;
  description: string;
  icon: string;
  contactSubject: string;
  order: number;
  provenance: string[];
}

export interface Project {
  slug: 'leadia' | 'nami';
  title: string;
  status: 'published' | 'design';
  statusLabel: string;
  client: string;
  role: string;
  description: string;
  technologies: string[];
  image: ImageAsset;
  externalUrl: string | null;
  position: 1 | 2;
  provenance: string[];
}

export interface Experience {
  id: string;
  role: string;
  organization: string;
  /** Full name or descriptor shown next to the organisation, when the CV gives one. */
  organizationDetail?: string;
  location: string;
  workMode: 'presencial' | 'remoto';
  start: string;
  end: string | null;
  current: boolean;
  order: number;
  highlights: string[];
  /** "Logros destacados": results the CV calls out separately from the responsibilities. */
  achievements?: string[];
  provenance: string[];
}

export interface InternationalStay {
  id: string;
  place: string;
  country: string;
  duration: string;
  year: number;
}

export interface SkillGroup {
  id: string;
  order: number;
  provenance: string[];
  name: string;
  skills: { name: string; order: number; level: number }[];
}

export interface AboutSegment {
  text: string;
  emphasis?: boolean;
}

export interface SiteProfile {
  id: string;
  provenance: string[];
  fullName: string;
  displayName: string;
  primaryRole: string;
  professionalSummary: string;
  totalExperienceLabel: string;
  /** Short form shown in the home quote: "15+ años · Ingeniería + IA". */
  experienceBadge: string;
  /** Short form shown in the profile facts: "15+ años de experiencia profesional". */
  experienceFact: string;
  location: string;
  locationApproval: 'pending' | 'approved' | 'excluded';
  locationApprovalEvidence: { actor: string; date: string; reference: string } | null;
  availability: string;
  languages: string[];
  interests: string[];
  about: AboutSegment[][];
  channels: { email: ContactChannel; phone: ContactChannel; linkedin: ContactChannel };
  portrait: ImageAsset;
}

export const siteProfile: SiteProfile = {
  id: 'rodrigo-valdelvira',
  provenance: ['docs/ESPECIFICACION_MAESTRA.md#5.2', 'docs/ESPECIFICACION_MAESTRA.md#5.3'],
  fullName: 'Rodrigo Valdelvira Ortigosa',
  displayName: 'Rodrigo Valdelvira',
  primaryRole: 'AI Engineer',
  professionalSummary:
    'Diseño y llevo a producción agentes, chatbots y sistemas de IA que resuelven problemas reales de negocio.',
  totalExperienceLabel: '15+ años de experiencia profesional total · Ingeniería + IA',
  experienceBadge: '15+ años · Ingeniería + IA',
  experienceFact: '15+ años de experiencia profesional',
  location: 'Logroño, La Rioja · remoto',
  locationApproval: 'pending',
  locationApprovalEvidence: null,
  availability: 'Disponible para oportunidades profesionales en remoto',
  languages: ['Español', 'Inglés (C1)', 'Alemán (B1)'],
  interests: ['IA aplicada', 'sistemas de datos fiables', 'diseño de producto y lectura técnica'],
  about: [
    [
      { text: 'Me llamo ' },
      { text: 'Rodrigo Valdelvira', emphasis: true },
      { text: ' y soy ' },
      { text: 'AI Engineer y Data Scientist', emphasis: true },
      { text: '. Empecé como ingeniero industrial y, con los años, esa cabeza de procesos se mezcló con el código: hoy construyo ' },
      { text: 'agentes de IA, chatbots y sistemas RAG', emphasis: true },
      { text: ' que de verdad llegan a producción y resuelven problemas reales de negocio. Programo apoyándome en ' },
      { text: 'agentes de IA', emphasis: true },
      { text: ' (Claude Code, Codex) para moverme más rápido sin perder rigor.' },
    ],
    [
      { text: 'No me interesan las demos bonitas que se quedan en un cajón. Me gusta entender el problema, medir lo que importa y entregar algo que funcione el lunes por la mañana. Trabajo con ' },
      { text: 'LangChain, LangGraph, Python y la nube', emphasis: true },
      { text: ', y disfruto traduciendo IA compleja a decisiones claras para personas que no son técnicas. Si buscas a alguien que una estrategia, datos e ingeniería en el mismo sitio, este es mi rincón.' },
    ],
  ],
  channels: {
    email: { kind: 'email', approval: 'approved', approvalEvidence: { actor: 'Titular del portfolio', date: '2026-09-27', reference: 'specs/002-contacto-operacion-cierre/human-decisions.md#D-05' }, label: 'Email', value: 'rodrigo.valdelvira@gmail.com', displayValue: 'rodrigo.valdelvira@gmail.com', href: 'mailto:rodrigo.valdelvira@gmail.com' },
    phone: { kind: 'phone', approval: 'approved', approvalEvidence: { actor: 'Titular del portfolio', date: '2026-09-27', reference: 'specs/002-contacto-operacion-cierre/human-decisions.md#D-05' }, label: 'Teléfono', value: '+34 653 850 674', displayValue: '+34 653 850 674', href: 'tel:+34653850674' },
    linkedin: { kind: 'linkedin', approval: 'approved', approvalEvidence: { actor: 'Titular del portfolio', date: '2026-09-27', reference: 'specs/002-contacto-operacion-cierre/human-decisions.md#D-05' }, label: 'LinkedIn', value: 'in/rovaldel', displayValue: 'in/rovaldel', href: 'https://www.linkedin.com/in/rovaldel' },
  },
  portrait: {
    src: '/images/rodrigo-valdelvira.png',
    alt: 'Retrato de Rodrigo Valdelvira',
    width: 1024,
    height: 1024,
    sources: [
      { src: '/images/rodrigo-valdelvira.avif', type: 'image/avif' },
      { src: '/images/rodrigo-valdelvira.webp', type: 'image/webp' },
    ],
    sourceHash: '76f154a1ac7995f2bf4ac27175bb6a75fc5451ae6da0969840e21915888e07ef',
    fallbackLabel: 'Retrato de Rodrigo Valdelvira no disponible',
  },
};

export const experiences: Experience[] = [
  {
    id: 'cidatum', current: true, order: 1, provenance: ['docs/ESPECIFICACION_MAESTRA.md#5.2', 'assets/Rodrigo-Valdelvira-CV.pdf'], role: 'Ingeniero de Inteligencia Artificial', organization: 'Cidatum', organizationDetail: 'Centro Tecnológico del Dato', location: 'Logroño', workMode: 'presencial', start: '2025-12', end: null,
    highlights: [
      'Programa ActivaIA: liderazgo del marco de diagnóstico y adopción de IA en empresa: madurez digital, priorización de casos de uso de alto impacto, roadmaps de implantación, análisis Go/No-Go y gobernanza del dato.',
      'Desarrollo técnico a medida: diseño e implementación de sistemas, algoritmos y arquitecturas de IA para necesidades específicas de cliente e industria, con desarrollo asistido por agentes (Claude Code, Codex).',
      'Consultoría estratégica de IA: asesoramiento en viabilidad técnica y de negocio para la adopción e integración de soluciones basadas en IA.',
      'Formación y capacitación: diseño e impartición de programas formativos en IA para el equipo interno, socios estratégicos y tejido empresarial.',
    ],
  },
  {
    id: 'talenttools', current: false, order: 2, provenance: ['docs/ESPECIFICACION_MAESTRA.md#5.2', 'docs/ESPECIFICACION_MAESTRA.md#5.3', 'assets/Rodrigo-Valdelvira-CV.pdf'], role: 'Data Scientist · AI Engineer · Project Manager', organization: 'TalentTools', location: 'Logroño', workMode: 'remoto', start: '2021-04', end: '2025-12',
    highlights: [
      'InclunIA: coordinación, desarrollo y despliegue en Azure/GCP de sistemas de recomendación de demandantes/ofertas (Fundación ONCE).',
      'Habla con InclunIA: diseño y desarrollo de un técnico de selección virtual basado en LLMs, que actúa como chatbot inteligente interpretando datos del sistema InclunIA para facilitar procesos de reclutamiento inclusivo (Fundación ONCE).',
      'Dat4me: desarrollo y mantenimiento de pipelines de datos para analítica, visualización y entrenamiento de modelos (TalentTools).',
      'Clara: diseño e implementación del chatbot Orientador Profesional basado en LLMs (UPSA).',
      '2KBot: desarrollo de recomendador colaborativo híbrido que optimiza el matching entre perfil profesional y ocupaciones (TalentTools).',
      'Coordinación del área de datos: definición de estrategia técnica, gestión de proyectos IA y evaluación de tecnologías emergentes.',
    ],
    achievements: [
      'Reducción del tiempo de análisis de datos de talento en un 65% mediante automatización inteligente.',
      'Despliegue seguro en Azure/GCP de soluciones IA interoperables con ERP/CRM.',
      'Integración de interpretabilidad y trazabilidad en modelos de recomendación y chatbots (Habla con InclunIA).',
    ],
  },
  {
    id: 'cmp', current: false, order: 3, provenance: ['docs/ESPECIFICACION_MAESTRA.md#5.2', 'assets/Rodrigo-Valdelvira-CV.pdf'], role: 'Ingeniero de Diseño y Desarrollo de Producto', organization: 'CMP Automotive Group', location: 'Logroño', workMode: 'presencial', start: '2012-09', end: '2021-04',
    highlights: [
      'Gestión técnica de nuevos productos antivibratorios, desde la oferta a producción.',
      'Diseño CAD 3D y análisis FEA de componentes mecánicos.',
      'Coordinación de fabricación, ensayos y validación de prototipos.',
      'Seguimiento técnico con clientes internacionales durante todo el ciclo de desarrollo.',
    ],
  },
  {
    id: 'pope', current: false, order: 4, provenance: ['docs/ESPECIFICACION_MAESTRA.md#5.2', 'assets/Rodrigo-Valdelvira-CV.pdf'], role: 'Ingeniero de Instalaciones', organization: 'POPE', organizationDetail: 'Building Services Consulting Engineers', location: 'Chichester, UK', workMode: 'presencial', start: '2012-07', end: '2012-08',
    highlights: [
      'Elaboración de planos y cálculos de instalaciones HVAC, ACS y saneamiento.',
      'Apoyo en el dimensionamiento de sistemas de energías renovables (solar térmica, FV, biomasa, geotermia).',
    ],
  },
  {
    id: 'gi-teneco', current: false, order: 5, provenance: ['docs/ESPECIFICACION_MAESTRA.md#5.2', 'assets/Rodrigo-Valdelvira-CV.pdf'], role: 'Investigador', organization: 'GI-TENECO', organizationDetail: 'Grupo Termodinámica aplicada, energía y construcción', location: 'Logroño', workMode: 'presencial', start: '2011-09', end: '2012-12',
    highlights: [
      'Análisis del consumo energético mundial y nacional.',
      'Estimación del potencial de biomasa y residuos energéticamente aprovechables en La Rioja.',
    ],
  },
];

export const internationalExperience: InternationalStay[] = [
  { id: 'chichester', place: 'Chichester', country: 'UK', duration: '10 meses', year: 2012 },
  { id: 'koblenz', place: 'Koblenz', country: 'DE', duration: '4 meses', year: 2016 },
  { id: 'berlin', place: 'Berlin', country: 'DE', duration: '2 meses', year: 2017 },
];

export const education: EducationRecord[] = [
  { id: 'aenor', startYear: 2026, endYear: 2026, order: 1, provenance: ['docs/ESPECIFICACION_MAESTRA.md#5.2'], title: 'Especialista implantador ISO 42001 (IA Responsable)', institution: 'AENOR', years: '2026', description: 'Especialización en implantación de sistemas de gestión de IA responsable, evaluación de riesgos y cumplimiento normativo.' },
  { id: 'uemc', startYear: 2020, endYear: 2021, order: 2, provenance: ['docs/ESPECIFICACION_MAESTRA.md#5.2'], title: 'Máster oficial en Big Data', institution: 'UEMC · Universidad Europea Miguel de Cervantes', years: '2020–2021', description: 'Analítica avanzada, machine learning y arquitecturas de datos a gran escala.' },
  { id: 'goethe', startYear: 2017, endYear: 2017, order: 3, provenance: ['docs/ESPECIFICACION_MAESTRA.md#5.2'], title: 'Goethe-Zertifikat B1', institution: 'Carl Duisberg Centren · Berlín', years: '2017', description: 'Certificación oficial de nivel B1 de alemán.' },
  { id: 'cambridge', startYear: 2012, endYear: 2012, order: 4, provenance: ['docs/ESPECIFICACION_MAESTRA.md#5.2'], title: 'Cambridge Advanced C1', institution: 'Chichester College · Reino Unido', years: '2012', description: 'Certificación C1 de inglés y práctica profesional en ingeniería.' },
  { id: 'industrial', startYear: 2009, endYear: 2011, order: 5, provenance: ['docs/ESPECIFICACION_MAESTRA.md#5.2'], title: 'Ingeniería Industrial', institution: 'Universidad de La Rioja', years: '2009–2011', description: 'Procesos, diseño de producto y gestión de proyectos técnicos.' },
  { id: 'mecanica', startYear: 2005, endYear: 2009, order: 6, provenance: ['docs/ESPECIFICACION_MAESTRA.md#5.2'], title: 'Ingeniería Técnica Industrial, especialidad Mecánica', institution: 'Universidad de La Rioja', years: '2005–2009', description: 'Base en diseño mecánico, cálculo estructural y modelado CAD.' },
];

export const skillGroups: SkillGroup[] = [
  { id: 'ia', order: 1, provenance: ['docs/ESPECIFICACION_MAESTRA.md#5.2'], name: 'IA / Machine Learning', skills: [{ name: "LangGraph", order: 1, level: 5 }, { name: "LangChain", order: 2, level: 5 }, { name: "RAG", order: 3, level: 5 }, { name: "Scikit-learn", order: 4, level: 5 }, { name: "PyTorch", order: 5, level: 4 }, { name: "Hugging Face", order: 6, level: 4 }] },
  { id: 'datos', order: 2, provenance: ['docs/ESPECIFICACION_MAESTRA.md#5.2'], name: 'Datos / MLOps', skills: [{ name: "Python", order: 1, level: 5 }, { name: "Pandas", order: 2, level: 5 }, { name: "FastAPI", order: 3, level: 5 }, { name: "Docker", order: 4, level: 4 }, { name: "BigQuery", order: 5, level: 4 }, { name: "PostgreSQL", order: 6, level: 4 }] },
  { id: 'cloud', order: 3, provenance: ['docs/ESPECIFICACION_MAESTRA.md#5.2'], name: 'Backend · Cloud', skills: [{ name: "Flask", order: 1, level: 4 }, { name: "Microservicios", order: 2, level: 4 }, { name: "Azure", order: 3, level: 4 }, { name: "GCP", order: 4, level: 4 }, { name: "Node.js", order: 5, level: 3 }] },
  { id: 'desarrollo', order: 4, provenance: ['docs/ESPECIFICACION_MAESTRA.md#5.2'], name: 'Agentes de IA · desarrollo', skills: [{ name: "Claude Code", order: 1, level: 5 }, { name: "Codex", order: 2, level: 4 }, { name: "Cursor", order: 3, level: 4 }, { name: "Harness de desarrollo agéntico", order: 4, level: 4 }, { name: "MCP (Model Context Protocol)", order: 5, level: 4 }] },
];

export const services: Service[] = [
  { slug: 'agentes-y-chatbots-ia', title: 'Agentes y chatbots IA', summary: "Agentes conversacionales, asistentes y chatbots con LLMs, listos para tus usuarios.", description: "Diseño y construyo agentes conversacionales sobre LLMs (LangChain, LangGraph) que resuelven una tarea de negocio de punta a punta: atención al cliente, cualificación de leads, orientación o soporte interno. Incluye orquestación de herramientas, memoria de conversación, integración con tus sistemas (CRM, calendario, base de datos) y control de calidad de las respuestas antes de salir a producción.", icon: "M21 11.5a8.4 8.4 0 0 1-9 8.4 9 9 0 0 1-3.3-.6L3 21l1.7-5.1A8.4 8.4 0 1 1 21 11.5z", contactSubject: "Consulta sobre: Agentes y chatbots IA", provenance: ['docs/ESPECIFICACION_MAESTRA.md#5.2'], order: 1 },
  { slug: 'ingenieria-de-datos', title: 'Ingeniería de datos', summary: "Pipelines fiables que mueven y transforman tus datos sin intervención manual.", description: "Construyo pipelines de datos automatizados: ingesta, limpieza, transformación y carga entre tus fuentes y tus modelos o cuadros de mando. El objetivo es que el dato llegue siempre correcto y a tiempo, sin procesos manuales ni hojas de cálculo intermedias que se rompen con el tiempo.", icon: "M4 6c0-4 16-4 16 0s-16 4-16 0Zm0 0v12c0 4 16 4 16 0V6M4 12c0 4 16 4 16 0", contactSubject: "Consulta sobre: Ingeniería de datos", provenance: ['docs/ESPECIFICACION_MAESTRA.md#5.2'], order: 2 },
  { slug: 'ml-y-modelos-predictivos', title: 'ML y modelos predictivos', summary: "Modelos de machine learning que anticipan, clasifican y recomiendan.", description: "Desarrollo modelos de machine learning para predicción, clasificación y recomendación adaptados a tu caso de uso: desde sistemas de recomendación híbridos hasta modelos de scoring o detección de patrones. Cubro desde la exploración de datos hasta la validación del modelo con métricas de negocio, no solo técnicas.", icon: "M3 3v18h18M7 15l3-4 3 3 5-7", contactSubject: "Consulta sobre: ML y modelos predictivos", provenance: ['docs/ESPECIFICACION_MAESTRA.md#5.2'], order: 3 },
  { slug: 'mlops-y-produccion', title: 'MLOps y producción', summary: "Del notebook a producción: contenedores, APIs y monitorización.", description: "Llevo modelos y agentes del notebook a un entorno productivo real: contenedorización (Docker), despliegue en Azure/GCP, exposición vía API (FastAPI) y monitorización de rendimiento y coste. Así el modelo sigue funcionando bien meses después de lanzarlo, no solo el día de la demo.", icon: "M12 2l8 4.5v9L12 20l-8-4.5v-9zM12 11l8-4.5M12 11v9M12 11L4 6.5", contactSubject: "Consulta sobre: MLOps y producción", provenance: ['docs/ESPECIFICACION_MAESTRA.md#5.2'], order: 4 },
  { slug: 'analitica-y-visualizacion', title: 'Analítica y visualización', summary: "Cuadros de mando y análisis para decidir con datos, no con intuición.", description: "Diseño cuadros de mando y análisis a medida que responden preguntas concretas de negocio, no solo muestran métricas. Trabajo con BigQuery, PostgreSQL y las herramientas de visualización que ya use tu equipo, priorizando claridad sobre cantidad de datos.", icon: "M3 3h18v18H3zM7 17v-4M12 17V7M17 17v-7", contactSubject: "Consulta sobre: Analítica y visualización", provenance: ['docs/ESPECIFICACION_MAESTRA.md#5.2'], order: 5 },
  { slug: 'desarrollo-con-agentes-de-ia', title: 'Desarrollo con agentes de IA', summary: "Programo apoyado en Claude Code y Codex para entregar más rápido sin bajar el estándar.", description: "Uso agentes de IA de desarrollo (Claude Code, Codex) como parte de mi flujo diario de programación, dentro de un harness que mantiene control de calidad, revisión y trazabilidad sobre lo que el agente escribe. Esto acelera la entrega de prototipos, integraciones y pipelines, sin renunciar a código legible y mantenible.", icon: "M4 17l6-6-6-6M12 19h8", contactSubject: "Consulta sobre: Desarrollo con agentes de IA", provenance: ['docs/ESPECIFICACION_MAESTRA.md#5.2'], order: 6 },
];

export const projects: Project[] = [
  { slug: 'leadia', title: 'Leadia', status: 'published', statusLabel: 'Destacado', client: 'Producto propio', role: 'AI Engineer', description: 'Agente de voz con IA que atiende llamadas de forma autónoma y automatiza la gestión de leads: capta, cualifica y registra la consulta.', technologies: ['Agentes de voz', 'LLMs', 'FastAPI', 'Telefonía IA'], image: { src: '/images/leadia.webp', alt: 'Interfaz de Leadia, un agente de voz con IA', width: 1200, height: 800, fallbackLabel: 'Imagen de Leadia no disponible', sources: [{ src: '/images/leadia.avif', type: 'image/avif' }, { src: '/images/leadia.webp', type: 'image/webp' }], sourceHash: '13cd8ad5d11cec05ddb5b3deb8dafc1b2b4a63318e73c594008ca7f90f0815f5' }, externalUrl: 'https://leadia.es', position: 1, provenance: ['docs/ESPECIFICACION_MAESTRA.md#5.2'] },
  { slug: 'nami', title: 'Nami', status: 'design', statusLabel: 'En fase de diseño', client: 'Producto propio', role: 'AI Engineer / Product', description: 'Aplicación de bienestar y productividad para adultos con TDAH, diseñada junto a un equipo clínico para ayudar con tareas reales del día a día.', technologies: ['Diseño de producto', 'UX clínico', 'TCC / ACT', 'Flujos de agente'], image: { src: '/images/nami-cover.png', alt: 'Imagen conceptual del proyecto Nami', width: 1200, height: 800, fallbackLabel: 'Imagen de Nami no disponible', sources: [{ src: '/images/nami-cover.avif', type: 'image/avif' }, { src: '/images/nami-cover.webp', type: 'image/webp' }], sourceHash: 'b9aec9d26b05863a357394613626831016844be02c5516c6c0ea7f2ed4b985ef' }, externalUrl: null, position: 2, provenance: ['docs/ESPECIFICACION_MAESTRA.md#5.2'] },
];

export const legalDocuments: LegalDocument[] = [
  {
    "kind": "privacy",
    "title": "Privacidad",
    "kicker": "Tus datos, con una finalidad concreta",
    "status": "approved",
    "reviewedAt": "2026-09-27",
    "reviewedBy": "titular del portfolio",
    "sections": [
      {
        "title": "Responsable y contacto",
        "body": "Rodrigo Valdelvira Ortigosa es el responsable del tratamiento de los datos recogidos en rodrigovaldelvira.com, un portfolio personal orientado a oportunidades de empleo. Puedes contactar en rodrigo.valdelvira@gmail.com."
      },
      {
        "title": "Datos y finalidades",
        "body": "El formulario solicita nombre, email y mensaje para responder a consultas profesionales y oportunidades laborales. Los campos son necesarios para atender la consulta; no incluyas datos de salud ni otra información sensible. No se emplean para publicidad ni para crear perfiles. El explorador de preguntas del portfolio funciona en tu navegador: sus preguntas no se envían a un proveedor de inteligencia artificial ni se guardan entre visitas."
      },
      {
        "title": "Base jurídica",
        "body": "Las consultas generales y profesionales se atienden por el interés legítimo en mantener las comunicaciones iniciadas por quien escribe (artículo 6.1.f del RGPD), limitado a esa finalidad y con derecho de oposición. Cuando la consulta solicite actuaciones previas a una relación contractual, se aplica el artículo 6.1.b del RGPD. La protección frente a abuso y ataques se basa en el interés legítimo en mantener la seguridad del sitio."
      },
      {
        "title": "Alojamiento, correo y destinatarios",
        "body": "El sitio está alojado en una VPS de Hetzner. Los mensajes se envían mediante una conexión cifrada al servicio SMTP de Gmail y se reciben en el buzón de Rodrigo Valdelvira. Google indica que sus servicios de consumo suelen prestarse desde Google Ireland Limited a usuarios del EEE, aunque la información puede tratarse en servidores de otros países. Para las transferencias, Google describe decisiones de adecuación, el EU-U.S. Data Privacy Framework para Google LLC y filiales estadounidenses cubiertas, y cláusulas contractuales tipo cuando corresponden. Para la cuenta de destino de este sitio se asume que se mantiene la operativa bajo los términos estándar del EEE. Hetzner y Google intervienen en la prestación de estos servicios; no se venden datos ni se comunican para publicidad. Las autoridades podrán recibir información cuando exista una obligación legal."
      },
      {
        "title": "Conservación de los datos",
        "body": "El servidor de la aplicación no almacena el contenido del formulario en una base de datos. Los mensajes entregados permanecen en el buzón de Gmail; la aplicación no configura su borrado automático y no se fija un plazo máximo concreto de conservación. El titular puede eliminar los mensajes manualmente cuando dejan de ser necesarios para atender la consulta, gestionar una oportunidad o responder a obligaciones o reclamaciones. Las copias y el tratamiento dentro de Gmail se rigen por las condiciones aplicables a la cuenta. Puedes solicitar la supresión escribiendo a rodrigo.valdelvira@gmail.com."
      },
      {
        "title": "Seguridad y registros técnicos",
        "body": "La aplicación mantiene temporalmente en memoria un identificador derivado de la IP para limitar envíos durante 15 minutos y un identificador de envío durante 2 minutos para evitar duplicados; se purgan al procesar nuevas solicitudes o al reiniciar el proceso. Los mensajes no se incluyen en los registros de aplicación. El proxy registra la dirección IP de origen, URI, agente de usuario y referente; sus ficheros rotan semanalmente, conservando cuatro de acceso y diez de errores. El contenedor de Nginx Proxy Manager usa el driver Docker json-file sin límites explícitos de tamaño o cantidad. El servidor y el proveedor de alojamiento también pueden generar registros técnicos."
      },
      {
        "title": "Tus derechos",
        "body": "Puedes solicitar acceso, rectificación, supresión, oposición, limitación del tratamiento y, cuando corresponda, portabilidad escribiendo a rodrigo.valdelvira@gmail.com. Se verificará tu identidad de forma proporcionada cuando sea necesario. La respuesta se facilitará normalmente en un mes, con las ampliaciones motivadas previstas por el RGPD. También puedes presentar una reclamación ante la Agencia Española de Protección de Datos en www.aepd.es."
      },
      {
        "title": "Enlaces y decisiones automatizadas",
        "body": "LinkedIn y las webs de proyectos son sitios independientes con sus propias políticas. No se cargan sus contenidos incrustados al visitar este portfolio. No se adoptan decisiones automatizadas con efectos jurídicos ni se elaboran perfiles sobre los visitantes."
      }
    ]
  },
  {
    "kind": "cookies",
    "title": "Cookies y almacenamiento local",
    "kicker": "Sin analítica ni publicidad",
    "status": "approved",
    "reviewedAt": "2026-09-27",
    "reviewedBy": "titular del portfolio",
    "sections": [
      {
        "title": "Qué utiliza esta aplicación",
        "body": "La aplicación no instala cookies de analítica, publicidad ni seguimiento. Sirve sus fuentes, imágenes y scripts desde el propio sitio. No incorpora píxeles de seguimiento ni vídeos, mapas o widgets de terceros."
      },
      {
        "title": "Preferencia de aspecto: rv_theme",
        "body": "Al elegir un tema, se guarda rv_theme en el almacenamiento local (localStorage) de tu navegador. Es una preferencia propia que solo contiene el nombre del tema; no identifica al visitante ni se envía automáticamente al servidor. Permanece hasta que cambies la selección o borres los datos del sitio. Si no eliges un tema, no se escribe esta preferencia."
      },
      {
        "title": "Por qué no hay un banner de consentimiento",
        "body": "Esta preferencia permite recordar una personalización solicitada expresamente por el usuario y se usa exclusivamente para ello. Bajo esa configuración está exceptuada de consentimiento previo conforme al artículo 22.2 de la LSSI. Si se añaden tecnologías no necesarias, deberán informarse y permanecer desactivadas hasta obtener el consentimiento que corresponda, con opciones equivalentes de aceptar y rechazar."
      },
      {
        "title": "Cómo eliminar la preferencia",
        "body": "Puedes borrar los datos de rodrigovaldelvira.com desde la configuración de privacidad de tu navegador. El sitio seguirá funcionando y recuperará el tema Rioja. También puedes cambiar de tema en cualquier momento desde el selector de la cabecera."
      },
      {
        "title": "Servicios externos",
        "body": "Los enlaces externos solo llevan al servicio correspondiente cuando los activas. Las cookies que utilicen esos sitios se rigen por sus propias políticas. La configuración final del proxy y del alojamiento debe mantenerse libre de tecnologías adicionales no declaradas."
      }
    ]
  },
  {
    "kind": "terms",
    "title": "Aviso legal y condiciones de uso",
    "kicker": "Información del portfolio",
    "status": "approved",
    "reviewedAt": "2026-09-27",
    "reviewedBy": "titular del portfolio",
    "sections": [
      {
        "title": "Titular y finalidad",
        "body": "Este portfolio pertenece a Rodrigo Valdelvira Ortigosa. Contacto: rodrigo.valdelvira@gmail.com. Dominio: rodrigovaldelvira.com. Su finalidad es presentar experiencia, competencias y proyectos a empleadores y equipos de selección. El titular no ejerce como autónomo a través del sitio. Las áreas de servicios describen capacidades profesionales; no constituyen una oferta de contratación o venta en línea."
      },
      {
        "title": "Uso del sitio",
        "body": "Puedes consultar el contenido, descargar el CV y contactar para oportunidades profesionales. No está permitido utilizar el formulario para spam, suplantar a otras personas, introducir contenido ilícito ni interferir en el funcionamiento del servicio. No se requiere registro ni se realizan pagos en esta web."
      },
      {
        "title": "Propiedad intelectual",
        "body": "Los textos y materiales propios corresponden a Rodrigo Valdelvira Ortigosa. Las marcas, herramientas, imágenes y materiales de terceros pertenecen a sus respectivos titulares y se utilizan según sus permisos o licencias. Se permite consultar, enlazar y compartir el portfolio con atribución, así como utilizar el CV para procesos de selección; otros usos deben respetar los derechos y límites legalmente aplicables."
      },
      {
        "title": "Información y enlaces externos",
        "body": "La información describe la trayectoria y los proyectos en el estado indicado. Nami se encuentra en fase de diseño; Toolkit IA está en preparación y Bitácora incluye un artículo público sobre LangGraph. Los enlaces a terceros se facilitan como referencia. El titular procurará corregir errores y mantener la información actualizada, sin excluir las responsabilidades que legalmente le correspondan."
      },
      {
        "title": "Normativa y cambios",
        "body": "El uso del sitio se somete a la normativa española y europea que resulte aplicable, sin limitar derechos imperativos de los usuarios ni imponer una jurisdicción distinta de la legalmente competente. Si el portfolio pasa a ofrecer una actividad económica propia, deberán actualizarse la identificación del prestador y las condiciones antes de iniciar esa actividad."
      }
    ]
  }
];

export const projectCount = 2;

export const navigationActions: NavigationAction[] = [
  { id: 'about', responseKind: 'profile', contentRefs: ["siteProfile", "experiences"], label: 'Sobre mí', destination: '/sobre-mi', response: 'Un perfil que combina ingeniería, datos e IA aplicada a problemas reales.' },
  { id: 'skills', responseKind: 'skills', contentRefs: ["skillGroups"], label: 'Habilidades', destination: '/habilidades', response: 'Tecnologías y prácticas que utilizo, con mi nivel de dominio orientativo.' },
  { id: 'services', responseKind: 'services', contentRefs: ["services"], label: 'Servicios', destination: '/servicios', response: 'Seis formas concretas de colaborar, desde el dato hasta producción.' },
  { id: 'projects', responseKind: 'projects', contentRefs: ["projects"], label: 'Proyectos', destination: '/proyectos', response: 'Dos proyectos: Leadia, disponible para conocer, y Nami, en fase de diseño.' },
  { id: 'experience', responseKind: 'experience', contentRefs: ["experiences"], label: 'Experiencia', destination: '/experiencia', response: 'Trayectoria profesional de ingeniería, datos e inteligencia artificial.' },
  { id: 'education', responseKind: 'education', contentRefs: ["education"], label: 'Formación', destination: '/formacion', response: 'Formación técnica, datos, IA responsable e idiomas.' },
  { id: 'contact', responseKind: 'contact', contentRefs: ["siteProfile.channels"], label: 'Contacto', destination: '/contacto', response: 'Si buscas un AI Engineer para tu equipo, hablemos.' },
];
