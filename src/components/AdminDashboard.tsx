import { useState, useEffect } from "react"; // Added useEffect
import axios from "axios"; // Added axios
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { GraduationCap, LogOut, Users, BarChart3, BookOpen, ArrowRight } from "lucide-react";
import { StudentManagementView } from "./StudentManagementView";
import { ReportsView } from "./ReportsView";
import { CourseManagementView } from "./CourseManagementView";


interface AdminDashboardProps {
  onLogout: () => void;
  adminName?: string;
}

interface AdminStats {
  totalStudents: number;
  activeCourses: number;
  facultyMembers: number;
  averageAttendance: string;
}

type ViewType = "home" | "students" | "reports" | "courses";

export function AdminDashboard({ onLogout, adminName = "Admin User" }: AdminDashboardProps) {
  const [activeView, setActiveView] = useState<ViewType>("home");
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch stats only when the main 'home' view is active
    if (activeView === 'home') {
      setLoadingStats(true);
      setError(null);
      axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/dashboard-stats`)
        .then(response => {
          setStats(response.data);
        })
        .catch(err => {
          console.error("Error fetching admin stats:", err);
          setError("Failed to load dashboard statistics.");
        })
        .finally(() => {
          setLoadingStats(false);
        });
    }
  }, [activeView]); // Re-run effect if activeView changes back to 'home'

  const renderView = () => {
    switch (activeView) {
      // --- 2. UPDATE THIS CASE ---
      case "students":
        // Render the actual StudentManagementView component
        return <StudentManagementView onBack={() => setActiveView("home")} />;

      // --- Placeholder Views ---
      case "reports":
        return ( <div> {/* Replace with <ReportsView onBack={() => setActiveView("home")} /> */}
             <Button onClick={() => setActiveView("home")}>Back</Button>
            <h2>Reports & Analytics (Placeholder)</h2>
          </div> );
      case "courses":
        return ( <div> {/* Replace with <CourseManagementView onBack={() => setActiveView("home")} /> */}
            <Button onClick={() => setActiveView("home")}>Back</Button>
            <h2>Course Management (Placeholder)</h2>
          </div> );

      // --- Default Home View ---
      default: // home view
        return (
          <div className="space-y-8">
            <div>
              <h2 className="mb-2 text-2xl font-bold">Welcome, {adminName}</h2>
              <p className="text-muted-foreground">Administrative Dashboard</p>
            </div>

            {/* Navigation Cards (Keep onClick logic) */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card
                className="hover:shadow-lg transition-shadow cursor-pointer group"
                onClick={() => setActiveView("students")} // This triggers the switch
              >
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-2 group-hover:bg-blue-500/20 transition-colors">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle>Student Management</CardTitle>
                  <CardDescription>
                    Manage student records, enrollment, and information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <span className="text-sm font-medium text-primary group-hover:underline flex items-center"> {/* Use span for layout */}
                    Manage Students <ArrowRight className="ml-1 h-4 w-4" />
                  </span>
                </CardContent>
              </Card>

              <Card
                className="hover:shadow-lg transition-shadow cursor-pointer group"
                onClick={() => setActiveView("reports")}
              >
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-2 group-hover:bg-green-500/20 transition-colors">
                    <BarChart3 className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle>Reports & Analytics</CardTitle>
                  <CardDescription>
                    View institutional analytics and generate reports
                  </CardDescription>
                </CardHeader>
                <CardContent>
                   <span className="text-sm font-medium text-primary group-hover:underline flex items-center">
                    View Reports <ArrowRight className="ml-1 h-4 w-4" />
                  </span>
                </CardContent>
              </Card>

              <Card
                className="hover:shadow-lg transition-shadow cursor-pointer group"
                onClick={() => setActiveView("courses")}
              >
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-2 group-hover:bg-purple-500/20 transition-colors">
                    <BookOpen className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle>Course Management</CardTitle>
                  <CardDescription>
                    Organize courses, schedules, and faculty assignments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                   <span className="text-sm font-medium text-primary group-hover:underline flex items-center">
                    Manage Courses <ArrowRight className="ml-1 h-4 w-4" />
                  </span>
                </CardContent>
              </Card>
            </div>

            {/* Quick Stats (Using dynamic data) */}
             <h3 className="text-xl font-semibold mb-4">Overview</h3>
             {loadingStats ? (
               <p className="text-center text-muted-foreground">Loading statistics...</p>
             ) : error ? (
               <p className="text-red-500 text-center">{error}</p>
             ) : stats ? (
               <div className="grid md:grid-cols-4 gap-6">
                 {/* Stat Cards */}
                 <Card className="flex flex-col justify-center">
                   <CardHeader>
                     <CardDescription>Total Students</CardDescription>
                     <CardTitle className="text-3xl">{stats.totalStudents}</CardTitle>
                     <p className="text-xs text-muted-foreground">Currently active</p>
                   </CardHeader>
                 </Card>
                 <Card className="flex flex-col justify-center">
                   <CardHeader>
                     <CardDescription>Active Courses</CardDescription>
                     <CardTitle className="text-3xl">{stats.activeCourses}</CardTitle>
                      <p className="text-xs text-muted-foreground">Currently offered</p>
                   </CardHeader>
                 </Card>
                 <Card className="flex flex-col justify-center">
                   <CardHeader>
                     <CardDescription>Faculty Members</CardDescription>
                     <CardTitle className="text-3xl">{stats.facultyMembers}</CardTitle>
                     <p className="text-xs text-muted-foreground">Total count</p>
                   </CardHeader>
                 </Card>
                 <Card className="flex flex-col justify-center">
                   <CardHeader>
                     <CardDescription>Average Attendance</CardDescription>
                     <CardTitle className="text-3xl">{stats.averageAttendance}%</CardTitle>
                     <p className="text-xs text-muted-foreground">Across all classes</p>
                   </CardHeader>
                 </Card>
               </div>
             ) : (
               <p className="text-center text-muted-foreground">No statistics available.</p>
             )}
            {/* Recent Activity Removed */}
          </div>
        );
    } // End switch statement
  };

  return (
    <div className="min-h-screen bg-muted/10">
      {/* Header */}
      <header className="border-b bg-background">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8" />
            <span className="text-xl">EduERP</span>
            <span className="text-muted-foreground">/ Admin Portal</span>
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