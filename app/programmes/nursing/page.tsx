// app/programmes/nursing/page.tsx

import ProgressTracker from "@/components/ProgressTracker";
import { AUT_NURSING_COURSE_REQUIREMENTS  } from "./constants";
import type { ProgrammeData } from "@/programmes/types";

const programmeData: ProgrammeData = {
  programmeName: "AUT Nursing Course Requirements",
  courses: AUT_NURSING_COURSE_REQUIREMENTS,
  totalPoints: AUT_NURSING_COURSE_REQUIREMENTS.reduce((sum, c) => sum + c.points, 0),
};

export default function NursingPage() {
  return <ProgressTracker programmeData={programmeData} />;
}
