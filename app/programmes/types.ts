
export interface Course {
    code: string;
    name: string;
    pathway: string;
    level: number;
    points: number;
}

export interface ProgrammeData {
    courses: Course[];
    totalPoints: number;
    programmeName: string;
}

export interface ProgressTrackerProps {
    programmeData: ProgrammeData;
}

export type CourseStatus = 'passed' | 'not-started'

export interface CourseStatusType {
    code: string;
    status: CourseStatus;
}

export interface CustomCourse {
    code: string;
    name?: string;
    points: number;
    status: CourseStatus;
    isCustom: boolean;
}