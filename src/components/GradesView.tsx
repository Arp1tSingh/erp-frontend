// src/components/GradesView.tsx (Simplified Example)

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { ArrowLeft } from 'lucide-react';

interface GradesViewProps {
  onBack: () => void;
}

// Define types for the data we expect from the API
interface GradeSummary {
  currentSgpa: string;
  totalCredits: number;
  coursesPassed: number;
  totalCourses: number;
  averageScore: string;
}

interface CourseGradeDetail {
  course_id: string;
  course_name: string;
  credit_hours: number;
  numeric_score: number | null; // Can be null if not graded yet
  letter_grade: string | null;
  // trend can be calculated later if needed
}

export function GradesView({ onBack }: GradesViewProps) {
  const [summary, setSummary] = useState<GradeSummary | null>(null);
  const [details, setDetails] = useState<CourseGradeDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loggedInUserString = localStorage.getItem('user');
    if (!loggedInUserString) {
      setError("User not logged in.");
      setLoading(false);
      return;
    }
    const loggedInUser = JSON.parse(loggedInUserString);
    const studentId = loggedInUser.student_id;

    if (!studentId) {
      setError("Student ID not found.");
      setLoading(false);
      return;
    }

    setLoading(true);
    // Call the NEW backend endpoint for 'current' grades
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/grades/${studentId}/current`)
      .then(response => {
        setSummary(response.data.summary);
        setDetails(response.data.details);
      })
      .catch(err => {
        console.error("Error fetching grades:", err);
        setError("Failed to load academic grades.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-4 text-center">Loading grades...</div>;
  if (error) return <div className="p-4 text-red-500 text-center">{error}</div>;
  if (!summary) return <div className="p-4 text-center">No grade summary available.</div>;

  return (
    <div className="space-y-6">
      <Button variant="outline" size="sm" onClick={onBack} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
      </Button>
      
      <h2 className="text-2xl font-bold">Academic Grades</h2>
      <p className="text-muted-foreground">Current semester performance overview</p>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Current SGPA</CardTitle>
            <div className="text-2xl font-bold">{summary.currentSgpa}</div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Credits</CardTitle>
            <div className="text-2xl font-bold">{summary.totalCredits}</div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Courses Passed</CardTitle>
            <div className="text-2xl font-bold">{summary.coursesPassed}/{summary.totalCourses}</div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Score</CardTitle>
            <div className="text-2xl font-bold">{summary.averageScore}%</div>
          </CardHeader>
        </Card>
      </div>

      {/* Course Grades Table */}
      <Card>
        <CardHeader>
          <CardTitle>Course Grades</CardTitle>
          <CardDescription>Detailed breakdown of your course performance</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course Code</TableHead>
                <TableHead>Course Name</TableHead>
                <TableHead className="text-left">Credits</TableHead>
                <TableHead className="text-left">Score</TableHead>
                <TableHead className="text-center">Grade</TableHead>
                {/* Trend column removed for simplicity, can be added later */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {details.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">No courses found for this semester.</TableCell>
                </TableRow>
              ) : (
                details.map((course) => (
                  <TableRow key={course.course_id}>
                    <TableCell className="font-medium">{course.course_id}</TableCell>
                    <TableCell>{course.course_name}</TableCell>
                    <TableCell className="text-left">{course.credit_hours}</TableCell>
                    <TableCell className="text-right">{course.numeric_score !== null ? `${course.numeric_score}%` : 'N/A'}</TableCell>
                    <TableCell className="text-center">{course.letter_grade || 'N/A'}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}