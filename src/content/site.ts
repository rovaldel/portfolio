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
  location: string;
  workMode: 'presencial' | 'remoto';
  start: string;
  end: string | null;
  current: boolean;
  order: number;
  highlights: string[];
  provenance: string[];
}

export const siteProfile = {
  id: 'rodrigo-valdelvira',
  provenance: ['docs/ESPECIFICACION_MAESTRA.md#5.2', 'docs/ESPECIFICACION_MAESTRA.md#5.3'],
  fullName: 'Rodrigo Valdelvira Ortigosa',
  displayName: 'Rodrigo Valdelvira',
  primaryRole: 'AI Engineer',
  professionalSummary:
    'Diseño y llevo a producción agentes, chatbots y sistemas de IA que resuelven problemas reales de negocio.',
  totalExperienceLabel: '15+ años de experiencia profesional total · Ingeniería + IA',
  location: 'Logroño, La Rioja · remoto',
  locationApproval: 'pending' as const,
  locationApprovalEvidence: null as { actor: string; date: string; reference: string } | null,
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
    email: { kind: 'email', approval: 'pending', approvalEvidence: null, label: 'Email', value: 'rodrigo.valdelvira@gmail.com', displayValue: 'rodrigo.valdelvira@gmail.com', href: 'mailto:rodrigo.valdelvira@gmail.com' },
    phone: { kind: 'phone', approval: 'pending', approvalEvidence: null, label: 'Teléfono', value: '+34 653 850 674', displayValue: '+34 653 850 674', href: 'tel:+34653850674' },
    linkedin: { kind: 'linkedin', approval: 'pending', approvalEvidence: null, label: 'LinkedIn', value: 'in/rovaldel', displayValue: 'in/rovaldel', href: 'https://www.linkedin.com/in/rovaldel' },
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
    sourceHash: 'f6ea4c9ce436fd29632268eeec8827c29a352b6b4cdb2544679525222106d6fd',
    fallbackLabel: 'Retrato de Rodrigo Valdelvira no disponible',
  } satisfies ImageAsset,
} as const;

export const experiences: Experience[] = [
  {
    id: 'cidatum', current: true, order: 1, provenance: ['docs/ESPECIFICACION_MAESTRA.md#5.2'], role: 'Ingeniero de Inteligencia Artificial', organization: 'Cidatum', location: 'Logroño', workMode: 'presencial', start: '2025-12', end: null,
    highlights: ['Formación y capacitación en IA para el centro, socios estratégicos y empresas externas.', 'Consultoría estratégica de IA: evaluación, viabilidad e implantación de soluciones.', 'Desarrollo a medida de sistemas y arquitecturas de IA para clientes.'],
  },
  {
    id: 'talenttools', current: false, order: 2, provenance: ['docs/ESPECIFICACION_MAESTRA.md#5.2', 'docs/ESPECIFICACION_MAESTRA.md#5.3'], role: 'Data Scientist · AI Engineer · Project Manager', organization: 'TalentTools', location: 'Logroño', workMode: 'remoto', start: '2021-04', end: '2025-12',
    highlights: ['InclunIA (Fundación ONCE): coordinación, desarrollo y despliegue en Azure/GCP del sistema de recomendación de demandantes y ofertas.', 'Habla con InclunIA: técnico de selección virtual basado en LLMs para facilitar el reclutamiento inclusivo.', 'Clara (UPSA): diseño e implementación del chatbot Orientador Profesional basado en LLMs.', '2KBot: recomendador colaborativo híbrido para optimizar el matching entre perfil profesional y ocupaciones.', 'Dat4me: pipelines de datos para analítica, visualización y entrenamiento de modelos.', 'Reducción del 65 % en el tiempo de análisis de datos de talento.'],
  },
  {
    id: 'cmp', current: false, order: 3, provenance: ['docs/ESPECIFICACION_MAESTRA.md#5.2'], role: 'Ingeniero de Diseño y Desarrollo de Producto', organization: 'CMP Automotive Group', location: 'Logroño', workMode: 'presencial', start: '2012-09', end: '2021-04',
    highlights: ['Gestión técnica de nuevos productos antivibratorios, de la oferta a producción.', 'Diseño CAD 3D y análisis FEA de componentes mecánicos.'],
  },
  {
    id: 'pope', current: false, order: 4, provenance: ['docs/ESPECIFICACION_MAESTRA.md#5.2'], role: 'Ingeniero de Instalaciones', organization: 'POPE Building Services Consulting Engineers', location: 'Chichester, UK', workMode: 'presencial', start: '2012-07', end: '2012-08',
    highlights: ['Planos y cálculos de instalaciones HVAC, ACS y saneamiento.'],
  },
  {
    id: 'gi-teneco', current: false, order: 5, provenance: ['docs/ESPECIFICACION_MAESTRA.md#5.2'], role: 'Investigador', organization: 'GI-TENECO', location: 'Logroño', workMode: 'presencial', start: '2011-09', end: '2012-12',
    highlights: ['Análisis del consumo energético y del potencial de biomasa y residuos aprovechables en La Rioja.'],
  },
];

export const education: EducationRecord[] = [
  { id: 'aenor', startYear: 2026, endYear: 2026, order: 1, provenance: ['docs/ESPECIFICACION_MAESTRA.md#5.2'], title: 'Especialista implantador ISO 42001 (IA Responsable)', institution: 'AENOR', years: '2026', description: 'Especialización en implantación de sistemas de gestión de IA responsable, evaluación de riesgos y cumplimiento normativo.' },
  { id: 'uemc', startYear: 2020, endYear: 2021, order: 2, provenance: ['docs/ESPECIFICACION_MAESTRA.md#5.2'], title: 'Máster oficial en Big Data', institution: 'UEMC · Universidad Europea Miguel de Cervantes', years: '2020–2021', description: 'Analítica avanzada, machine learning y arquitecturas de datos a gran escala.' },
  { id: 'goethe', startYear: 2017, endYear: 2017, order: 3, provenance: ['docs/ESPECIFICACION_MAESTRA.md#5.2'], title: 'Goethe-Zertifikat B1', institution: 'Carl Duisberg Centren · Berlín', years: '2017', description: 'Certificación oficial de nivel B1 de alemán.' },
  { id: 'cambridge', startYear: 2012, endYear: 2012, order: 4, provenance: ['docs/ESPECIFICACION_MAESTRA.md#5.2'], title: 'Cambridge Advanced C1', institution: 'Chichester College · Reino Unido', years: '2012', description: 'Certificación C1 de inglés y práctica profesional en ingeniería.' },
  { id: 'industrial', startYear: 2009, endYear: 2011, order: 5, provenance: ['docs/ESPECIFICACION_MAESTRA.md#5.2'], title: 'Ingeniería Industrial', institution: 'Universidad de La Rioja', years: '2009–2011', description: 'Procesos, diseño de producto y gestión de proyectos técnicos.' },
  { id: 'mecanica', startYear: 2005, endYear: 2009, order: 6, provenance: ['docs/ESPECIFICACION_MAESTRA.md#5.2'], title: 'Ingeniería Técnica Industrial, especialidad Mecánica', institution: 'Universidad de La Rioja', years: '2005–2009', description: 'Base en diseño mecánico, cálculo estructural y modelado CAD.' },
] as const;

export const skillGroups = [
  { id: 'ia', order: 1, provenance: ['docs/ESPECIFICACION_MAESTRA.md#5.2'], name: 'IA / Machine Learning', skills: [{ name: "LangGraph", order: 1, level: 5 }, { name: "LangChain", order: 2, level: 5 }, { name: "RAG", order: 3, level: 5 }, { name: "Scikit-learn", order: 4, level: 5 }, { name: "PyTorch", order: 5, level: 4 }, { name: "Hugging Face", order: 6, level: 4 }] },
  { id: 'datos', order: 2, provenance: ['docs/ESPECIFICACION_MAESTRA.md#5.2'], name: 'Datos / MLOps', skills: [{ name: "Python", order: 1, level: 5 }, { name: "Pandas", order: 2, level: 5 }, { name: "FastAPI", order: 3, level: 5 }, { name: "Docker", order: 4, level: 4 }, { name: "BigQuery", order: 5, level: 4 }, { name: "PostgreSQL", order: 6, level: 4 }] },
  { id: 'cloud', order: 3, provenance: ['docs/ESPECIFICACION_MAESTRA.md#5.2'], name: 'Backend · Cloud', skills: [{ name: "Flask", order: 1, level: 4 }, { name: "Microservicios", order: 2, level: 4 }, { name: "Azure", order: 3, level: 4 }, { name: "GCP", order: 4, level: 4 }, { name: "Node.js", order: 5, level: 3 }] },
  { id: 'desarrollo', order: 4, provenance: ['docs/ESPECIFICACION_MAESTRA.md#5.2'], name: 'Agentes de IA · desarrollo', skills: [{ name: "Claude Code", order: 1, level: 5 }, { name: "Codex", order: 2, level: 4 }, { name: "Cursor", order: 3, level: 4 }, { name: "Harness de desarrollo agéntico", order: 4, level: 4 }, { name: "MCP (Model Context Protocol)", order: 5, level: 4 }] },
] as const;

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
    "status": "working-draft",
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
        "body": "El sitio está alojado en una VPS de Hetzner. Los mensajes se envían mediante una conexión cifrada al servicio SMTP de Gmail y se reciben en el buzón de Rodrigo Valdelvira. Hetzner y Google intervienen en la prestación de estos servicios; no se venden datos ni se comunican para publicidad. Las autoridades podrán recibir información cuando exista una obligación legal. El uso de los servicios de Google puede implicar tratamiento fuera del Espacio Económico Europeo: las condiciones, ubicaciones y garantías aplicables a la cuenta utilizada deben verificarse antes de publicar esta política."
      },
      {
        "title": "Conservación de los datos",
        "body": "El servidor de la aplicación no almacena el contenido del formulario en una base de datos. Los mensajes entregados permanecen en el buzón. Se propone su eliminación a los 12 meses desde la última comunicación, salvo que continúe un proceso de selección o sea necesario conservarlos para atender obligaciones o reclamaciones. Este plazo requiere aplicación efectiva por el titular y revisión de la retención del buzón y sus copias antes de publicar la política."
      },
      {
        "title": "Seguridad y registros técnicos",
        "body": "La aplicación mantiene temporalmente en memoria un identificador derivado de la IP para limitar envíos durante 15 minutos y un identificador de envío durante 2 minutos para evitar duplicados; se purgan al procesar nuevas solicitudes o al reiniciar el proceso. Los mensajes no se incluyen en los registros de aplicación. El proxy, el servidor y el proveedor de alojamiento pueden generar registros técnicos adicionales; su configuración, accesos y plazos deben revisarse antes de publicar."
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
    "status": "working-draft",
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
    "status": "working-draft",
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
        "body": "La información describe la trayectoria y los proyectos en el estado indicado. Nami se encuentra en fase de diseño; Toolkit IA y Bitácora están en preparación. Los enlaces a terceros se facilitan como referencia. El titular procurará corregir errores y mantener la información actualizada, sin excluir las responsabilidades que legalmente le correspondan."
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
] as const;
