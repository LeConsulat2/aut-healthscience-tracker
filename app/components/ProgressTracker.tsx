"use client";
import { ReactElement, useCallback, useState, useEffect } from "react";
import { CourseStatusType, CustomCourse, ProgressTrackerProps } from "../programmes/types";
import {
  GraduationCap,
  Plus,
  X,
  CheckCircle
} from "lucide-react";
import { Document, pdfjs } from "react-pdf"; // npm i react-pdf

// transcript upload component (inline)
function TranscriptUpload({
  onDetect
}: {
  onDetect: (fullText: string) => void;
}): ReactElement {
  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const data = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data }).promise;
    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map(item => item.str).join(" ") + "\n";
    }
    onDetect(text);
  };

  return (
    <input
      type="file"
      accept="application/pdf"
      onChange={handleFile}
      className="mb-4"
    />
  );
}

const PASSING_GRADES = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "P"];
const FAILING_GRADES = ["D", "DNC", "DNS", "F", "W"];

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

  // add custom
  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
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
        const [_, code, name, grade] = m;
        if (!map.has(code) || PASSING_GRADES.includes(grade)) {
          map.set(code, { name, grade });
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GraduationCap className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold">{programmeName} Progress</h1>
          </div>
          <button
            onClick={() => setShowResetConfirm(true)}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Reset All
          </button>
        </div>

        {/* TRANSCRIPT UPLOAD */}
        <TranscriptUpload onDetect={handleTranscript} />

        {/* PROGRESS BAR */}
        <div className="bg-white p-4 rounded shadow">
          <div className="flex justify-between">
            <span>Overall Progress</span>
            <span className="font-bold">
              {currentTotalPoints} / {totalPoints} pts
            </span>
          </div>
          <div className="bg-gray-200 h-3 rounded overflow-hidden mt-2">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            />
          </div>
        </div>

        {/* COURSES */}
        <div className="grid sm:grid-cols-2 gap-6">
          {/* Required Courses */}
          <div className="bg-white p-4 rounded shadow space-y-2">
            <h2 className="font-semibold">Required Courses</h2>
            {courses.map((c) => {
              const s = courseStatuses.find((r) => r.code === c.code)!;
              return (
                <div
                  key={c.code}
                  onClick={() => updateCourseStatus(c.code)}
                  className={`flex items-center justify-between p-2 rounded cursor-pointer ${
                    s.status === "passed"
                      ? "bg-green-50"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle
                      className={`${
                        s.status === "passed" ? "text-green-500" : "text-gray-300"
                      }`}
                    />
                    <span>{c.code}</span>
                  </div>
                  <span>{c.points} pts</span>
                </div>
              );
            })}
          </div>

          {/* Custom & Add */}
          <div className="space-y-4">
            <form
              onSubmit={handleAddCustom}
              className="bg-white p-4 rounded shadow space-y-2"
            >
              <h2 className="font-semibold">Add Custom Course</h2>
              <input
                className="w-full border p-2 rounded"
                placeholder="Code"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
              />
              <input
                className="w-full border p-2 rounded"
                placeholder="Name"
                value={manualName}
                onChange={(e) => setManualName(e.target.value)}
              />
              <input
                className="w-full border p-2 rounded"
                placeholder="Points"
                type="number"
                value={manualPoints}
                onChange={(e) => setManualPoints(e.target.value)}
              />
              <button className="w-full bg-blue-500 text-white p-2 rounded">
                <Plus className="inline-block mr-1" />
                Add
              </button>
            </form>
            {customCourses.length > 0 && (
              <div className="bg-white p-4 rounded shadow space-y-2">
                <h2 className="font-semibold">Custom Courses</h2>
                {customCourses.map((c, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2 rounded hover:bg-gray-100"
                  >
                    <div
                      className="flex items-center gap-2 cursor-pointer"
                      onClick={() => updateCustomStatus(i)}
                    >
                      <CheckCircle
                        className={`${
                          c.status === "passed"
                            ? "text-green-500"
                            : "text-gray-300"
                        }`}
                      />
                      <span>{c.code}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>{c.points} pts</span>
                      <X
                        className="cursor-pointer text-red-500"
                        onClick={() => handleRemoveCustomCourse(i)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RESET CONFIRM MODAL */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg space-y-4 max-w-xs w-full">
            <h3 className="text-lg font-bold">Reset All Progress?</h3>
            <p>This will clear all your passed flags. Cannot be undone.</p>
            <div className="flex gap-3">
              <button
                className="flex-1 bg-gray-200 p-2 rounded"
                onClick={() => setShowResetConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="flex-1 bg-red-600 text-white p-2 rounded"
                onClick={handleResetConfirmed}
              >
                Yes, Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressTracker;
