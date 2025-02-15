import BasicLayout from "@/modules/builder/editor/modules/basic/BasicLayout";
import SkillsLayout from "@/modules/builder/editor/modules/skills/SkillsLayout";
import EducationLayout from "@/modules/builder/editor/modules/education/EducationLayout";
import ExperienceLayout from "@/modules/builder/editor/modules/experience/ExperienceLayout";
import ActivitiesLayout from "@/modules/builder/editor/modules/activities/ActivitiesLayout";
import CertificateLayout from "@/modules/builder/editor/modules/awards/CertificateLayout";

export const headers: {
  [key: string]: { title: string; component: () => JSX.Element };
} = {
  "basic-details": { title: "Basic details", component: BasicLayout },
  "skills-and-expertise": {
    title: "Skills and expertise",
    component: SkillsLayout,
  },
  education: { title: "Education", component: EducationLayout },
  experience: { title: "Experience", component: ExperienceLayout },
  activities: {
    title: "Achievements & Extra-Curricular Activities",
    component: ActivitiesLayout,
  },
  // volunteering: { title: "Volunteering", component: VolunteeringLayout },
  certificates: { title: "Certificate", component: CertificateLayout },
};
