import { dateParser } from "@/helpers/utils";
import { HTMLRenderer } from "@/helpers/common/components/HTMLRenderer";
import { ICertificate } from "@/stores/index.interface";
import { SectionHeading } from "../atoms/SectionHeading";
import { SectionList } from "../atoms/SectionList";
import { SectionSubtitle } from "../atoms/SectionSubtitle";
import { SectionTitle } from "../atoms/SectionTitle";
import { useRef } from "react";
import { useExperiences } from "../../../stores/experience";
import { scrollToElement } from "../../../helpers/utils/index";

export const CertificateSection = ({
  certificatesReceived,
}: {
  certificatesReceived: ICertificate[];
}) => {
  const certificatesRef = useRef<null | HTMLDivElement>(null);
  useExperiences.subscribe(() => {
    scrollToElement(certificatesRef);
  });

  return (
    <div className="mb-3" ref={certificatesRef}>
      <SectionHeading title="CERTIFICATE" />

      {certificatesReceived.map((item: ICertificate, index: number) => {
        return (
          <div key={index} className="py-1 mb-4">
            {/* <SectionTitle label={item.name} /> */}
            <SectionTitle label={item.title} />
            <SectionSubtitle label={item.certificater} />
            <div className="flex justify-between mb-4 items-center">
              <div>
                <p className="text-xs uppercase">{dateParser(item.date)}</p>
              </div>
            </div>

            <SectionList>
              <HTMLRenderer htmlString={item.summary} />
            </SectionList>
          </div>
        );
      })}
    </div>
  );
};
