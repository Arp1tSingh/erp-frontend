import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { ArrowLeft, TrendingUp, TrendingDown } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";

interface GradesViewProps {
  onBack: () => void;
}

export function GradesView({ onBack }: GradesViewProps) {
  const courses = [
    {
      id: 1,
      code: "CS101",
      name: "Introduction to Computer Science",
      grade: "A",
      percentage: 92,
      credits: 4,
      trend: "up"
    },
    {
      id: 2,
      code: "MATH201",
      name: "Calculus II",
      grade: "B+",
      percentage: 87,
      credits: 4,
      trend: "up"
    },
    {
      id: 3,
      code: "ENG105",
      name: "Technical Writing",
      grade: "A-",
      percentage: 90,
      credits: 3,
      trend: "down"
    },
    {
      id: 4,
      code: "PHYS201",
      name: "Physics I",
      grade: "B",
      percentage: 83,
      credits: 4,
      trend: "up"
    },
    {
      id: 5,
      code: "HIST110",
      name: "World History",
      grade: "A",
      percentage: 94,
      credits: 3,
      trend: "up"
    },
    {
      id: 6,
      code: "CS102",
      name: "Data Structures",
      grade: "B+",
      percentage: 88,
      credits: 4,
      trend: "down"
    }
  ];

  const getGradeColor = (grade: string) => {
    if (grade.startsWith("A")) return "bg-green-500/10 text-green-700 border-green-500/20";
    if (grade.startsWith("B")) return "bg-blue-500/10 text-blue-700 border-green-500/20";
    if (grade.startsWith("C")) return "bg-yellow-500/10 text-yellow-700 border-yellow-500/20";
    return "bg-red-500/10 text-red-700 border-red-500/20";
  };

  const calculateGPA = () => {
    const gradePoints: { [key: string]: number } = {
      "A": 4.0, "A-": 3.7, "B+": 3.3, "B": 3.0, "B-": 2.7,
      "C+": 2.3, "C": 2.0, "C-": 1.7, "D": 1.0, "F": 0.0
    };

    let totalPoints = 0;
    let totalCredits = 0;

    courses.forEach(course => {
      totalPoints += gradePoints[course.grade] * course.credits;
      totalCredits += course.credits;
    });

    return (totalPoints / totalCredits).toFixed(2);
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
        <h2 className="mb-2">Academic Grades</h2>
        <p className="text-muted-foreground">Current semester performance overview</p>
      </div>

      {/* GPA Summary */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardDescription>Current SGPA</CardDescription>
            <CardTitle>{calculateGPA()}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Total Credits</CardDescription>
            <CardTitle>22</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Courses Passed</CardDescription>
            <CardTitle>6/6</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Average Score</CardDescription>
            <CardTitle>89%</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Grades Table */}
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
                <TableHead className="text-center">Credits</TableHead>
                <TableHead className="text-center">Score</TableHead>
                <TableHead className="text-center">Grade</TableHead>
                <TableHead className="text-center">Trend</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell>{course.code}</TableCell>
                  <TableCell>{course.name}</TableCell>
                  <TableCell className="text-center">{course.credits}</TableCell>
                  <TableCell className="text-center">{course.percentage}%</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className={getGradeColor(course.grade)}>
                      {course.grade}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {course.trend === "up" ? (
                      <TrendingUp className="h-4 w-4 text-green-600 mx-auto" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-600 mx-auto" />
                    )}
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
