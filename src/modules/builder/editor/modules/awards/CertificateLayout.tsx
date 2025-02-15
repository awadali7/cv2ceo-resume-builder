import { useEffect, useState } from "react";
import { useCertificates } from "@/stores/certificate";
import AddCertificate from "./components/AddCertificate";
import AwardComponent from "./components/Award";

import MoveEditSection from "@/helpers/common/components/MoveEditSectionContainer";

const CertificateLayout = () => {
  const allCertificate = useCertificates((state) => state.certificates);
  const removeEducation = useCertificates.getState().remove;
  const onMoveUp = useCertificates.getState().onmoveup;
  const onMoveDown = useCertificates.getState().onmovedown;

  const [expanded, setExpanded] = useState<string | false>(false);

  useEffect(() => {
    setExpanded(allCertificate[0]?.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (panel: string, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <div className="flex flex-col gap-8 mb-8">
      {allCertificate.map((certificate, index) => (
        <MoveEditSection
          key={certificate.id}
          title={certificate.title || "Certificates"}
          expanded={expanded === certificate.id}
          length={allCertificate.length}
          index={index}
          clickHandler={() =>
            handleChange(certificate.id, expanded !== certificate.id)
          }
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
          onDelete={removeEducation}
        >
          <AwardComponent awardInfo={certificate} currentIndex={index} />
        </MoveEditSection>
      ))}
      <AddCertificate
        handleChange={handleChange}
        isEmpty={allCertificate.length === 0}
      />
    </div>
  );
};

export default CertificateLayout;
