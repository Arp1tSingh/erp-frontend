import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ArrowLeft, Search, Plus, Edit, Trash2, Mail, Phone } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "./ui/dialog";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface StudentManagementViewProps {
  onBack: () => void;
}

export function StudentManagementView({ onBack }: StudentManagementViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const students = [
    {
      id: "STU2024001",
      name: "John Doe",
      email: "john.doe@university.edu",
      phone: "+1 (555) 123-4567",
      department: "Computer Science",
      year: "3rd Year",
      gpa: 3.75,
      status: "Active"
    },
    {
      id: "STU2024002",
      name: "Sarah Johnson",
      email: "sarah.j@university.edu",
      phone: "+1 (555) 234-5678",
      department: "Mathematics",
      year: "2nd Year",
      gpa: 3.92,
      status: "Active"
    },
    {
      id: "STU2024003",
      name: "Michael Chen",
      email: "m.chen@university.edu",
      phone: "+1 (555) 345-6789",
      department: "Physics",
      year: "4th Year",
      gpa: 3.68,
      status: "Active"
    },
    {
      id: "STU2024004",
      name: "Emily Rodriguez",
      email: "emily.r@university.edu",
      phone: "+1 (555) 456-7890",
      department: "Engineering",
      year: "1st Year",
      gpa: 3.85,
      status: "Active"
    },
    {
      id: "STU2024005",
      name: "David Kim",
      email: "d.kim@university.edu",
      phone: "+1 (555) 567-8901",
      department: "Computer Science",
      year: "3rd Year",
      gpa: 3.45,
      status: "Inactive"
    },
    {
      id: "STU2024006",
      name: "Lisa Anderson",
      email: "lisa.a@university.edu",
      phone: "+1 (555) 678-9012",
      department: "Biology",
      year: "2nd Year",
      gpa: 3.78,
      status: "Active"
    }
  ];

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <h2 className="mb-2">Student Management</h2>
          <p className="text-muted-foreground">Manage and monitor student records</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Student
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Student</DialogTitle>
              <DialogDescription>Enter student information to create a new record</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="student-name">Full Name</Label>
                <Input id="student-name" placeholder="Enter student name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="student-email">Email</Label>
                <Input id="student-email" type="email" placeholder="Enter email address" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="student-phone">Phone</Label>
                <Input id="student-phone" placeholder="Enter phone number" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="student-department">Department</Label>
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
                <Label htmlFor="student-year">Year</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1st Year</SelectItem>
                    <SelectItem value="2">2nd Year</SelectItem>
                    <SelectItem value="3">3rd Year</SelectItem>
                    <SelectItem value="4">4th Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsAddDialogOpen(false)}>
                Add Student
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardDescription>Total Students</CardDescription>
            <CardTitle>{students.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Active Students</CardDescription>
            <CardTitle>{students.filter(s => s.status === "Active").length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Average GPA</CardDescription>
            <CardTitle>
              {(students.reduce((sum, s) => sum + s.gpa, 0) / students.length).toFixed(2)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Departments</CardDescription>
            <CardTitle>
              {new Set(students.map(s => s.department)).size}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Student Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Student Records</CardTitle>
              <CardDescription>View and manage all student information</CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search students..."
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
                <TableHead>Student ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Department</TableHead>
                <TableHead className="text-center">Year</TableHead>
                <TableHead className="text-center">GPA</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.id}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        <span>{student.email}</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        <span>{student.phone}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{student.department}</TableCell>
                  <TableCell className="text-center">{student.year}</TableCell>
                  <TableCell className="text-center">{student.gpa.toFixed(2)}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className={getStatusColor(student.status)}>
                      {student.status}
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
