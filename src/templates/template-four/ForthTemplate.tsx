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
import { DottedComponent } from "./components/DottedComponent";
import { DottedSkills } from "./components/DottedSkills";
import { ObjectiveSection } from "./components/ObjectiveSection";
import { WorkSection } from "./components/Work";
import { EducationSection } from "./components/Education";
import { CertificateSection } from "./components/Certificate";
import { AchievementSection } from "./components/Achievements";
import Image from "next/image";

export default function ForthTemplate() {
  const resumeData = useContext(StateContext);

  console.log(resumeData, "resumeData ======>");

  // Provide sensible defaults to avoid runtime errors.
  const basics = resumeData?.basics || {};
  const skills = resumeData?.skills || {};
  const work = resumeData?.work || [];
  const certificates = resumeData?.certificates || [];
  const education = resumeData?.education || [];
  const activities = resumeData?.activities || [];

  return (
    <div className="">
      <div className="flex">
        <div className="basis-[30%] bg-[#D7D7D7] h-[296mm] ">
          <SectionValidator value={basics.image}>
            <Image
              src={basics.image || ""}
              alt={basics.name || ""}
              width={1000}
              height={1000}
              className="w-full h-[250px]"
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

            <SectionValidator value={skills?.languages}>
              <div className="mt-3">
                <DottedSkills
                  content={skills?.languages || ""}
                  heading="LANGUAGES"
                />
              </div>
            </SectionValidator>

            <SectionValidator value={skills?.softSkills}>
              <div className="mt-3">
                <DottedSkills
                  content={skills?.softSkills || ""}
                  heading="SOFT SKILLS"
                />
              </div>
            </SectionValidator>

            <SectionValidator value={skills?.technicalSkills}>
              <div className="mt-3">
                <DottedSkills
                  content={skills?.technicalSkills || ""}
                  heading="TECHNICAL SKILLS"
                />
              </div>
            </SectionValidator>
          </div>
        </div>
        <div className="basis-[70%] p-6">
          <SectionValidator value={basics.objective}>
            <ObjectiveSection objective={basics.objective || ""} />
          </SectionValidator>
          <SectionValidator value={work}>
            <WorkSection experience={work} />
          </SectionValidator>
          <SectionValidator value={education}>
            <EducationSection experience={education} />
          </SectionValidator>
          <SectionValidator value={certificates}>
            <CertificateSection certificatesReceived={certificates} />
          </SectionValidator>
          <SectionValidator value={activities?.achievements}>
            <AchievementSection achievements={activities?.achievements} />
          </SectionValidator>
        </div>
      </div>
    </div>
  );
}
