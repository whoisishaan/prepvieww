import { getTechLogos } from "@/lib/utils";
import DisplayTechIcons from "./DisplayTechIcons";

interface TechIconWrapperProps {
  techStack: string[];
}

const DisplayTechIconsWrapper = async ({ techStack }: TechIconWrapperProps) => {
  const techIcons = await getTechLogos(techStack);
  return <DisplayTechIcons techStack={techStack} techIcons={techIcons} />;
};

export default DisplayTechIconsWrapper;
