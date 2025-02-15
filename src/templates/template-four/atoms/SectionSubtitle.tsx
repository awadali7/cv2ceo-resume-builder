import styled from "@emotion/styled";

const SubTitle = styled.p``;
export const SectionSubtitle = ({ label }: { label: string }) => {
  return (
    <SubTitle className="text-[12px] font-regular uppercase">{label}</SubTitle>
  );
};
