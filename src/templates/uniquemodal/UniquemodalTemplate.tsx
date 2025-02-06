// import { EducationSection } from './components/Education';
// import { VolunteerSection } from './components/Volunteer';
// import { Objective } from './components/Objective';
// import { SkillsSection } from './components/Skills';
// import { SummarySection } from './components/Summary';
// import { WorkSection } from './components/Work';
// import { AwardSection } from './components/Awards';
import { useContext } from 'react';
import { StateContext } from '@/modules/builder/resume/ResumeLayout';
import { SectionValidator } from '@/helpers/common/components/ValidSectionRenderer';
import { BasicIntro } from './components/BasicIntro';
import { SummarySection } from '../modern/components/Summary';
import { WorkSection } from '../modern/components/Work';
import { AwardSection } from '../modern/components/Awards';
import { Objective } from '../modern/components/Objective';
import { SkillsSection } from '../modern/components/Skills';
import { EducationSection } from '../modern/components/Education';
import { VolunteerSection } from '../modern/components/Volunteer';

export default function ModernTemplate() {
  const resumeData = useContext(StateContext);

  // Provide sensible defaults to avoid runtime errors.
  const basics = resumeData?.basics || {};
  const skills = resumeData?.skills || {};
  const work = resumeData?.work || [];
  const awards = resumeData?.awards || [];
  const education = resumeData?.education || [];
  const volunteer = resumeData?.volunteer || [];

  return (
    <div className="p-4">
      <BasicIntro
        name={basics.name || ''}
        label={basics.label || ''}
        url={basics.url || ''}
        email={basics.email || ''}
        city={basics.location?.city || ''}
        phone={basics.phone || ''}
        image={basics.image || ''}
        profiles={basics.profiles || []}
      />
      <div className="flex">
        <div className="basis-[40%] p-3">
          <SectionValidator value={basics.objective}>
            <Objective objective={basics.objective || ''} />
          </SectionValidator>

          <SectionValidator value={skills.languages}>
            <SkillsSection title="Languages" list={skills.languages || []} />
          </SectionValidator>

          <SectionValidator value={skills.technologies}>
            <SkillsSection title="Technologies" list={skills.technologies || []} />
          </SectionValidator>

          <SectionValidator value={skills.frameworks}>
            <SkillsSection
              title="Frameworks & Libraries"
              list={(skills.frameworks || []).concat(skills.libraries || [])}
            />
          </SectionValidator>

          <SectionValidator value={skills.tools}>
            <SkillsSection title="Tools" list={skills.tools || []} />
          </SectionValidator>

          <SectionValidator value={education}>
            <EducationSection education={education} />
          </SectionValidator>

          <SectionValidator value={volunteer}>
            <VolunteerSection volunteer={volunteer} />
          </SectionValidator>
        </div>
        <div className="basis-[60%] p-3">
          <SectionValidator value={basics.summary}>
            <SummarySection summary={basics.summary || ''} />
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
