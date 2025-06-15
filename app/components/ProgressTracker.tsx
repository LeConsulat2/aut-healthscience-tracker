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

  // track total points and progress percentage
  const [currentTotalPoints, setCurrentTotalPoints] = useState<number>(0);
  const [progressPercentage, setProgressPercentage] = useState<number>(0);

  // 코스 status를 업데이트하는 함수 (토글 방식)
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

  // 커스텀 코스 상태 업데이트 함수
  const updateCustomCourseStatus = useCallback((index: number) => {
    setCustomCourses(prevCourses =>
      prevCourses.map((course, i) => {
        if (i === index) {
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

    // 기본 코스들의 포인트 계산
    courses.forEach(course => {
      const status = courseStatuses.find(s => s.code === course.code);
      if (status?.status === 'passed') {
        achievedPoints += course.points;
      }
    });

    // 커스텀 코스들의 포인트 계산
    customCourses.forEach(course => {
      if (course.status === 'passed') {
        achievedPoints += course.points;
      }
    });

    setCurrentTotalPoints(achievedPoints);
    setProgressPercentage((achievedPoints / totalPoints) * 100);
  }, [courseStatuses, customCourses, courses, totalPoints]);

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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 왼쪽: 필수 코스 목록 */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Required Courses</h2>
            <div className="space-y-3">
              {courses.map((course) => {
                const status = courseStatuses.find(s => s.code === course.code);
                const isPassed = status?.status === 'passed';
                
                return (
                  <div
                    key={course.code}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      isPassed
                        ? 'border-green-500 bg-green-50 shadow-md'
                        : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm'
                    }`}
                    onClick={() => updateCourseStatus(course.code)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <CheckCircle
                            className={`w-6 h-6 ${
                              isPassed ? 'text-green-500' : 'text-gray-300'
                            }`}
                          />
                          <div>
                            <h3 className={`font-semibold ${
                              isPassed ? 'text-green-800' : 'text-gray-800'
                            }`}>
                              {course.code}
                            </h3>
                            <p className={`text-sm ${
                              isPassed ? 'text-green-600' : 'text-gray-600'
                            }`}>
                              {course.name}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className={`text-lg font-bold ${
                        isPassed ? 'text-green-600' : 'text-gray-500'
                      }`}>
                        {course.points} pts
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 오른쪽: 커스텀 코스 및 통계 */}
          <div className="space-y-6">
            {/* 커스텀 코스 추가 폼 */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Add Custom Course</h2>
              <form onSubmit={handleAddCustomCourse} className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Course Code (e.g., NURS101)"
                    value={manualCourseCode}
                    onChange={(e) => setManualCourseCode(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Course Name"
                    value={manualCourseName}
                    onChange={(e) => setManualCourseName(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    placeholder="Points"
                    value={manualCoursePoints}
                    onChange={(e) => setManualCoursePoints(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add Course
                </button>
              </form>
            </div>

            {/* 커스텀 코스 목록 */}
            {customCourses.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Custom Courses</h2>
                <div className="space-y-3">
                  {customCourses.map((course, index) => (
                    <div
                      key={`custom-${index}`}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                        course.status === 'passed'
                          ? 'border-green-500 bg-green-50 shadow-md'
                          : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div 
                          className="flex-1 cursor-pointer"
                          onClick={() => updateCustomCourseStatus(index)}
                        >
                          <div className="flex items-center gap-3">
                            <CheckCircle
                              className={`w-6 h-6 ${
                                course.status === 'passed' ? 'text-green-500' : 'text-gray-300'
                              }`}
                            />
                            <div>
                              <h3 className={`font-semibold ${
                                course.status === 'passed' ? 'text-green-800' : 'text-gray-800'
                              }`}>
                                {course.code}
                              </h3>
                              <p className={`text-sm ${
                                course.status === 'passed' ? 'text-green-600' : 'text-gray-600'
                              }`}>
                                {course.name}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-lg font-bold ${
                            course.status === 'passed' ? 'text-green-600' : 'text-gray-500'
                          }`}>
                            {course.points} pts
                          </span>
                          <button
                            onClick={() => handleRemoveCustomCourse(index)}
                            className="text-red-500 hover:text-red-700 p-1"
                            title="Remove course"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 통계 */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Statistics</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {courseStatuses.filter(s => s.status === 'passed').length + customCourses.filter(c => c.status === 'passed').length}
                  </div>
                  <div className="text-sm text-blue-800">Courses Completed</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {currentTotalPoints}
                  </div>
                  <div className="text-sm text-green-800">Points Earned</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">
                    {courses.length + customCourses.length - (courseStatuses.filter(s => s.status === 'passed').length + customCourses.filter(c => c.status === 'passed').length)}
                  </div>
                  <div className="text-sm text-yellow-800">Remaining Courses</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {totalPoints - currentTotalPoints}
                  </div>
                  <div className="text-sm text-purple-800">Points Needed</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;