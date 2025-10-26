import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { ArrowLeft, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";

interface AttendanceViewProps {
  onBack: () => void;
}

// --- Types for Fetched Data ---
interface AttendanceSummary {
  overallRate: string;
  totalClasses: number;
  classesAttended: number;
  totalAbsences: number;
}

interface CourseAttendanceDetail {
  course_id: string;
  course_name: string;
  total: number;
  present: number;
  absent: number;
  late: number;
  attended: number;
  percentage: number;
}

// Type for the raw records received from backend
interface RawAttendanceRecord {
  course_id: string;
  course_name: string;
  status: 'Present' | 'Absent' | 'Late';
  class_date: string; // Assuming backend sends date as string
}
// --- End of Types ---

export function AttendanceView({ onBack }: AttendanceViewProps) {
  // --- State Variables ---
  const [summary, setSummary] = useState<AttendanceSummary | null>(null);
  const [details, setDetails] = useState<CourseAttendanceDetail[]>([]);
  const [recent, setRecent] = useState<RawAttendanceRecord[]>([]); // State for recent records
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // --- End of State ---

  // --- Data Fetching ---
  useEffect(() => {
    const loggedInUserString = localStorage.getItem('user');
    if (!loggedInUserString) {
      setError("User not logged in."); setLoading(false); return;
    }
    const loggedInUser = JSON.parse(loggedInUserString);
    const studentId = loggedInUser.student_id;
    if (!studentId) {
      setError("Student ID not found."); setLoading(false); return;
    }

    setLoading(true);
    // Fetch data from the backend endpoint
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/attendance/${studentId}/current`)
      .then(response => {
        setSummary(response.data.summary);
        setDetails(response.data.details);
        // Sort recent records by date (newest first) and take top 8
        const sortedRecent = response.data.recent
          .sort((a: RawAttendanceRecord, b: RawAttendanceRecord) => new Date(b.class_date).getTime() - new Date(a.class_date).getTime())
          .slice(0, 8); // Limit to 8 most recent
        setRecent(sortedRecent);
      })
      .catch(err => {
        console.error("Error fetching attendance:", err);
        setError("Failed to load attendance records.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []); // Empty array ensures this runs only once on mount
  // --- End of Data Fetching ---

  // --- Helper Functions ---
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Present": return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "Absent": return <XCircle className="h-4 w-4 text-red-600" />;
      case "Late": return <Clock className="h-4 w-4 text-yellow-600" />;
      default: return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: string } = {
      Present: "bg-green-500/10 text-green-700 border-green-500/20",
      Absent: "bg-red-500/10 text-red-700 border-red-500/20",
      Late: "bg-yellow-500/10 text-yellow-700 border-yellow-500/20"
    };
    return variants[status] || "";
  };
  // --- End of Helper Functions ---


  // --- Loading and Error States ---
  if (loading) return <div className="p-4 text-center">Loading attendance...</div>;
  if (error) return <div className="p-4 text-red-500 text-center">{error}</div>;
  // It's possible summary exists but details/recent might be empty if no records found
  if (!summary) return <div className="p-4 text-center">No attendance summary available.</div>;
  // --- End of Loading/Error States ---

  // --- Main JSX Structure ---
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        {/* Use updated Button style */}
        <Button variant="outline" size="sm" onClick={onBack} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
        </Button>
      </div>

      <div>
        <h2 className="mb-2 text-2xl font-bold">Attendance Records</h2>
        <p className="text-muted-foreground">Track your class attendance and participation</p>
      </div>

      {/* Attendance Summary Cards (Using Fetched Data) */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card><CardHeader><CardTitle className="text-sm font-medium text-muted-foreground">Overall Attendance</CardTitle><div className="text-2xl font-bold">{summary.overallRate}%</div></CardHeader></Card>
        <Card><CardHeader><CardTitle className="text-sm font-medium text-muted-foreground">Total Classes</CardTitle><div className="text-2xl font-bold">{summary.totalClasses}</div></CardHeader></Card>
        <Card><CardHeader><CardTitle className="text-sm font-medium text-muted-foreground">Classes Attended</CardTitle><div className="text-2xl font-bold">{summary.classesAttended}</div></CardHeader></Card>
        <Card><CardHeader><CardTitle className="text-sm font-medium text-muted-foreground">Total Absences</CardTitle><div className="text-2xl font-bold">{summary.totalAbsences}</div></CardHeader></Card>
      </div>

      {/* Course-wise Attendance (Using Fetched Data) */}
      <Card>
        <CardHeader>
          <CardTitle>Course-wise Attendance</CardTitle>
          <CardDescription>Attendance breakdown for each course this semester</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {details.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">No attendance records found for this semester.</p>
          ) : (
            details.map((course) => (
              <div key={course.course_id} className="border-b pb-4 last:border-b-0 last:pb-0">
                 <div className="flex justify-between items-center mb-2">
                   <span className="font-medium">{course.course_id} - {course.course_name}</span>
                   <span className="text-sm font-semibold">{course.percentage.toFixed(1)}%</span>
                 </div>
                 <Progress value={course.percentage} className="h-2 mb-2" />
                 <div className="flex justify-between items-center text-xs text-muted-foreground">
                   <span>{course.attended}/{course.total} classes attended</span>
                   <div className="flex gap-2">
                     <span>P: {course.present}</span>
                     <span>A: {course.absent}</span>
                     <span>L: {course.late}</span>
                   </div>
                 </div>
               </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Recent Attendance (Using Fetched Data) */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Attendance</CardTitle>
          <CardDescription>Your latest attendance records for the current semester</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Course</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recent.length === 0 ? (
                 <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground">No recent records found.</TableCell></TableRow>
              ) : (
                 recent.map((record, index) => (
                   <TableRow key={index}>
                     <TableCell>{new Date(record.class_date).toLocaleDateString()}</TableCell> {/* Format date */}
                     <TableCell>{record.course_name}</TableCell> {/* Use course_name */}
                     <TableCell className="text-center">
                       <div className="flex items-center justify-center gap-2">
                         {getStatusIcon(record.status)}
                         <Badge variant="outline" className={getStatusBadge(record.status)}>
                           {record.status}
                         </Badge>
                       </div>
                     </TableCell>
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

