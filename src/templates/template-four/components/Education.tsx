import { dateParser } from "@/helpers/utils";
import { SectionHeading } from "../atoms/SectionHeading";
import { SectionSubtitle } from "../atoms/SectionSubtitle";
import { SectionTitle } from "../atoms/SectionTitle";
import { useRef } from "react";
import { useExperiences } from "../../../stores/experience";
import { scrollToElement } from "../../../helpers/utils/index";
import { IEducationItem } from "@/stores/education.interface";

export const EducationSection = ({
  experience,
}: {
  experience: IEducationItem[];
}) => {
  const experienceRef = useRef<null | HTMLDivElement>(null);
  useExperiences.subscribe(() => {
    scrollToElement(experienceRef);
  });

  return (
    <div className="mb-3" ref={experienceRef}>
      <SectionHeading title="Education" />

      {experience.map((item: IEducationItem, index: number) => {
        console.log(item, "item ================>");

        return (
          <div key={index} className="py-1 mb-4">
            {/* <SectionTitle label={item.name} /> */}
            <SectionTitle label={item.studyType} />
            <SectionSubtitle label={item.institution} />
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs uppercase">
                  {dateParser(item.startDate)} -{" "}
                  {item.isStudyingHere ? "present" : dateParser(item.endDate)}
                </p>
              </div>
            </div>

            {/* <SectionList>
              <HTMLRenderer htmlString={item.summary} />
            </SectionList> */}
          </div>
        );
      })}
    </div>
  );
};
