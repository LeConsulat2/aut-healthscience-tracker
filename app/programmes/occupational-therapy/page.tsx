// app/programmes/nursing/page.tsx

import ProgressTracker from "@/components/ProgressTracker";
import { AUT_OCCUPATIONAL_THERAPY_COURSE_REQUIREMENTS, TOTAL_GRADUATION_POINTS_OT  } from "./constants";
import type { ProgrammeData } from "@/programmes/types";

const programmeData: ProgrammeData = {
  programmeName: "AUT Occupational Therapy Course Requirements",
  courses: AUT_OCCUPATIONAL_THERAPY_COURSE_REQUIREMENTS,
  totalPoints: TOTAL_GRADUATION_POINTS_OT,
};

export default function OccupationalTherapyPage() {
  return <ProgressTracker programmeData={programmeData} />;
}
