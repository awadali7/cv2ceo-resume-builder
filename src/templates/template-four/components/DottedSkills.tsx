import { SectionText } from "./SectionText";

export const DottedSkills = ({
  content,
  heading,
}: {
  content: {
    languages: { name: string; level?: string }[];
    frameworks: { name: string; level?: string }[];
    technologies: { name: string; level?: string }[];
    libaries: { name: string; level?: string }[];
    databases: { name: string; level?: string }[];
    tools: { name: string; level?: string }[];
    practices: { name: string; level?: string }[];
  };
  heading: string;
}) => {
  const skills = content?.languages.length
    ? content.languages
    : content?.frameworks.length
      ? content.frameworks
      : content?.technologies.length
        ? content.technologies
        : content?.libaries.length
          ? content.libaries
          : content?.databases.length
            ? content.databases
            : content?.tools.length
              ? content.tools
              : content?.practices.length
                ? content.practices
                : [];

  return (
    <>
      <div className="relative mb-1 text-base font-medium ">{heading}</div>
      <SectionText>
        <ul>
          {skills.map((skill, index) => (
            <li className="mb-2 text-[12px]" key={index}>
              {skill.name}
            </li>
          ))}
        </ul>
      </SectionText>
    </>
  );
};
