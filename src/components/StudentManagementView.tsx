import { useState, useEffect } from 'react'; // Import hooks
import axios from 'axios'; // Import axios
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

// --- Define the Student type based on backend data ---
interface Student {
  student_id: string;
  first_name: string;
  last_name: string;
  email: string;
  department: string; // Should match ENUM values ('CMPN', 'IT', etc.)
  current_year: number;
  status: string; // Should match ENUM values ('Active', 'Inactive', 'Alumni')
  // Add other fields like phone if available from backend
}
// ---

export function StudentManagementView({ onBack }: StudentManagementViewProps) {
  // --- State Variables ---
  const [students, setStudents] = useState<Student[]>([]); // To store fetched students
  const [loadingStudents, setLoadingStudents] = useState(true); // Specific loading state
  const [averageSgpa, setAverageSgpa] = useState<string | null>(null); // State for average SGPA
  const [loadingStats, setLoadingStats] = useState(true); // Specific loading state
  const [error, setError] = useState<string | null>(null); // Combined error state
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newStudentId, setNewStudentId] = useState('');
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newDepartment, setNewDepartment] = useState(''); // Store the value ('CMPN', 'IT', etc.)
  const [newYear, setNewYear] = useState(''); // Store the value ('1', '2', '3', '4')
  const [newStatus, setNewStatus] = useState('Active'); // Default to Active
  const [addError, setAddError] = useState<string | null>(null); // Specific error for the dialog
  // --- End State ---

  // --- Data Fetching ---
  const fetchStudents = () => {
    setLoadingStudents(true);
    // Don't clear error here, let fetchAverageSgpa handle its own error clearing potentially
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/students`)
      .then(response => {
        setStudents(response.data);
      })
      .catch(err => {
        console.error("Error fetching students:", err);
        setError("Failed to load student records."); // Set error if students fail
      })
      .finally(() => {
        setLoadingStudents(false);
      });
  };

  const fetchAverageSgpa = () => {
    setLoadingStats(true);
    // Don't clear error here
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/stats/average-gpa`)
      .then(response => {
        setAverageSgpa(response.data.averageSgpa);
      })
      .catch(err => {
        console.error("Error fetching average SGPA:", err);
        // Set error only if student loading hasn't already set one
        setError(prev => prev || "Failed to load average SGPA.");
      })
      .finally(() => {
        setLoadingStats(false);
      });
  }

  // Fetch data when component mounts
  useEffect(() => {
    setError(null); // Clear errors on mount
    fetchStudents();
    fetchAverageSgpa(); // Fetch both sets of data
  }, []); // Empty dependency array means run once
  // --- End Data Fetching ---


  // --- Calculations for Stat Cards (Derived from state) ---
  // These calculations run on every render, using the current 'students' state
  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.status === 'Active').length;
  const departmentCount = new Set(students.map(s => s.department)).size;
  // --- End Calculations ---


  // --- Filtering Logic (Derived from state) ---
  const filteredStudents = students.filter(student =>
    (student.first_name + ' ' + student.last_name).toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.student_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  // --- End Filtering ---

  // --- Helper function for Badge color ---
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-500/10 text-green-700 border-green-500/20";
      case "Inactive": return "bg-gray-500/10 text-gray-700 border-gray-500/20";
      case "Alumni": return "bg-blue-500/10 text-blue-700 border-blue-500/20";
      default: return "bg-gray-500/10 text-gray-700 border-gray-500/20";
    }
  };
  // --- End Helper ---

  // --- Placeholder Handlers ---
  const handleDeleteStudent = (studentId: string) => {
    console.log(`Attempting to delete student: ${studentId}`);
    // Show confirmation before deleting
    if(window.confirm(`Are you sure you want to delete student ${studentId}? This action cannot be undone.`)) {
        setError(null); // Clear previous errors
        axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/students/${studentId}`)
        .then(response => {
            console.log(response.data.message);
            // Refresh the student list after successful deletion
            fetchStudents();
            fetchAverageSgpa(); // Recalculate stats if needed (though avg SGPA won't change)
        })
        .catch(err => {
            console.error("Error deleting student:", err);
            // Display error message from backend if available
            setError(err.response?.data?.message || "Failed to delete student. They may have existing records.");
        });
    }
  };

  // Basic Add Student Handler (Needs more validation and state management)
   const handleAddSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
       event.preventDefault();
       setError(null);
       const formData = new FormData(event.currentTarget);
       const newStudentData = Object.fromEntries(formData.entries());

       // Basic validation example (add more robust validation)
       if (!newStudentData.student_id || !newStudentData.first_name || !newStudentData.last_name || !newStudentData.email || !newStudentData.password || !newStudentData.department || !newStudentData.current_year) {
           setError("Please fill in all required fields.");
           return;
       }

       console.log("Submitting new student:", newStudentData);

       try {
           const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/students`, newStudentData);
           if (response.status === 201) {
               setIsAddDialogOpen(false); // Close dialog on success
               fetchStudents(); // Refresh student list
               fetchAverageSgpa(); // Refresh stats
           }
       } catch (err: any) {
           console.error("Error adding student:", err);
           setError(err.response?.data?.message || "Failed to add student.");
       }
   };


  const handleEditStudent = (studentId: string) => { console.log(`Edit student clicked: ${studentId}`); /* TODO: Implement Edit Modal Logic */ };
  // --- End Handlers ---


  // --- Loading/Error UI ---
  // Show loading only if either fetch is happening
  const isLoading = loadingStudents || loadingStats;
  // ---

  // --- Main JSX ---
  return (
    <div className="space-y-6">
      <Button variant="outline" size="sm" onClick={onBack}>
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
      </Button>

      <div className="flex items-center justify-between">
         <div>
           <h2 className="mb-1 text-2xl font-bold">Student Management</h2>
           <p className="text-muted-foreground">Manage and monitor student records</p>
         </div>
         {/* Add Student Dialog Trigger */}
         <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
           <DialogTrigger asChild>
             <Button>
               <Plus className="h-4 w-4 mr-2" /> Add Student
             </Button>
           </DialogTrigger>
           {/* Add Student Dialog Content */}
           <DialogContent>
             <DialogHeader>
               <DialogTitle>Add New Student</DialogTitle>
               <DialogDescription>Enter student information to create a new record.</DialogDescription>
             </DialogHeader>
             {/* Form for adding student */}
             <form onSubmit={handleAddSubmit} className="space-y-4 py-4">
                 {/* Input fields with 'name' attribute matching backend expected keys */}
                 <div className="space-y-2"><Label htmlFor="add-student-id">Student ID*</Label><Input id="add-student-id" name="student_id" placeholder="e.g., STU2025001" required /></div>
                 <div className="space-y-2"><Label htmlFor="add-student-fname">First Name*</Label><Input id="add-student-fname" name="first_name" placeholder="Enter first name" required /></div>
                 <div className="space-y-2"><Label htmlFor="add-student-lname">Last Name*</Label><Input id="add-student-lname" name="last_name" placeholder="Enter last name" required /></div>
                 <div className="space-y-2"><Label htmlFor="add-student-email">Email*</Label><Input id="add-student-email" name="email" type="email" placeholder="Enter email address" required /></div>
                 <div className="space-y-2"><Label htmlFor="add-student-password">Password*</Label><Input id="add-student-password" name="password" type="password" placeholder="Enter initial password" required /></div>
                 <div className="space-y-2"><Label htmlFor="add-student-dept">Department*</Label><Select name="department" required><SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger><SelectContent><SelectItem value="CMPN">CMPN</SelectItem><SelectItem value="IT">IT</SelectItem><SelectItem value="EXCS">EXCS</SelectItem><SelectItem value="EXTC">EXTC</SelectItem></SelectContent></Select></div>
                 <div className="space-y-2"><Label htmlFor="add-student-year">Year*</Label><Select name="current_year" required><SelectTrigger><SelectValue placeholder="Select year" /></SelectTrigger><SelectContent><SelectItem value="1">1</SelectItem><SelectItem value="2">2</SelectItem><SelectItem value="3">3</SelectItem><SelectItem value="4">4</SelectItem></SelectContent></Select></div>
                  {/* Optional fields */}
                 <div className="space-y-2"><Label htmlFor="add-student-ad-date">Admission Date</Label><Input id="add-student-ad-date" name="admission_date" type="date" /></div>
                 <div className="space-y-2"><Label htmlFor="add-student-status">Status</Label><Select name="status"><SelectTrigger><SelectValue placeholder="Select status (default Active)" /></SelectTrigger><SelectContent><SelectItem value="Active">Active</SelectItem><SelectItem value="Inactive">Inactive</SelectItem></SelectContent></Select></div>

                 {/* Display error within the dialog */}
                 {error && <p className="text-sm text-red-500">{error}</p>}

                 <DialogFooter>
                   <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                   <Button type="submit">Add Student</Button>
                 </DialogFooter>
             </form>
           </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards (Now Dynamic) */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Students</CardDescription>
            {/* Show loading indicator if students haven't loaded yet */}
            <CardTitle className="text-3xl">{loadingStudents ? '...' : totalStudents}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Students</CardDescription>
            <CardTitle className="text-3xl">{loadingStudents ? '...' : activeStudents}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Average SGPA</CardDescription>
            {/* Show loading indicator if stats haven't loaded yet */}
            <CardTitle className="text-3xl">{loadingStats ? '...' : (averageSgpa !== null ? averageSgpa : 'N/A')}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Departments</CardDescription>
            <CardTitle className="text-3xl">{loadingStudents ? '...' : departmentCount}</CardTitle>
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
            <div className="relative w-full max-w-sm">
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
           {/* Show main error or loading for the table */}
           {loadingStudents ? (
               <p className="text-center text-muted-foreground py-4">Loading students...</p>
           ) : error ? (
               <p className="text-center text-red-500 py-4">{error}</p>
           ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead className="text-center">Year</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.length === 0 ? (
                   <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground h-24">No students found{searchQuery ? ' matching your search' : ''}.</TableCell></TableRow>
                ) : (
                  filteredStudents.map((student) => (
                    <TableRow key={student.student_id}>
                      <TableCell className="font-medium">{student.student_id}</TableCell>
                      <TableCell>{student.first_name} {student.last_name}</TableCell>
                      <TableCell>
                         <div className="space-y-1 text-sm text-muted-foreground">
                           <div className="flex items-center gap-1"> <Mail className="h-3 w-3" /> <span>{student.email}</span> </div>
                           {/* Add Phone back if needed */}
                         </div>
                      </TableCell>
                      <TableCell>{student.department}</TableCell>
                      <TableCell className="text-center">{student.current_year}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className={getStatusColor(student.status)}> {student.status} </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Button variant="ghost" size="icon" onClick={() => handleEditStudent(student.student_id)} title="Edit"> <Edit className="h-4 w-4" /> </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteStudent(student.student_id)} title="Delete" className="text-destructive hover:text-destructive/80"> <Trash2 className="h-4 w-4" /> </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
           )}
        </CardContent>
      </Card>
    </div>
  );
}

