import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { ArrowLeft, Download, TrendingUp, Users, BookOpen, Calendar } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

interface ReportsViewProps {
  onBack: () => void;
}

export function ReportsView({ onBack }: ReportsViewProps) {
  const enrollmentData = [
    { month: "Jan", students: 1150 },
    { month: "Feb", students: 1165 },
    { month: "Mar", students: 1180 },
    { month: "Apr", students: 1195 },
    { month: "May", students: 1205 },
    { month: "Jun", students: 1215 },
    { month: "Jul", students: 1220 },
    { month: "Aug", students: 1230 },
    { month: "Sep", students: 1240 },
    { month: "Oct", students: 1247 }
  ];

  const attendanceData = [
    { day: "Mon", percentage: 88 },
    { day: "Tue", percentage: 91 },
    { day: "Wed", percentage: 89 },
    { day: "Thu", percentage: 87 },
    { day: "Fri", percentage: 85 }
  ];

  const departmentData = [
    { name: "Computer Science", value: 320, color: "#3b82f6" },
    { name: "Mathematics", value: 245, color: "#10b981" },
    { name: "Physics", value: 198, color: "#8b5cf6" },
    { name: "Engineering", value: 280, color: "#f59e0b" },
    { name: "Biology", value: 204, color: "#ef4444" }
  ];

  const performanceData = [
    { range: "3.5-4.0", students: 420 },
    { range: "3.0-3.5", students: 380 },
    { range: "2.5-3.0", students: 280 },
    { range: "2.0-2.5", students: 120 },
    { range: "Below 2.0", students: 47 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="mb-2">Reports & Analytics</h2>
          <p className="text-muted-foreground">Comprehensive insights and data analysis</p>
        </div>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Export Reports
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardDescription>Total Enrollment</CardDescription>
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>
            <CardTitle>1,247</CardTitle>
            <div className="flex items-center gap-1 text-green-600">
              <TrendingUp className="h-3 w-3" />
              <span>+8.4% this year</span>
            </div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardDescription>Active Courses</CardDescription>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </div>
            <CardTitle>48</CardTitle>
            <p className="text-muted-foreground">6 departments</p>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardDescription>Avg. Attendance</CardDescription>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </div>
            <CardTitle>89%</CardTitle>
            <div className="flex items-center gap-1 text-green-600">
              <TrendingUp className="h-3 w-3" />
              <span>+3% this month</span>
            </div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardDescription>Avg. GPA</CardDescription>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </div>
            <CardTitle>3.42</CardTitle>
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
                <LineChart data={enrollmentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="students" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
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
                <BarChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="percentage" fill="#10b981" />
                </BarChart>
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
              <div className="grid md:grid-cols-2 gap-6">
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={departmentData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {departmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-4">
                  {departmentData.map((dept, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: dept.color }}
                        ></div>
                        <span>{dept.name}</span>
                      </div>
                      <span>{dept.value} students</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Academic Performance Distribution</CardTitle>
              <CardDescription>Number of students by GPA range</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="students" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Reports</CardTitle>
          <CardDescription>Generate commonly used reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Download className="h-5 w-5" />
              Student Roster
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Download className="h-5 w-5" />
              Grade Report
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Download className="h-5 w-5" />
              Attendance Summary
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
