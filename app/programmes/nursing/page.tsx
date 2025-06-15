// app/programmes/nursing/page.tsx

import ProgressTracker from "@/components/ProgressTracker";
import { AUT_NURSING_COURSE_REQUIREMENTS, TOTAL_GRADUATION_POINTS_NURSING  } from "./constants";
import type { ProgrammeData } from "@/programmes/types";

const programmeData: ProgrammeData = {
  programmeName: "AUT Nursing Course Requirements",
  courses: AUT_NURSING_COURSE_REQUIREMENTS,
  totalPoints: TOTAL_GRADUATION_POINTS_NURSING,
};

export default function NursingPage() {
  return <ProgressTracker programmeData={programmeData} />;
}
