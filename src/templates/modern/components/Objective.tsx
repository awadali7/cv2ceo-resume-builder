import { SectionText } from "../atoms/SectionText";
import { HTMLRenderer } from "@/helpers/common/components/HTMLRenderer";

export const Objective = ({ objective }: { objective: string }) => {
  return (
    <>
      <div className="relative mb-1 text-base font-medium ">SKILLS</div>
      <SectionText>
        <HTMLRenderer htmlString={objective} />
      </SectionText>
    </>
  );
};
