import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { GraduationCap, LogOut, FileText, Calendar, BookOpen } from "lucide-react";
import { GradesView } from "./GradesView";
import { AttendanceView } from "./AttendanceView";
import { ResourcesView } from "./ResourcesView";

// --- REMOVED INCORRECT useState CALLS FROM HERE ---

interface StudentDashboardProps {
  onLogout: () => void;
}

interface StudentData {
  student_id: string;
  first_name: string;
  last_name: string;
  // Add other fields as needed
}

type ViewType = "home" | "grades" | "attendance" | "resources";

export function StudentDashboard({ onLogout }: StudentDashboardProps) {
  // --- CORRECT PLACEMENT FOR useState ---
  const [activeView, setActiveView] = useState<ViewType>("home");
  const [student, setStudent] = useState<StudentData | null>(null);
  const [sgpa, setSgpa] = useState<string | null>(null); // Added missing sgpa state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Keep only one error state

  useEffect(() => {
    const loggedInUserString = localStorage.getItem('user');
    if (!loggedInUserString) {
      setError("No user data found. Please log in again.");
      setLoading(false);
      return;
    }

    const loggedInUser = JSON.parse(loggedInUserString);
    const studentId = loggedInUser.student_id;

    if (studentId) {
      setLoading(true); // Set loading before the API call
      axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/students/${studentId}`)
        .then(response => {
          setStudent(response.data.student);
          setSgpa(response.data.sgpa);
        })
        .catch(err => {
          console.error("Error fetching student data:", err);
          // Set the error state if the API call fails
          setError("Failed to load dashboard data. Please try refreshing."); 
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setError("Could not find student ID. Please log in again.");
      setLoading(false);
    }
  }, []);

  if (loading) return <div className="p-8 text-center">Loading dashboard...</div>; // Added text-center for better UI
  if (error) return <div className="p-8 text-red-500 text-center">{error}</div>; // Added text-center

  const renderView = () => {
    switch (activeView) {
      case "grades":
        return <GradesView onBack={() => setActiveView("home")} />;
      case "attendance":
        return <AttendanceView onBack={() => setActiveView("home")} />;
      case "resources":
        return <ResourcesView onBack={() => setActiveView("home")} />;
      default:
        // Check if student data is available before rendering the main view
        if (!student) {
          return <div className="p-8 text-red-500 text-center">Student data could not be loaded.</div>;
        }
        return (
          <div className="space-y-8">
            <div>
              <h2 className="mb-2 text-2xl font-bold">Welcome back, {student.first_name} {student.last_name}</h2>
              <p className="text-muted-foreground">Student ID: {student.student_id}</p>
            </div>

            {/* Cards for Grades, Attendance, Resources */}
            <div className="grid md:grid-cols-3 gap-6">
                 <Card 
                   className="hover:shadow-lg transition-shadow cursor-pointer group"
                   onClick={() => setActiveView("grades")}
                 >
                   <CardHeader>
                     <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-2 group-hover:bg-blue-500/20 transition-colors">
                       <FileText className="h-6 w-6 text-blue-600" />
                     </div>
                     <CardTitle>Grades</CardTitle>
                     <CardDescription>
                       View your academic performance and course grades
                     </CardDescription>
                   </CardHeader>
                   <CardContent>
                     <span className="text-sm font-medium text-primary group-hover:underline">View Grades →</span>
                   </CardContent>
                 </Card>

                 <Card 
                   className="hover:shadow-lg transition-shadow cursor-pointer group"
                   onClick={() => setActiveView("attendance")}
                 >
                   <CardHeader>
                     <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-2 group-hover:bg-green-500/20 transition-colors">
                       <Calendar className="h-6 w-6 text-green-600" />
                     </div>
                     <CardTitle>Attendance</CardTitle>
                     <CardDescription>
                       Check your attendance records and statistics
                     </CardDescription>
                   </CardHeader>
                   <CardContent>
                     <span className="text-sm font-medium text-primary group-hover:underline">View Attendance →</span>
                   </CardContent>
                 </Card>

                 <Card 
                   className="hover:shadow-lg transition-shadow cursor-pointer group"
                   onClick={() => setActiveView("resources")}
                 >
                   <CardHeader>
                     <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-2 group-hover:bg-purple-500/20 transition-colors">
                       <BookOpen className="h-6 w-6 text-purple-600" />
                     </div>
                     <CardTitle>Resources</CardTitle>
                     <CardDescription>
                       Access course materials and learning resources
                     </CardDescription>
                   </CardHeader>
                   <CardContent>
                     <span className="text-sm font-medium text-primary group-hover:underline">View Resources →</span>
                   </CardContent>
                 </Card>
            </div>


            {/* Quick Stats */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Current SGPA</CardTitle>
                  <div className="mt-2 text-2xl font-bold">{sgpa !== null ? sgpa : 'N/A'}</div>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Attendance Rate</CardTitle>
                  <div className="mt-2 text-2xl font-bold">92%</div> {/* Placeholder */}
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Enrolled Courses</CardTitle>
                  <div className="mt-2 text-2xl font-bold">6</div> {/* Placeholder */}
                </CardHeader>
              </Card>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8" />
            <span className="text-xl">EduERP</span>
            <span className="text-muted-foreground">/ Student Portal</span>
          </div>
          <Button variant="outline" onClick={onLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {renderView()}
      </main>
    </div>
  );
}