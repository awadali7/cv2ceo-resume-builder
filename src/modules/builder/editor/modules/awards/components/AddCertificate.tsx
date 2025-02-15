import { useMemo } from "react";
import { OutlinedButton } from "@/helpers/common/atoms/Buttons";
import { useCertificates } from "@/stores/certificate";
import { ICertificateItem } from "@/stores/certificate.interface";

const NEW_CERTIFICATE: ICertificateItem = {
  title: "",
  certificater: "",
  date: null,
  summary: "",
  id: "",
};

const AddCertificate = ({
  handleChange,
  isEmpty,
}: {
  handleChange: (name: string, isExpanded: boolean) => void;
  isEmpty: boolean;
}) => {
  const addCertificateToStore = useCertificates((state) => state.add);

  const onCreateEducation = () => {
    const uniqueExpandedId = `${Math.random()}`;
    NEW_CERTIFICATE.id = uniqueExpandedId;
    addCertificateToStore(NEW_CERTIFICATE);
    handleChange(uniqueExpandedId, true);
  };

  const buttonCaption = useMemo(() => {
    if (isEmpty) {
      return "+ Add an certificate";
    } else {
      return "+ Add more";
    }
  }, [isEmpty]);

  return (
    <div className="flex gap-2 mt-3">
      <OutlinedButton onClick={onCreateEducation} disabled={false}>
        {buttonCaption}
      </OutlinedButton>
    </div>
  );
};

export default AddCertificate;
