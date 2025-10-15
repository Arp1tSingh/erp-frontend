import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ArrowLeft, Search, Plus, Edit, Trash2, Users, Clock } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "./ui/dialog";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";

interface CourseManagementViewProps {
  onBack: () => void;
}

export function CourseManagementView({ onBack }: CourseManagementViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const courses = [
    {
      id: "CS101",
      name: "Introduction to Computer Science",
      instructor: "Dr. Sarah Williams",
      department: "Computer Science",
      credits: 4,
      enrolled: 78,
      capacity: 80,
      schedule: "MWF 10:00-11:30",
      status: "Active"
    },
    {
      id: "MATH201",
      name: "Calculus II",
      instructor: "Prof. Michael Brown",
      department: "Mathematics",
      credits: 4,
      enrolled: 65,
      capacity: 70,
      schedule: "TTh 13:00-15:00",
      status: "Active"
    },
    {
      id: "PHYS201",
      name: "Physics I",
      instructor: "Dr. Emily Chen",
      department: "Physics",
      credits: 4,
      enrolled: 52,
      capacity: 60,
      schedule: "MWF 14:00-15:30",
      status: "Active"
    },
    {
      id: "ENG105",
      name: "Technical Writing",
      instructor: "Prof. James Anderson",
      department: "English",
      credits: 3,
      enrolled: 45,
      capacity: 50,
      schedule: "TTh 10:00-11:30",
      status: "Active"
    },
    {
      id: "CS102",
      name: "Data Structures",
      instructor: "Dr. Lisa Martinez",
      department: "Computer Science",
      credits: 4,
      enrolled: 70,
      capacity: 75,
      schedule: "MWF 11:00-12:30",
      status: "Active"
    },
    {
      id: "HIST110",
      name: "World History",
      instructor: "Prof. Robert Taylor",
      department: "History",
      credits: 3,
      enrolled: 42,
      capacity: 60,
      schedule: "TTh 15:00-16:30",
      status: "Active"
    }
  ];

  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.instructor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getEnrollmentColor = (enrolled: number, capacity: number) => {
    const percentage = (enrolled / capacity) * 100;
    if (percentage >= 90) return "text-red-600";
    if (percentage >= 75) return "text-yellow-600";
    return "text-green-600";
  };

  const getStatusColor = (status: string) => {
    return status === "Active" 
      ? "bg-green-500/10 text-green-700 border-green-500/20" 
      : "bg-gray-500/10 text-gray-700 border-gray-500/20";
  };

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
          <h2 className="mb-2">Course Management</h2>
          <p className="text-muted-foreground">Organize and manage academic courses</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Course
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Course</DialogTitle>
              <DialogDescription>Enter course information to create a new offering</DialogDescription>
            </DialogHeader>
            <div className="grid md:grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="course-code">Course Code</Label>
                <Input id="course-code" placeholder="e.g., CS101" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="course-credits">Credits</Label>
                <Input id="course-credits" type="number" placeholder="e.g., 3" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="course-name">Course Name</Label>
                <Input id="course-name" placeholder="Enter course name" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="course-description">Description</Label>
                <Textarea id="course-description" placeholder="Enter course description" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="course-department">Department</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cs">Computer Science</SelectItem>
                    <SelectItem value="math">Mathematics</SelectItem>
                    <SelectItem value="physics">Physics</SelectItem>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="biology">Biology</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="course-instructor">Instructor</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select instructor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="williams">Dr. Sarah Williams</SelectItem>
                    <SelectItem value="brown">Prof. Michael Brown</SelectItem>
                    <SelectItem value="chen">Dr. Emily Chen</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="course-capacity">Capacity</Label>
                <Input id="course-capacity" type="number" placeholder="e.g., 50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="course-schedule">Schedule</Label>
                <Input id="course-schedule" placeholder="e.g., MWF 10:00-11:30" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsAddDialogOpen(false)}>
                Add Course
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardDescription>Total Courses</CardDescription>
            <CardTitle>{courses.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Active Courses</CardDescription>
            <CardTitle>{courses.filter(c => c.status === "Active").length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Total Enrollment</CardDescription>
            <CardTitle>{courses.reduce((sum, c) => sum + c.enrolled, 0)}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Avg. Class Size</CardDescription>
            <CardTitle>
              {Math.round(courses.reduce((sum, c) => sum + c.enrolled, 0) / courses.length)}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Course Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Course Catalog</CardTitle>
              <CardDescription>View and manage all courses</CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Course Name</TableHead>
                <TableHead>Instructor</TableHead>
                <TableHead>Department</TableHead>
                <TableHead className="text-center">Credits</TableHead>
                <TableHead>Schedule</TableHead>
                <TableHead className="text-center">Enrollment</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCourses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell>{course.id}</TableCell>
                  <TableCell>{course.name}</TableCell>
                  <TableCell>{course.instructor}</TableCell>
                  <TableCell>{course.department}</TableCell>
                  <TableCell className="text-center">{course.credits}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{course.schedule}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Users className="h-3 w-3" />
                      <span className={getEnrollmentColor(course.enrolled, course.capacity)}>
                        {course.enrolled}/{course.capacity}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className={getStatusColor(course.status)}>
                      {course.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
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
