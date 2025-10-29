import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { ArrowLeft, Download, TrendingUp, TrendingDown, Users, BookOpen, Calendar, Loader2 } from "lucide-react"; // Removed Download usage below
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

interface ReportsViewProps {
  onBack: () => void;
}

// --- Data types remain the same ---
interface KeyMetrics {
  totalEnrollment: number;
  activeCourses: number;
  averageAttendance: string;
  averageGpa: string;
  enrollmentTrend: { value: number, direction: 'up' | 'down' };
  attendanceTrend: { value: number, direction: 'up' | 'down' };
}
interface EnrollmentTrendPoint { month: string; students: number; }
interface AttendancePoint { day: string; percentage: number; }
interface DepartmentPoint { name: string; value: number; color: string; }
interface PerformancePoint { range: string; students: number; }
interface ReportData {
  keyMetrics: KeyMetrics;
  enrollmentTrend: EnrollmentTrendPoint[];
  weeklyAttendance: AttendancePoint[];
  departmentDistribution: DepartmentPoint[];
  performanceDistribution: PerformancePoint[];
}

export function ReportsView({ onBack }: ReportsViewProps) {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/reports-data`)
      .then(response => {
        setReportData(response.data);
      })
      .catch(err => {
        console.error("Error fetching report data:", err);
        setError(err.response?.data?.message || "Failed to load report data.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
        </Button>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="ml-2">Loading reports...</p>
        </div>
      </div>
    );
  }

  if (error) {
     return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
        </Button>
         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-center" role="alert">
           <strong className="font-bold">Error: </strong>
           <span className="block sm:inline">{error}</span>
         </div>
      </div>
    );
  }

  const km = reportData?.keyMetrics;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>

      {/* --- SECTION MODIFIED: Removed Export Button --- */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="mb-2">Reports & Analytics</h2>
          <p className="text-muted-foreground">Comprehensive insights and data analysis</p>
        </div>
        {/* Export Button Removed */}
      </div>
      {/* --- END MODIFICATION --- */}


      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardDescription>Total Enrollment</CardDescription>
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>
            <CardTitle>{km?.totalEnrollment ?? '...'}</CardTitle>
            {km?.enrollmentTrend && (
               <div className={`flex items-center gap-1 ${km.enrollmentTrend.direction === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                 {km.enrollmentTrend.direction === 'up' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                 <span>{km.enrollmentTrend.value}% this year</span>
               </div>
            )}
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardDescription>Active Courses</CardDescription>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </div>
            <CardTitle>{km?.activeCourses ?? '...'}</CardTitle>
             <p className="text-muted-foreground">{reportData?.departmentDistribution?.length || '...'} departments</p>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardDescription>Avg. Attendance</CardDescription>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </div>
            <CardTitle>{km?.averageAttendance ?? '...'}%</CardTitle>
             {km?.attendanceTrend && (
               <div className={`flex items-center gap-1 ${km.attendanceTrend.direction === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {km.attendanceTrend.direction === 'up' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                 <span>{km.attendanceTrend.value}% this month</span>
               </div>
            )}
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardDescription>Avg. CGPA</CardDescription> {/* Updated Label */}
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </div>
            <CardTitle>{km?.averageGpa ?? '...'}</CardTitle> {/* Now uses 10-point scale */}
            <p className="text-muted-foreground">Institution-wide</p>
          </CardHeader>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="enrollment" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="enrollment">Enrollment</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="enrollment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Student Enrollment Trends</CardTitle>
              <CardDescription>Monthly student enrollment growth over the year</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                {reportData?.enrollmentTrend ? (
                  <LineChart data={reportData.enrollmentTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="students" stroke="#3b82f6" strokeWidth={2} />
                  </LineChart>
                ) : <p className="text-center text-muted-foreground">Enrollment trend data not available.</p>}
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Attendance Rates</CardTitle>
              <CardDescription>Average attendance percentage by day of the week</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                 {reportData?.weeklyAttendance ? (
                  <BarChart data={reportData.weeklyAttendance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="percentage" fill="#10b981" />
                  </BarChart>
                 ) : <p className="text-center text-muted-foreground">Weekly attendance data not available.</p>}
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="departments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Student Distribution by Department</CardTitle>
              <CardDescription>Number of students enrolled in each department</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6 items-center">
                <ResponsiveContainer width="100%" height={400}>
                  {reportData?.departmentDistribution ? (
                    <PieChart>
                      <Pie
                        data={reportData.departmentDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {reportData.departmentDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value, name) => [`${value} students`, name]} />
                    </PieChart>
                  ) : <p className="text-center text-muted-foreground">Department data not available.</p>}
                </ResponsiveContainer>
                <div className="space-y-2">
                   {reportData?.departmentDistribution?.map((dept, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded-lg text-sm">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: dept.color }}
                        ></div>
                        <span>{dept.name}</span>
                      </div>
                      <span className="font-medium">{dept.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- SECTION MODIFIED: Performance Tab now uses correct data ranges --- */}
        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Academic Performance Distribution</CardTitle>
              <CardDescription>Number of students by CGPA range (10-point scale)</CardDescription> {/* Updated Description */}
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                {reportData?.performanceDistribution ? (
                  // Ensure the dataKey matches what the backend sends ('range')
                  <BarChart data={reportData.performanceDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" /> {/* This should now show '9.0-10.0', etc. */}
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="students" fill="#8b5cf6" />
                  </BarChart>
                ) : <p className="text-center text-muted-foreground">Performance data not available.</p>}
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        {/* --- END MODIFICATION --- */}

      </Tabs>

      {/* --- SECTION REMOVED: Quick Reports Card --- */}
      {/* The entire <Card> for Quick Reports has been deleted */}
      {/* --- END REMOVAL --- */}

    </div>
  );
}