"use client";
import { ReactElement, useCallback, useState, useEffect } from "react";
import { CourseStatusType, CustomCourse, ProgressTrackerProps } from "../programmes/types";
import {
  GraduationCap,
  Plus,
  CheckCircle,
  FileText,
  RotateCcw,
  Trash2,
  CloudUpload
} from "lucide-react";
import { pdfjs } from "react-pdf";

import type { PDFDocumentProxy } from 'pdfjs-dist/types/src/display/api';

type TextItem = {
    str: string;
};

// pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

function TranscriptUpload({
  onDetect
}: {
  onDetect: (fullText: string) => void;
}): ReactElement {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>("");

  const handleFile = async (file: File) => {
    if (!file) return;

    setIsProcessing(true);
    setUploadStatus("Processing PDF...");

    try {
      const data = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data }).promise;
      let text = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map((item) => (item as TextItem).str).join(" ") + "\n";
      }
      onDetect(text);
      setUploadStatus(`✓ Processed ${pdf.numPages} pages successfully!`);
      setTimeout(() => setUploadStatus(""), 3000);
    } catch (error: unknown) {
      console.error("Error processing PDF:", error);
      setUploadStatus("❌ Error processing PDF");
      setTimeout(() => setUploadStatus(""), 3000);
    }

    setIsProcessing(false);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };
  return (
    <div className="w-full">
      <div
        className={`relative border-2 border-dashed rounded-xl p-6 transition-all duration-200 ${
          isDragging
            ? "border-blue-400 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        } ${isProcessing ? "opacity-50 pointer-events-none" : ""}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isProcessing}
        />

        <div className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            {isProcessing ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            ) : (
              <CloudUpload className="w-8 h-8 text-blue-600" />
            )}
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Upload Academic Transcript
          </h3>

          <p className="text-sm text-gray-600 mb-4">
            Drag and drop your PDF transcript here, or click to browse
          </p>

          <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
            <span className="flex items-center">
              <FileText className="w-4 h-4 mr-1" />
              PDF only
            </span>
            <span>•</span>
            <span>Max 10MB</span>
          </div>

          {uploadStatus && (
            <div className="mt-4 text-sm font-medium">
              {uploadStatus}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const PASSING_GRADES = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "P"];

const ProgressTracker = ({
  programmeData
}: ProgressTrackerProps): ReactElement => {
  const { courses, programmeName, totalPoints } = programmeData;

  // state
  const [courseStatuses, setCourseStatuses] = useState<CourseStatusType[]>(
    () =>
      courses.map((c) => ({
        code: c.code,
        status: "not-started"
      }))
  );
  const [customCourses, setCustomCourses] = useState<CustomCourse[]>([]);
  const [manualCode, setManualCode] = useState("");
  const [manualName, setManualName] = useState("");
  const [manualPoints, setManualPoints] = useState("");
  const [currentTotalPoints, setCurrentTotalPoints] = useState(0);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // toggle built-in course
  const updateCourseStatus = useCallback((code: string) => {
    setCourseStatuses((prev) =>
      prev.map((r) =>
        r.code === code
          ? { ...r, status: r.status === "passed" ? "not-started" : "passed" }
          : r
      )
    );
  }, []);

  // toggle custom
  const updateCustomStatus = useCallback((idx: number) => {
    setCustomCourses((prev) =>
      prev.map((c, i) =>
        i === idx
          ? { ...c, status: c.status === "passed" ? "not-started" : "passed" }
          : c
      )
    );
  }, []);

  // remove custom course
  const handleRemoveCustomCourse = useCallback((idx: number) => {
    setCustomCourses((prev) => prev.filter((_, i) => i !== idx));
  }, []);

  // add custom
  const handleAddCustom = () => {
    const pts = Number(manualPoints);
    if ((manualCode || manualName) && pts > 0) {
      setCustomCourses((prev) => [
        ...prev,
        { code: manualCode, name: manualName, points: pts, status: "not-started", isCustom: true }
      ]);
      setManualCode("");
      setManualName("");
      setManualPoints("");
    } else {
      alert("Enter valid code, name, and points>0");
    }
  };

  // reset
  const handleResetConfirmed = () => {
    setCourseStatuses(
      courses.map((c) => ({ code: c.code, status: "not-started" }))
    );
    setCustomCourses([]);
    setShowResetConfirm(false);
  };

  // recalc points
  useEffect(() => {
    let total = 0;
    courseStatuses.forEach((r) => {
      if (r.status === "passed") {
        const c = courses.find((c) => c.code === r.code)!;
        total += c.points;
      }
    });
    customCourses.forEach((c) => {
      if (c.status === "passed") total += c.points;
    });
    setCurrentTotalPoints(total);
    setProgressPercentage((total / totalPoints) * 100);
  }, [courseStatuses, customCourses, courses, totalPoints]);

  // transcript parsing
  const handleTranscript = (rawText: string) => {
    // build best-grade map
    const map = new Map<string, { name: string; grade: string }>();
    rawText.split("\n").forEach((line) => {
      const m = line.match(
        /(HEAL|NURS|PHMY|HLAW|MAOH|HPRM|PSYC)\d{3}\s+(.+?)\s+([A-F][+\-]?|P|W)/i
      );
      if (m) {
        const code = m[1] + m[2]; // Combine course prefix and number
        const name = m[3];
        const grade = m[4];
        if (!map.has(code) || PASSING_GRADES.includes(grade)) {
          map.set(code, { name, grade });
          console.log(code, name, grade);
        }
      }
    });

    // apply
    setCourseStatuses((prev) => {
      const copy = [...prev];
      for (const [code, { grade }] of map) {
        const idx = copy.findIndex((r) => r.code === code);
        if (idx >= 0) {
          copy[idx] = {
            ...copy[idx],
            status: PASSING_GRADES.includes(grade) ? "passed" : "not-started"
          };
        }
      }
      return copy;
    });
    // also handle unknown codes → custom
    map.forEach(({ name, grade }, code) => {
      const exists = courses.some((c) => c.code === code);
      if (!exists && PASSING_GRADES.includes(grade)) {
        setCustomCourses((prev) => [
          ...prev,
          { code, name, points: 0, status: "passed", isCustom: true }
        ]);
      }
    });
  };

  const passedCourses = courseStatuses.filter(c => c.status === "passed").length;
  const passedCustomCourses = customCourses.filter(c => c.status === "passed").length;
  const totalPassedCourses = passedCourses + passedCustomCourses;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* 1. Fixed Header with Progress - always at the top due to sticky */}
      <div className="sticky top-0 z-50 bg-white shadow-lg border-b">
        <div className="px-6 py-4">
          {/* Header: Programme title and Reset All button */}
          <div className="flex items-center justify-between mb-4">
            {/* Left side: Icon + Programme Name */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <GraduationCap className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{programmeName}</h1>
                <p className="text-sm text-gray-600">Track your academic progress</p>
              </div>
            </div>
            {/* Right side: Reset All button */}
            <button
              onClick={() => setShowResetConfirm(true)}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reset All
            </button>
          </div>
  
          {/* Progress Stats: Points / Courses Passed / Percentage */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Current Points */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg">
              <div className="text-2xl font-bold">{currentTotalPoints}</div>
              <div className="text-blue-100">Points Completed</div>
            </div>
            {/* Courses Passed */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg">
              <div className="text-2xl font-bold">{totalPassedCourses}</div>
              <div className="text-green-100">Courses Passed</div>
            </div>
            {/* Progress Percentage */}
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg">
              <div className="text-2xl font-bold">{Math.round(progressPercentage)}%</div>
              <div className="text-purple-100">Progress</div>
            </div>
          </div>
  
          {/* Progress Bar with dynamic width */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Overall Progress</span>
              <span className="font-semibold">
                {currentTotalPoints} / {totalPoints} points
              </span>
            </div>
            <div className="bg-gray-200 h-4 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 via-green-500 to-emerald-500 transition-all duration-700 ease-out"
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
  
      {/* 2. Main Content Section */}
      <div className="px-6 py-6">
        {/* 2-1. Transcript Upload UI - positioned below header */}
  
        <div className="mb-8">
          <TranscriptUpload onDetect={handleTranscript} />
        </div>
  
        {/* 2-2. Two-column grid: Required Courses (left) & Custom Courses (right) */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left: Required Courses List */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            {/* Title and count badge */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Required Courses</h2>
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {passedCourses} / {courses.length} completed
              </div>
            </div>
  
            {/* Scrollable list of courses */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {courses.map((c) => {
                const s = courseStatuses.find((r) => r.code === c.code)!;
                return (
                  <div
                    key={c.code}
                    onClick={() => updateCourseStatus(c.code)}
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                      s.status === "passed"
                        ? "bg-green-50 border-2 border-green-200 shadow-sm"
                        : "hover:bg-gray-50 border-2 border-transparent"
                    }`}
                  >
                    {/* Course code & name */}
                    <div className="flex items-center gap-3">
                      <CheckCircle
                        className={`w-6 h-6 transition-colors ${
                          s.status === "passed" ? "text-green-500" : "text-gray-300"
                        }`}
                      />
                      <div>
                        <div className="font-medium text-gray-900">{c.code}</div>
                        <div className="text-sm text-gray-600">{c.name}</div>
                      </div>
                    </div>
                    {/* Points display */}
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">{c.points}</div>
                      <div className="text-sm text-gray-500">points</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
  
          {/* Right: Custom Course Form & List */}
          <div className="space-y-6">
            {/* Custom Course Form */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              {/* Form fields for code, name, points & Add button */}
              ...
            </div>
  
            {/* Conditional: Custom Course List appears if any exist */}
            {customCourses.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                {/* Title and custom count badge */}
                ...
                {/* List similar to Required Courses */}
              </div>
            )}
          </div>
        </div>
      </div>
  
      {/* 3. Reset Confirmation Modal - conditionally rendered floating overlay */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          ...
        </div>
      )}
    </div>
  );
  // End UI Render Section
}

export default ProgressTracker;

// 전체 포인트와 진행율을 계산하는 Effect
//   useEffect(() => {
//     let achievedPoints = 0;

//     // 기본 코스들의 포인트 계산
//     courses.forEach(course => {
//       const status = courseStatuses.find(s => s.code === course.code);
//       if (status?.status === 'passed') {
//         achievedPoints += course.points;
//       }
//     });

//     // 커스텀 코스들의 포인트 계산
//     customCourses.forEach(course => {
//       if (course.status === 'passed') {
//         achievedPoints += course.points;
//       }
//     });

//     setCurrentTotalPoints(achievedPoints);
//     setProgressPercentage((achievedPoints / totalPoints) * 100);
//   }, [courseStatuses, customCourses, courses, totalPoints]);
