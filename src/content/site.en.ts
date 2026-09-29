// English edition of the public content. Structure, identifiers, order, icons,
// images and contact channels come from the Spanish source in ./site.ts; only
// the wording is translated here, so the two editions cannot drift apart.
import {
  education,
  experiences,
  internationalExperience,
  legalDocuments,
  navigationActions,
  projects,
  services,
  siteProfile,
  skillGroups,
} from './site';
import type {
  EducationRecord,
  Experience,
  InternationalStay,
  LegalDocument,
  NavigationAction,
  Project,
  Service,
  SiteProfile,
  SkillGroup,
} from './site';

const translated = <T extends { id?: string; slug?: string }, K extends keyof T>(
  source: T[],
  overlay: Record<string, Pick<T, K>>,
  label: string,
): T[] =>
  source.map((item) => {
    const key = (item.id ?? item.slug)!;
    const patch = overlay[key];
    if (!patch) throw new Error(`Missing English translation for ${label}: ${key}`);
    return { ...item, ...patch };
  });

export const siteProfileEn: SiteProfile = {
  ...siteProfile,
  professionalSummary:
    'I design and take to production agents, chatbots and AI systems that solve real business problems.',
  totalExperienceLabel: '15+ years of total professional experience · Engineering + AI',
  experienceBadge: '15+ years · Engineering + AI',
  experienceFact: '15+ years of professional experience',
  location: 'Logroño, La Rioja · remote',
  availability: 'Available for professional opportunities remotely',
  languages: ['Spanish', 'English (C1)', 'German (B1)'],
  interests: ['applied AI', 'reliable data systems', 'product design and technical reading'],
  about: [
    [
      { text: "My name is " },
      { text: 'Rodrigo Valdelvira', emphasis: true },
      { text: " and I’m an " },
      { text: 'AI Engineer and Data Scientist', emphasis: true },
      {
        text: '. I started out as an industrial engineer and, over the years, that process-oriented mindset blended with code: today I build ',
      },
      { text: 'AI agents, chatbots and RAG systems', emphasis: true },
      { text: ' that actually reach production and solve real business problems. I code with the help of ' },
      { text: 'AI agents', emphasis: true },
      { text: ' (Claude Code, Codex) to move faster without losing rigour.' },
    ],
    [
      {
        text: "I’m not interested in pretty demos that end up in a drawer. I like to understand the problem, measure what matters and deliver something that works on Monday morning. I work with ",
      },
      { text: 'LangChain, LangGraph, Python and the cloud', emphasis: true },
      {
        text: ", and I enjoy translating complex AI into clear decisions for non-technical people. If you’re looking for someone who brings strategy, data and engineering together in one place, this is my corner.",
      },
    ],
  ],
  channels: {
    ...siteProfile.channels,
    phone: { ...siteProfile.channels.phone, label: 'Phone' },
  },
  portrait: {
    ...siteProfile.portrait,
    alt: 'Portrait of Rodrigo Valdelvira',
    fallbackLabel: 'Portrait of Rodrigo Valdelvira not available',
  },
};

type ExperienceText = Pick<
  Experience,
  'role' | 'organization' | 'organizationDetail' | 'location' | 'highlights' | 'achievements'
>;

const experienceText: Record<string, ExperienceText> = {
  cidatum: {
    role: 'Artificial Intelligence Engineer',
    organization: 'Cidatum',
    organizationDetail: 'Data Technology Centre',
    location: 'Logroño',
    highlights: [
      'ActivaIA Programme: leading the framework for diagnosing and adopting AI in companies: digital maturity, prioritisation of high-impact use cases, implementation roadmaps, Go/No-Go analysis and data governance.',
      'Custom technical development: design and implementation of AI systems, algorithms and architectures for specific client and industry needs, with agent-assisted development (Claude Code, Codex).',
      'Strategic AI consulting: advice on technical and business feasibility for adopting and integrating AI-based solutions.',
      'Training and upskilling: design and delivery of AI training programmes for the internal team, strategic partners and the business community.',
    ],
  },
  talenttools: {
    role: 'Data Scientist · AI Engineer · Project Manager',
    organization: 'TalentTools',
    location: 'Logroño',
    highlights: [
      'InclunIA: coordination, development and deployment on Azure/GCP of job-seeker/job-offer recommendation systems (Fundación ONCE).',
      'Habla con InclunIA: design and development of a virtual recruitment specialist based on LLMs, acting as an intelligent chatbot that interprets InclunIA system data to support inclusive recruitment processes (Fundación ONCE).',
      'Dat4me: development and maintenance of data pipelines for analytics, visualisation and model training (TalentTools).',
      'Clara: design and implementation of the LLM-based Career Guidance chatbot (UPSA).',
      '2KBot: development of a hybrid collaborative recommender that optimises the matching between professional profile and occupations (TalentTools).',
      'Data area coordination: definition of technical strategy, management of AI projects and evaluation of emerging technologies.',
    ],
    achievements: [
      'Reduced talent data analysis time by 65% through intelligent automation.',
      'Secure deployment on Azure/GCP of AI solutions interoperable with ERP/CRM.',
      'Interpretability and traceability built into recommendation models and chatbots (Habla con InclunIA).',
    ],
  },
  cmp: {
    role: 'Product Design and Development Engineer',
    organization: 'CMP Automotive Group',
    location: 'Logroño',
    highlights: [
      'Technical management of new anti-vibration products, from quotation to production.',
      '3D CAD design and FEA analysis of mechanical components.',
      'Coordination of manufacturing, testing and prototype validation.',
      'Technical follow-up with international customers throughout the development cycle.',
    ],
  },
  pope: {
    role: 'Building Services Engineer',
    organization: 'POPE',
    organizationDetail: 'Building Services Consulting Engineers',
    location: 'Chichester, UK',
    highlights: [
      'Production of drawings and calculations for HVAC, domestic hot water and drainage systems.',
      'Support in sizing renewable energy systems (solar thermal, PV, biomass, geothermal).',
    ],
  },
  'gi-teneco': {
    role: 'Researcher',
    organization: 'GI-TENECO',
    organizationDetail: 'Applied Thermodynamics, Energy and Construction Group',
    location: 'Logroño',
    highlights: [
      'Analysis of global and national energy consumption.',
      'Estimation of the potential of biomass and energy-recoverable waste in La Rioja.',
    ],
  },
};

export const experiencesEn: Experience[] = experiences.map((item) => {
  const patch = experienceText[item.id];
  if (!patch) throw new Error(`Missing English translation for experience: ${item.id}`);
  const { achievements, organizationDetail, ...rest } = { ...item, ...patch };
  return {
    ...rest,
    ...(organizationDetail ? { organizationDetail } : {}),
    ...(achievements ? { achievements } : {}),
  };
});

const internationalDuration: Record<string, string> = {
  chichester: '10 months',
  koblenz: '4 months',
  berlin: '2 months',
};

export const internationalExperienceEn: InternationalStay[] = internationalExperience.map((stay) => ({
  ...stay,
  duration: internationalDuration[stay.id]!,
}));

export const educationEn: EducationRecord[] = translated(
  education,
  {
    aenor: {
      title: 'ISO 42001 Implementation Specialist (Responsible AI)',
      institution: 'AENOR',
      years: '2026',
      description:
        'Specialisation in implementing responsible AI management systems, risk assessment and regulatory compliance.',
    },
    uemc: {
      title: 'Official Master’s in Big Data',
      institution: 'UEMC · Miguel de Cervantes European University',
      years: '2020–2021',
      description: 'Advanced analytics, machine learning and large-scale data architectures.',
    },
    goethe: {
      title: 'Goethe-Zertifikat B1',
      institution: 'Carl Duisberg Centren · Berlin',
      years: '2017',
      description: 'Official B1-level German certification.',
    },
    cambridge: {
      title: 'Cambridge Advanced C1',
      institution: 'Chichester College · United Kingdom',
      years: '2012',
      description: 'C1 English certification and professional practice in engineering.',
    },
    industrial: {
      title: 'Industrial Engineering',
      institution: 'University of La Rioja',
      years: '2009–2011',
      description: 'Processes, product design and technical project management.',
    },
    mecanica: {
      title: 'Technical Industrial Engineering, Mechanical specialisation',
      institution: 'University of La Rioja',
      years: '2005–2009',
      description: 'Foundations in mechanical design, structural calculation and CAD modelling.',
    },
  },
  'education',
);

const skillNames: Record<string, string> = {
  Microservicios: 'Microservices',
  'Harness de desarrollo agéntico': 'Agentic development harness',
};
const groupNames: Record<string, string> = {
  ia: 'AI / Machine Learning',
  datos: 'Data / MLOps',
  cloud: 'Backend · Cloud',
  desarrollo: 'AI agents · development',
};

export const skillGroupsEn: SkillGroup[] = skillGroups.map((group) => ({
  ...group,
  name: groupNames[group.id]!,
  skills: group.skills.map((skill) => ({ ...skill, name: skillNames[skill.name] ?? skill.name })),
}));

export const servicesEn: Service[] = translated(
  services,
  {
    'agentes-y-chatbots-ia': {
      title: 'AI agents and chatbots',
      summary: 'Conversational agents, assistants and LLM-based chatbots, ready for your users.',
      description:
        'I design and build conversational agents on top of LLMs (LangChain, LangGraph) that solve a business task end to end: customer service, lead qualification, guidance or internal support. It includes tool orchestration, conversation memory, integration with your systems (CRM, calendar, database) and quality control of the answers before going into production.',
      contactSubject: 'Enquiry about: AI agents and chatbots',
    },
    'ingenieria-de-datos': {
      title: 'Data engineering',
      summary: 'Reliable pipelines that move and transform your data without manual intervention.',
      description:
        'I build automated data pipelines: ingestion, cleaning, transformation and loading between your sources and your models or dashboards. The goal is for data to always arrive correct and on time, with no manual processes or intermediate spreadsheets that break over time.',
      contactSubject: 'Enquiry about: Data engineering',
    },
    'ml-y-modelos-predictivos': {
      title: 'ML and predictive models',
      summary: 'Machine learning models that anticipate, classify and recommend.',
      description:
        'I develop machine learning models for prediction, classification and recommendation tailored to your use case: from hybrid recommender systems to scoring or pattern-detection models. I cover everything from data exploration to model validation with business metrics, not just technical ones.',
      contactSubject: 'Enquiry about: ML and predictive models',
    },
    'mlops-y-produccion': {
      title: 'MLOps and production',
      summary: 'From notebook to production: containers, APIs and monitoring.',
      description:
        'I take models and agents from the notebook to a real production environment: containerisation (Docker), deployment on Azure/GCP, exposure through an API (FastAPI) and monitoring of performance and cost. That way the model keeps working well months after launch, not just on demo day.',
      contactSubject: 'Enquiry about: MLOps and production',
    },
    'analitica-y-visualizacion': {
      title: 'Analytics and visualisation',
      summary: 'Dashboards and analysis to decide with data, not intuition.',
      description:
        'I design bespoke dashboards and analyses that answer concrete business questions, not just display metrics. I work with BigQuery, PostgreSQL and the visualisation tools your team already uses, prioritising clarity over quantity of data.',
      contactSubject: 'Enquiry about: Analytics and visualisation',
    },
    'desarrollo-con-agentes-de-ia': {
      title: 'Development with AI agents',
      summary: 'I code with Claude Code and Codex to deliver faster without lowering the standard.',
      description:
        'I use AI development agents (Claude Code, Codex) as part of my daily programming workflow, within a harness that keeps quality control, review and traceability over what the agent writes. This speeds up the delivery of prototypes, integrations and pipelines without giving up readable, maintainable code.',
      contactSubject: 'Enquiry about: Development with AI agents',
    },
  },
  'service',
);

export const projectsEn: Project[] = translated(
  projects,
  {
    leadia: {
      statusLabel: 'Featured',
      client: 'Own product',
      role: 'AI Engineer',
      description:
        'AI voice agent that answers calls autonomously and automates lead management: it captures, qualifies and records the enquiry.',
      technologies: ['Voice agents', 'LLMs', 'FastAPI', 'AI telephony'],
    },
    nami: {
      statusLabel: 'In design phase',
      client: 'Own product',
      role: 'AI Engineer / Product',
      description:
        'Wellbeing and productivity app for adults with ADHD, designed together with a clinical team to help with real everyday tasks.',
      technologies: ['Product design', 'Clinical UX', 'CBT / ACT', 'Agent flows'],
    },
  },
  'project',
).map((project) => ({
  ...project,
  image: {
    ...project.image,
    alt:
      project.slug === 'leadia'
        ? 'Leadia interface, an AI voice agent'
        : 'Concept image of the Nami project',
    fallbackLabel: project.slug === 'leadia' ? 'Leadia image not available' : 'Nami image not available',
  },
}));

export const navigationActionsEn: NavigationAction[] = navigationActions.map((action) => {
  const text: Record<string, Pick<NavigationAction, 'label' | 'destination' | 'response'>> = {
    about: {
      label: 'About me',
      destination: '/en/about',
      response: 'A profile that combines engineering, data and AI applied to real problems.',
    },
    skills: {
      label: 'Skills',
      destination: '/en/skills',
      response: 'Technologies and practices I use, with an approximate level of proficiency.',
    },
    services: {
      label: 'Services',
      destination: '/en/services',
      response: 'Six concrete ways to work together, from data to production.',
    },
    projects: {
      label: 'Projects',
      destination: '/en/projects',
      response: 'Two projects: Leadia, available to explore, and Nami, in the design phase.',
    },
    experience: {
      label: 'Experience',
      destination: '/en/experience',
      response: 'Professional career in engineering, data and artificial intelligence.',
    },
    education: {
      label: 'Education',
      destination: '/en/education',
      response: 'Technical training, data, responsible AI and languages.',
    },
    contact: {
      label: 'Contact',
      destination: '/en/contact',
      response: "If you are looking for an AI Engineer for your team, let’s talk.",
    },
  };
  const patch = text[action.id];
  if (!patch) throw new Error(`Missing English translation for action: ${action.id}`);
  return { ...action, ...patch };
});

const legalText: Record<
  LegalDocument['kind'],
  Pick<LegalDocument, 'title' | 'kicker' | 'sections' | 'reviewedBy'>
> = {
  privacy: {
    title: 'Privacy',
    kicker: 'Your data, for a specific purpose',
    reviewedBy: 'portfolio owner',
    sections: [
      {
        title: 'Controller and contact',
        body: 'Rodrigo Valdelvira Ortigosa is the controller of the data collected at rodrigovaldelvira.com, a personal portfolio aimed at job opportunities. You can get in touch at rodrigo.valdelvira@gmail.com.',
      },
      {
        title: 'Data and purposes',
        body: 'The form asks for a name, email and message in order to reply to professional enquiries and job opportunities. The fields are necessary to deal with your enquiry; please do not include health data or other sensitive information. They are not used for advertising or to build profiles. The portfolio’s question explorer runs in your browser: your questions are not sent to an artificial intelligence provider or stored between visits.',
      },
      {
        title: 'Legal basis',
        body: 'General and professional enquiries are handled on the basis of the legitimate interest in maintaining communications initiated by the person writing (Article 6.1.f GDPR), limited to that purpose and subject to the right to object. When the enquiry requests steps prior to entering into a contract, Article 6.1.b GDPR applies. Protection against abuse and attacks is based on the legitimate interest in keeping the site secure.',
      },
      {
        title: 'Hosting, email and recipients',
        body: 'The site is hosted on a Hetzner VPS. Messages are sent over an encrypted connection to the Gmail SMTP service and are received in Rodrigo Valdelvira’s mailbox. Google states that its consumer services are usually provided from Google Ireland Limited to users in the EEA, although information may be processed on servers in other countries. For transfers, Google describes adequacy decisions, the EU-U.S. Data Privacy Framework for Google LLC and covered US affiliates, and standard contractual clauses where applicable. For this site’s destination account, it is assumed that operations continue under the standard EEA terms. Hetzner and Google are involved in providing these services; data is not sold or disclosed for advertising. Authorities may receive information where there is a legal obligation.',
      },
      {
        title: 'Data retention',
        body: 'The application server does not store the form content in a database. Delivered messages remain in the Gmail mailbox; the application does not configure automatic deletion and no specific maximum retention period is set. The owner may delete messages manually when they are no longer needed to handle the enquiry, manage an opportunity or respond to obligations or claims. Copies and processing within Gmail are governed by the terms applicable to the account. You can request erasure by writing to rodrigo.valdelvira@gmail.com.',
      },
      {
        title: 'Security and technical logs',
        body: 'The application temporarily keeps in memory an identifier derived from the IP address to limit submissions for 15 minutes and a submission identifier for 2 minutes to prevent duplicates; they are purged when new requests are processed or when the process restarts. Messages are not included in the application logs. The proxy records the source IP address, URI, user agent and referrer; its files rotate weekly, keeping four access logs and ten error logs. The Nginx Proxy Manager container uses the Docker json-file driver without explicit size or count limits. The server and the hosting provider may also generate technical logs.',
      },
      {
        title: 'Your rights',
        body: 'You can request access, rectification, erasure, objection, restriction of processing and, where applicable, portability by writing to rodrigo.valdelvira@gmail.com. Your identity will be verified proportionately when necessary. The response will normally be provided within one month, with the reasoned extensions provided for by the GDPR. You can also lodge a complaint with the Spanish Data Protection Agency (AEPD) at www.aepd.es.',
      },
      {
        title: 'Links and automated decisions',
        body: 'LinkedIn and project websites are independent sites with their own policies. Their embedded content is not loaded when you visit this portfolio. No automated decisions with legal effects are made and no profiles of visitors are built.',
      },
    ],
  },
  cookies: {
    title: 'Cookies and local storage',
    kicker: 'No analytics or advertising',
    reviewedBy: 'portfolio owner',
    sections: [
      {
        title: 'What this application uses',
        body: 'The application does not install analytics, advertising or tracking cookies. It serves its fonts, images and scripts from the site itself. It does not include tracking pixels or third-party videos, maps or widgets.',
      },
      {
        title: 'Appearance preference: rv_theme',
        body: 'When you choose a theme, rv_theme is saved in your browser’s local storage (localStorage). It is a first-party preference that only contains the name of the theme; it does not identify the visitor and is not automatically sent to the server. It remains until you change the selection or clear the site data. If you do not choose a theme, this preference is not written.',
      },
      {
        title: 'Why there is no consent banner',
        body: 'This preference makes it possible to remember a personalisation expressly requested by the user and is used exclusively for that. Under that configuration it is exempt from prior consent under Article 22.2 of the LSSI (Spanish Information Society Services Law). If non-essential technologies are added, they must be disclosed and remain disabled until the appropriate consent is obtained, with equivalent accept and reject options.',
      },
      {
        title: 'How to remove the preference',
        body: 'You can delete the data for rodrigovaldelvira.com from your browser’s privacy settings. The site will keep working and will go back to the Rioja theme. You can also change theme at any time from the selector in the header.',
      },
      {
        title: 'External services',
        body: 'External links only take you to the corresponding service when you activate them. Cookies used by those sites are governed by their own policies. The final configuration of the proxy and hosting must remain free of additional undeclared technologies.',
      },
    ],
  },
  terms: {
    title: 'Legal notice and terms of use',
    kicker: 'Portfolio information',
    reviewedBy: 'portfolio owner',
    sections: [
      {
        title: 'Owner and purpose',
        body: 'This portfolio belongs to Rodrigo Valdelvira Ortigosa. Contact: rodrigo.valdelvira@gmail.com. Domain: rodrigovaldelvira.com. Its purpose is to present experience, skills and projects to employers and hiring teams. The owner does not operate as a self-employed professional through the site. The services areas describe professional capabilities; they do not constitute an offer of hire or online sale.',
      },
      {
        title: 'Use of the site',
        body: 'You may browse the content, download the CV and get in touch about professional opportunities. You may not use the form for spam, to impersonate other people, to submit unlawful content or to interfere with the operation of the service. No registration is required and no payments are made on this website.',
      },
      {
        title: 'Intellectual property',
        body: 'The texts and materials of the site belong to Rodrigo Valdelvira Ortigosa. Trademarks, tools, images and third-party materials belong to their respective owners and are used under their permissions or licences. You may browse, link to and share the portfolio with attribution, and use the CV for selection processes; other uses must respect the rights and limits legally applicable.',
      },
      {
        title: 'Information and external links',
        body: 'The information describes the career and projects as stated. Nami is in the design phase; AI Toolkit is in preparation and Journal includes a public article about LangGraph. Links to third parties are provided for reference. The owner will endeavour to correct errors and keep the information up to date, without excluding the responsibilities that legally correspond to them.',
      },
      {
        title: 'Governing law and changes',
        body: 'Use of the site is subject to the Spanish and European rules that apply, without limiting users’ mandatory rights or imposing a jurisdiction other than the one legally competent. If the portfolio starts offering an economic activity of its own, the identification of the provider and the conditions must be updated before that activity begins.',
      },
    ],
  },
};

export const legalDocumentsEn: LegalDocument[] = legalDocuments.map((document) => ({
  ...document,
  ...legalText[document.kind],
}));
