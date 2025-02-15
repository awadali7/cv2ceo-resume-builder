import {
  useSoftSkills,
  useTechnicalSkills,
  useLanguages,
} from "@/stores/skills";

import ResumeData from "@/helpers/constants/resume-data.json";
import { useActivity } from "./activity";
import { useCertificates } from "./certificate";
import { useBasicDetails } from "./basic";
import { useEducations } from "./education";
import { useExperiences } from "./experience";
import { useVoluteeringStore } from "./volunteering";

export const useResumeStore = () => {
  return {
    ...ResumeData,
    basics: useBasicDetails((state) => state.values),
    work: useExperiences((state) => state.experiences),
    education: useEducations((state) => state.academics),
    certificates: useCertificates((state) => state.certificates),
    volunteer: useVoluteeringStore((state) => state.volunteeredExps),
    skills: {
      languages: useLanguages((state) => state.get()),
      softSkills: useSoftSkills((state) => state.get()),
      technicalSkills: useTechnicalSkills((state) => state.get()),
    },
    activities: useActivity((state) => state.get()),
  };
};

/**
 * @description Reset all the stores
 */
export const resetResumeStore = () => {
  useBasicDetails.getState().reset(ResumeData.basics);
  useLanguages.getState().reset(ResumeData.skills.languages);
  useTechnicalSkills.getState().reset(ResumeData.skills.technicalSkills);
  useSoftSkills.getState().reset(ResumeData.skills.softSkills);
  useExperiences.getState().reset(ResumeData.work);
  useEducations.getState().reset(ResumeData.education);
  useVoluteeringStore.getState().reset(ResumeData.volunteer);
  useCertificates.getState().reset(ResumeData.certificates);
  useActivity.getState().reset(ResumeData.activities);
};
