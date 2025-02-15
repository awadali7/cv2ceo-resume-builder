import { Fragment, ReactNode, useMemo } from "react";
import { IExperienceItem } from "@/stores/experience.interface";
import { IEducationItem } from "@/stores/education.interface";
import { ICertificateItem } from "@/stores/certificate.interface";
import { IVolunteeringItem } from "@/stores/volunteering.interface";
import { ISkillItem } from "@/stores/skill.interface";

export const SectionValidator = ({
  value,
  children,
}: {
  value:
    | string
    | IExperienceItem[]
    | IEducationItem[]
    | ICertificateItem[]
    | IVolunteeringItem[]
    | ISkillItem[];
  children: ReactNode;
}) => {
  const isValid = useMemo(() => {
    return (value || "").length > 0;
  }, [value]);

  if (!isValid) {
    return null;
  }

  return <Fragment>{children}</Fragment>;
};
