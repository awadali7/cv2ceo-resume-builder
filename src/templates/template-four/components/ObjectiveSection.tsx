import { SectionHeading } from "../atoms/SectionHeading";
import { SectionText } from "../atoms/SectionText";
import { HTMLRenderer } from "./HTMLRenderer";

export const ObjectiveSection = ({ objective }: { objective: string }) => {
  return (
    <div className="mb-3">
      <SectionHeading title="CAREER OBJECTIVE" />
      <SectionText>
        <HTMLRenderer htmlString={objective} />
      </SectionText>
    </div>
  );
};
