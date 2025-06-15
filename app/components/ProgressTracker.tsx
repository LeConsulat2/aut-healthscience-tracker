"use client";
import { CourseStatusType, CustomCourse, ProgressTrackerProps } from "../programmes/types";
import { ReactElement, useCallback, useState, useEffect } from "react";
import {
  GraduationCap,
  Plus,
  X,
  CheckCircle
} from "lucide-react";

// 성적 등급 상수 (PDF 업로드 기능을 위해 유지)
const PASSING_GRADES = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'P'];
const FAILING_GRADES = ['C-', 'D+', 'D', 'D-', 'F'];

const ProgressTracker = ({ programmeData }: ProgressTrackerProps): ReactElement => {
  const { courses, totalPoints, programmeName } = programmeData;

  // 미리 정의된 코스들의 상태 먼저 체크하기
  const [courseStatuses, setCourseStatuses] = useState<CourseStatusType[]>(() =>
    courses.map(course => ({
      code: course.code,
      status: 'not-started' as const
    }))
  );

  // Manually 추가 된 Custom courses들
  const [customCourses, setCustomCourses] = useState<CustomCourse[]>([]);

  // Manually 추가된 Form 상태
  const [manualCourseCode, setManualCourseCode] = useState('');
  const [manualCourseName, setManualCourseName] = useState('');
  const [manualCoursePoints, setManualCoursePoints] = useState('');

  ///// ADDED: track total points and progress percentage
  const [currentTotalPoints, setCurrentTotalPoints] = useState<number>(0); ///// added
  const [progressPercentage, setProgressPercentage] = useState<number>(0); ///// added

  // 코스 status를 업데이트하는 함수 (토글 방식)
  // @params {string} courseCode - 업데이트할 코스의 코드
  const updateCourseStatus = useCallback((courseCode: string) => {
    setCourseStatuses(prevStatuses =>
      prevStatuses.map(course => {
        if (course.code === courseCode) {
          // 토글: passed이면 not-started로, not-started면 passed로
          return {
            ...course,
            status: course.status === 'passed' ? 'not-started' : 'passed'
          };
        }
        return course;
      })
    );
  }, []);

  // 수동으로 입력한 코스를 추가하는 함수
  const handleAddCustomCourse = (event: React.FormEvent) => {
    event.preventDefault();
    const points = Number(manualCoursePoints);

    if ((manualCourseCode || manualCourseName) && points > 0) {
      const existingCustomCourseIndex = customCourses.findIndex(
        course => course.code === manualCourseCode
      );

      if (existingCustomCourseIndex !== -1) {
        // 기존 커스텀 코스 업데이트
        setCustomCourses(prevCourses =>
          prevCourses.map((course, index) =>
            index === existingCustomCourseIndex
              ? { ...course, name: manualCourseName, points }
              : course
          )
        );
      } else {
        // 새로운 커스텀 코스 추가
        setCustomCourses(prevCourses => [
          ...prevCourses,
          {
            code: manualCourseCode,
            name: manualCourseName,
            points,
            status: 'not-started',
            isCustom: true
          }
        ]);
      }

      // Form 초기화
      setManualCourseCode('');
      setManualCourseName('');
      setManualCoursePoints('');
    } else {
      alert('Please enter a valid course code and points (points must be greater than 0).');
    }
  };

  // 커스텀 코스를 제거하는 함수
  const handleRemoveCustomCourse = (index: number): void => {
    setCustomCourses(prevCourses => prevCourses.filter((_, i) => i !== index));
  };

  // 전체 포인트와 진행율을 계산하는 Effect
  useEffect(() => {
    let achievedPoints = 0;

    ///// CHANGED: iterate both predefined and custom courses
    [...courses, ...customCourses].forEach(course => { ///// modified line
      const status = courseStatuses.find(s => s.code === course.code);
      if (status?.status === 'passed') {
        achievedPoints += course.points;
      }
    });

    setCurrentTotalPoints(achievedPoints);
    setProgressPercentage((achievedPoints / totalPoints) * 100);
  }, [courseStatuses, customCourses, totalPoints]);

  // 모든 진행률을 리셋하는 함수
  const resetSheet = (): void => {
    if (
      window.confirm(
        'Are you sure you want to reset all progress? This action cannot be undone.'
      )
    ) {
      setCourseStatuses(
        courses.map(course => ({ code: course.code, status: 'not-started' as const }))
      );
      setCustomCourses([]);
    }
  };

  /**
   * 클립보드에서 데이터를 붙여넣어 코스 상태를 업데이트하는 함수
   * 예상 형식: Code | Course Name | Grade | Points
   */
  const pasteData = (event: React.ClipboardEvent<HTMLTextAreaElement>): void => {
    try {
      const pastedText = event.clipboardData.getData('text');
      const rows = pastedText.split('\n').filter(row => row.trim() !== '');

      const updatedCourseStatuses = [...courseStatuses];
      const updatedCustomCourses = [...customCourses];

      rows.forEach(row => {
        const [code, courseName, grade, pointsStr] = row
          .split('\t')
          .map(s => s.trim());
        if (!code || !grade) return;

        const points = Number(pointsStr) || 0;
        const status = PASSING_GRADES.includes(grade)
          ? ('passed' as const)
          : ('not-started' as const);

        // 미리 정의된 코스인지 확인
        const courseIndex = updatedCourseStatuses.findIndex(
          cs => cs.code === code
        );
        if (courseIndex !== -1) {
          updatedCourseStatuses[courseIndex] = {
            ...updatedCourseStatuses[courseIndex],
            status
          };
        } else {
          // 커스텀 코스 처리
          const customCourseIndex = updatedCustomCourses.findIndex(
            c => c.code === code
          );
          if (customCourseIndex !== -1) {
            // 기존 커스텀 코스 업데이트
            updatedCustomCourses[customCourseIndex] = {
              ...updatedCustomCourses[customCourseIndex],
              status,
              ...(courseName && { name: courseName }),
              points:
                points > 0
                  ? points
                  : updatedCustomCourses[customCourseIndex].points
            };
          } else if (courseName && points > 0) {
            // 새로운 커스텀 코스 추가
            updatedCustomCourses.push({ code, name: courseName, points, status, isCustom: true });
          }
        }
      });

      setCourseStatuses(updatedCourseStatuses);
      setCustomCourses(updatedCustomCourses);
    } catch (err) {
      console.error("Error pasting data:", err);
      alert(
        'Could not paste data. Please check clipboard permissions and ensure your data is in the correct format (tab-separated): Code | Course Name | Grade | Points'
      );
    }
  };

  // 패스한 모든 코스들 (필수 + 커스텀)
  const passedCourses = [
    ...courses.filter(course =>
      courseStatuses.find(s => s.code === course.code)?.status === 'passed'
    ),
    ...customCourses.filter(course => course.status === 'passed')
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <GraduationCap className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">{programmeName} Progress Tracker</h1>
          </div>
          <div className="flex gap-3">
            <button
              onClick={resetSheet}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Reset All Progress
            </button>
            <textarea
              placeholder="Paste course data here (tab-separated: Code | Name | Grade | Points)"
              onPaste={pasteData}
              rows={1}
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-80"
            />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Overall Progress</h2>
            <span className="text-2xl font-bold text-blue-600">
              {currentTotalPoints} / {totalPoints} Points
            </span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-6 mb-4">
            <div
              className="bg-gradient-to-r from-blue-500 to-green-500 h-6 rounded-full transition-all duration-500 ease-out flex items-center justify-end pr-2"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            >
              {progressPercentage > 10 && (
                <span className="text-white text-sm font-semibold">
                  {Math.round(progressPercentage)}%
                </span>
              )}
            </div>
          </div>

          <div className="text-center">
            {progressPercentage >= 100 ? (
              <p className="text-green-600 text-lg font-semibold">🎉 Congratulations! You are eligible to graduate!</p>
            ) : (
              <p className="text-gray-600">
                {Math.round(progressPercentage)}% Complete • {totalPoints - currentTotalPoints} points remaining
              </p>
            )}
          </div>
        </div>

        {/* …rest of JSX remains unchanged… */}
      </div>
    </div>
  );
};

export default ProgressTracker;
