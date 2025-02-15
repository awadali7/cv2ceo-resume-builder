import { Key } from "react";
import { SectionText } from "./SectionText";

export const DottedSkills = ({
  heading,
  content,
}: {
  heading: string;
  content: {
    name: string;
    level: number;
  }[];
}) => {
  return (
    <>
      <div className="relative mb-1 text-base font-medium">{heading}</div>
      <SectionText>
        <ul>
          {content.map((skill: { name: string }, index: Key) => (
            <li className="mb-2 text-[12px]" key={index}>
              {skill.name}
            </li>
          ))}
        </ul>
      </SectionText>
    </>
  );
};
