import { useEffect, useRef, useState } from "react";

export const SectionText = ({
  children,
}: {
  children: JSX.Element | string;
}) => {
  const textRef = useRef<HTMLDivElement>(null);
  const [spans, setSpans] = useState<number>(0);
  const spanGap = 5; // Adjust this value for the spacing between spans

  useEffect(() => {
    if (textRef.current) {
      const totalHeight = textRef.current.clientHeight;

      setSpans(Math.floor(totalHeight / spanGap)); // Calculate how many spans fit in the height
    }
  }, [children]);

  return (
    <div className="relative flex  py-1.5 overflow-hidden">
      {/* Left-side span markers filling the full height */}
      <div className="absolute left-0  h-full flex flex-col">
        {Array.from({ length: spans }).map((_, index) => (
          <span
            key={index}
            className="block w-[1px] h-[3px]  bg-black mb-[2px]"
          ></span>
        ))}
      </div>
      {/* Text Content */}
      <div ref={textRef} className="text-sm pl-4 whitespace-pre-line">
        {children}
      </div>
    </div>
  );
};
