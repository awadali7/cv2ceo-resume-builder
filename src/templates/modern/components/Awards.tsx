import { HTMLRenderer } from "@/helpers/common/components/HTMLRenderer";
import { ICertificate } from "@/stores/index.interface";
import { SectionHeading } from "../atoms/SectionHeading";
import { SectionList } from "../atoms/SectionList";
import { SectionSubtitle } from "../atoms/SectionSubtitle";
import { SectionTitle } from "../atoms/SectionTitle";
import { dateParser } from "@/helpers/utils";
import { useRef } from "react";
import { useCertificates } from "../../../stores/certificate";
import { scrollToElement } from "../../../helpers/utils/index";

export const AwardSection = ({
  certificatesReceived,
}: {
  certificatesReceived: ICertificate[];
}) => {
  const certificatesRef = useRef<null | HTMLDivElement>(null);
  useCertificates.subscribe(() => {
    scrollToElement(certificatesRef);
  });

  return (
    <div className="mb-2" ref={certificatesRef}>
      <SectionHeading title="Awards" />

      {certificatesReceived.map((award: ICertificate, index: number) => {
        return (
          <div key={index} className="pb-2">
            <SectionTitle label={award.title} />
            <div className="flex justify-between certificates-center">
              <SectionSubtitle label={award.certificater} />
              <div>
                <p className="text-xs">{dateParser(award.date)}</p>
              </div>
            </div>
            <SectionList>
              <HTMLRenderer htmlString={award.summary} />
            </SectionList>
          </div>
        );
      })}
    </div>
  );
};
