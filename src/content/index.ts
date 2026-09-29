import type { Locale } from '../lib/i18n';
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
import {
  educationEn,
  experiencesEn,
  internationalExperienceEn,
  legalDocumentsEn,
  navigationActionsEn,
  projectsEn,
  servicesEn,
  siteProfileEn,
  skillGroupsEn,
} from './site.en';

const editions = {
  es: {
    siteProfile,
    experiences,
    internationalExperience,
    education,
    skillGroups,
    services,
    projects,
    legalDocuments,
    navigationActions,
  },
  en: {
    siteProfile: siteProfileEn,
    experiences: experiencesEn,
    internationalExperience: internationalExperienceEn,
    education: educationEn,
    skillGroups: skillGroupsEn,
    services: servicesEn,
    projects: projectsEn,
    legalDocuments: legalDocumentsEn,
    navigationActions: navigationActionsEn,
  },
};

export type Content = typeof editions.es;

/** The public content in the requested language. Both editions share one structure. */
export const getContent = (locale: Locale): Content => editions[locale];
