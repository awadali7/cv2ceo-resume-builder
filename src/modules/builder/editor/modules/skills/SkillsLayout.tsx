import { useState } from "react";
import {
  useSoftSkills,
  useTechnicalSkills,
  useLanguages,
} from "@/stores/skills";
import EditSectionContainer from "@/helpers/common/components/EditSectionContainer";
import Skill from "./components/Skill";

const SkillsLayout = () => {
  const skillState = [useLanguages(), useSoftSkills(), useTechnicalSkills()];

  const [expanded, setExpanded] = useState<string | false>("Languages");

  const handleChange = (panel: string, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <div className="flex flex-col gap-8 mb-8">
      {skillState.map((state) => (
        <EditSectionContainer
          key={state.title}
          title={state.title}
          expanded={expanded === state.title}
          isEnabled={state.isEnabled}
          setIsEnabled={state.setIsEnabled}
          clickHandler={() =>
            handleChange(state.title, expanded !== state.title)
          }
        >
          <Skill
            items={state.values}
            addItem={state.add}
            removeItem={state.remove}
            editItem={state.edit}
            setItems={state.reset}
            hasLevel={state.hasLevel}
          />
        </EditSectionContainer>
      ))}
    </div>
  );
};

export default SkillsLayout;
