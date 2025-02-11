// import { EducationSection } from './components/Education';
// import { VolunteerSection } from './components/Volunteer';
// import { Objective } from './components/Objective';
// import { SkillsSection } from './components/Skills';
// import { SummarySection } from './components/Summary';
// import { WorkSection } from './components/Work';
// import { AwardSection } from './components/Awards';
import { useContext } from "react";
import { StateContext } from "@/modules/builder/resume/ResumeLayout";
import { SectionValidator } from "@/helpers/common/components/ValidSectionRenderer";
import { SummarySection } from "../modern/components/Summary";
import { WorkSection } from "../modern/components/Work";
import { AwardSection } from "../modern/components/Awards";
import { EducationSection } from "../modern/components/Education";
import { VolunteerSection } from "../modern/components/Volunteer";

import { DottedComponent } from "./components/DottedComponent";
import { DottedSkills } from "./components/DottedSkills";

export default function ForthTemplate() {
  const resumeData = useContext(StateContext);

  // Provide sensible defaults to avoid runtime errors.
  const basics = resumeData?.basics || {};
  const skills = resumeData?.skills || {};
  const work = resumeData?.work || [];
  const awards = resumeData?.awards || [];
  const education = resumeData?.education || [];
  const volunteer = resumeData?.volunteer || [];

  return (
    <div className="">
      {/* <BasicIntro
                name={basics.name || ""}
                label={basics.label || ""}
                url={basics.url || ""}
                email={basics.email || ""}
                city={basics.location?.city || ""}
                phone={basics.phone || ""}
                image={basics.image || ""}
                profiles={basics.profiles || []}
            /> */}
      <div className="flex">
        <div className="basis-[30%] bg-[#D7D7D7] h-full ">
          <SectionValidator value={basics.image}>
            <img
              src={basics.image || ""}
              alt={basics.name || ""}
              className="w-full"
            />
          </SectionValidator>
          <div className="px-6 py-2">
            <SectionValidator value={basics.name}>
              <h1 className="text-xl font-light mb-1">{basics.name || ""}</h1>
              <p className="mb-2">{basics.label || ""}</p>
            </SectionValidator>

            <SectionValidator value={basics.phone}>
              <p className="text-xs">{basics.phone || ""}</p>
            </SectionValidator>
            <SectionValidator value={basics.email}>
              <p className="text-xs">{basics.email || ""}</p>
            </SectionValidator>
            <SectionValidator value={basics?.location?.city}>
              <p className="text-xs">{basics.location?.city || ""}</p>
            </SectionValidator>

            <SectionValidator value={basics?.summary}>
              <div className="mt-3">
                <DottedComponent
                  content={basics?.summary || ""}
                  heading="ABOUT ME"
                />
              </div>
            </SectionValidator>

            <SectionValidator value={basics?.summary}>
              <div className="mt-3">
                <DottedSkills content={skills || ""} heading="SKILLS" />
              </div>
            </SectionValidator>

            {/* <SectionValidator value={skills.frameworks}>
                            <SkillsSection
                                title="Frameworks & Libraries"
                                list={(skills.frameworks || []).concat(
                                    skills.libraries || []
                                )}
                            />
                        </SectionValidator> */}

            <SectionValidator value={education}>
              <EducationSection education={education} />
            </SectionValidator>

            <SectionValidator value={volunteer}>
              <VolunteerSection volunteer={volunteer} />
            </SectionValidator>
          </div>
        </div>
        <div className="basis-[70%] p-3">
          <SectionValidator value={basics.summary}>
            <SummarySection summary={basics.summary || ""} />
          </SectionValidator>

          <SectionValidator value={work}>
            <WorkSection experience={work} />
          </SectionValidator>

          <SectionValidator value={awards}>
            <AwardSection awardsReceived={awards} />
          </SectionValidator>
        </div>
      </div>
    </div>
  );
}
