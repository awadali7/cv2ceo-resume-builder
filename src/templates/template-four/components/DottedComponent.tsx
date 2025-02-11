import { HTMLRenderer } from "@/helpers/common/components/HTMLRenderer";
import { SectionText } from "./SectionText";

export const DottedComponent = ({
  content,
  heading,
}: {
  content: string;
  heading: string;
}) => {
  return (
    <>
      <div className="relative mb-1 text-base font-medium ">{heading}</div>
      <SectionText>
        <HTMLRenderer htmlString={content} />
      </SectionText>
    </>
  );
};
