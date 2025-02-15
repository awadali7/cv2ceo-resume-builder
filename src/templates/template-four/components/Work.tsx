import { dateParser } from "@/helpers/utils";
import { HTMLRenderer } from "@/helpers/common/components/HTMLRenderer";
import { IWorkIntrf } from "@/stores/index.interface";
import { SectionHeading } from "../atoms/SectionHeading";
import { SectionList } from "../atoms/SectionList";
import { SectionSubtitle } from "../atoms/SectionSubtitle";
import { SectionTitle } from "../atoms/SectionTitle";
import { useRef } from "react";
import { useExperiences } from "../../../stores/experience";
import { scrollToElement } from "../../../helpers/utils/index";

export const WorkSection = ({ experience }: { experience: IWorkIntrf[] }) => {
  const experienceRef = useRef<null | HTMLDivElement>(null);
  useExperiences.subscribe(() => {
    scrollToElement(experienceRef);
  });

  return (
    <div className="mb-3" ref={experienceRef}>
      <SectionHeading title="WORK EXPERIENCE" />

      {experience.map((item: IWorkIntrf, index: number) => {
        console.log(item, "item ================>");

        return (
          <div key={index} className="py-1 mb-4">
            {/* <SectionTitle label={item.name} /> */}
            <SectionTitle label={item.position} />
            <SectionSubtitle label={item.name} />
            <div className="flex justify-between mb-4 items-center">
              <div>
                <p className="text-xs uppercase">
                  {dateParser(item.startDate)} -{" "}
                  {item.isWorkingHere ? "present" : dateParser(item.endDate)}
                </p>
              </div>
            </div>

            <SectionList>
              <HTMLRenderer htmlString={item.summary} />
            </SectionList>
          </div>
        );
      })}
    </div>
  );
};
