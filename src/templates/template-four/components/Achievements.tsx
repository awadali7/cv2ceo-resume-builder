import { HTMLRenderer } from "@/helpers/common/components/HTMLRenderer";
import { SectionHeading } from "../atoms/SectionHeading";
import { SectionList } from "../atoms/SectionList";
import { useRef } from "react";
import { useExperiences } from "../../../stores/experience";
import { scrollToElement } from "../../../helpers/utils/index";

export const AchievementSection = ({
  achievements,
}: {
  achievements: string;
}) => {
  const certificatesRef = useRef<null | HTMLDivElement>(null);
  useExperiences.subscribe(() => {
    scrollToElement(certificatesRef);
  });

  console.log(achievements); // Debugging

  return (
    <div className="mb-3" ref={certificatesRef}>
      <SectionHeading title="Achievements & Extra-Curricular Activities" />

      <div className="py-1 mb-4">
        <SectionList>
          <HTMLRenderer htmlString={achievements} />
        </SectionList>
      </div>
    </div>
  );
};
