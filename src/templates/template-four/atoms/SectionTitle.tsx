export const SectionTitle = ({
  label,
  textSize,
}: {
  label: string;
  textSize?: string;
}) => {
  return (
    <p
      className={` ${textSize == "md" ? "text-md" : "text-[13px]"} uppercase font-semibold`}
    >
      {label}
    </p>
  );
};
