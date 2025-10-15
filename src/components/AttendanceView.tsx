import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { ArrowLeft, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";

interface AttendanceViewProps {
  onBack: () => void;
}

export function AttendanceView({ onBack }: AttendanceViewProps) {
  const attendanceRecords = [
    {
      id: 1,
      course: "CS101 - Intro to Computer Science",
      totalClasses: 30,
      attended: 28,
      absent: 2,
      late: 0,
      percentage: 93.3
    },
    {
      id: 2,
      course: "MATH201 - Calculus II",
      totalClasses: 28,
      attended: 26,
      absent: 1,
      late: 1,
      percentage: 92.9
    },
    {
      id: 3,
      course: "ENG105 - Technical Writing",
      totalClasses: 25,
      attended: 24,
      absent: 1,
      late: 0,
      percentage: 96.0
    },
    {
      id: 4,
      course: "PHYS201 - Physics I",
      totalClasses: 32,
      attended: 28,
      absent: 3,
      late: 1,
      percentage: 87.5
    },
    {
      id: 5,
      course: "HIST110 - World History",
      totalClasses: 24,
      attended: 22,
      absent: 2,
      late: 0,
      percentage: 91.7
    },
    {
      id: 6,
      course: "CS102 - Data Structures",
      totalClasses: 30,
      attended: 27,
      absent: 2,
      late: 1,
      percentage: 90.0
    }
  ];

  const recentAttendance = [
    { date: "2025-10-10", course: "CS101", status: "Present" },
    { date: "2025-10-10", course: "MATH201", status: "Present" },
    { date: "2025-10-09", course: "ENG105", status: "Present" },
    { date: "2025-10-09", course: "PHYS201", status: "Late" },
    { date: "2025-10-08", course: "HIST110", status: "Present" },
    { date: "2025-10-08", course: "CS102", status: "Present" },
    { date: "2025-10-07", course: "CS101", status: "Present" },
    { date: "2025-10-07", course: "MATH201", status: "Absent" }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Present":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "Absent":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "Late":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return null;
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

  const calculateOverallAttendance = () => {
    const totalClasses = attendanceRecords.reduce((sum, record) => sum + record.totalClasses, 0);
    const totalAttended = attendanceRecords.reduce((sum, record) => sum + record.attended, 0);
    return ((totalAttended / totalClasses) * 100).toFixed(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>

      <div>
        <h2 className="mb-2">Attendance Records</h2>
        <p className="text-muted-foreground">Track your class attendance and participation</p>
      </div>

      {/* Attendance Summary */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardDescription>Overall Attendance</CardDescription>
            <CardTitle>{calculateOverallAttendance()}%</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Total Classes</CardDescription>
            <CardTitle>{attendanceRecords.reduce((sum, r) => sum + r.totalClasses, 0)}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Classes Attended</CardDescription>
            <CardTitle>{attendanceRecords.reduce((sum, r) => sum + r.attended, 0)}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Total Absences</CardDescription>
            <CardTitle>{attendanceRecords.reduce((sum, r) => sum + r.absent, 0)}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Course-wise Attendance */}
      <Card>
        <CardHeader>
          <CardTitle>Course-wise Attendance</CardTitle>
          <CardDescription>Attendance breakdown for each course</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {attendanceRecords.map((record) => (
            <div key={record.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <p>{record.course}</p>
                  <p className="text-muted-foreground">
                    {record.attended}/{record.totalClasses} classes attended
                  </p>
                </div>
                <span>{record.percentage.toFixed(1)}%</span>
              </div>
              <Progress value={record.percentage} />
              <div className="flex gap-4 text-muted-foreground">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> {record.attended} Present
                </span>
                <span className="flex items-center gap-1">
                  <XCircle className="h-3 w-3" /> {record.absent} Absent
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {record.late} Late
                </span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recent Attendance */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Attendance</CardTitle>
          <CardDescription>Your latest attendance records</CardDescription>
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
              {recentAttendance.map((record, index) => (
                <TableRow key={index}>
                  <TableCell>{record.date}</TableCell>
                  <TableCell>{record.course}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      {getStatusIcon(record.status)}
                      <Badge variant="outline" className={getStatusBadge(record.status)}>
                        {record.status}
                      </Badge>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
