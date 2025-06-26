"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface TechIconProps {
  techStack: string[];
  techIcons?: Array<{ tech: string; url: string }>;
}

const DisplayTechIcons = ({ techStack, techIcons = [] }: TechIconProps) => {
  // If techIcons is not provided, use the first 3 tech stack items to create icon data
  const iconsToShow = techIcons.length > 0 
    ? techIcons.slice(0, 3) 
    : techStack
        .filter(tech => tech && tech.trim() !== '') // Filter out empty or whitespace-only strings
        .slice(0, 3)
        .map(tech => ({
          tech,
          url: `/icons/tech/${tech.toLowerCase().trim().replace(/\s+/g, '-')}.svg`
        }));

  if (iconsToShow.length === 0) return null;

  return (
    <div className="flex flex-row">
      {iconsToShow.map(({ tech, url }, index) => (
        <div
          key={tech}
          className={cn(
            "relative group bg-dark-300 rounded-full p-2 flex flex-center",
            index >= 1 && "-ml-3"
          )}
        >
          <span className="tech-tooltip">{tech}</span>
          <Image
            src={url}
            alt={tech}
            width={100}
            height={100}
            className="size-5"
          />
        </div>
      ))}
    </div>
  );
};

export default DisplayTechIcons;