import { useState, useEffect } from 'react'; // Import hooks
import axios from 'axios'; // Import axios
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
// --- UPDATED: Added GraduationCap and Loader2 ---
import { ArrowLeft, Search, Plus, Trash2, Mail, GraduationCap, Loader2 } from "lucide-react";
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
  department: string;
  current_year: number;
  status: string;
}

// --- NEW: Types for Enrollment Data ---
interface CourseName {
  course_id: string;
  course_name: string;
}
interface Semester {
  semester_id: number;
  semester_name: string;
}
// ---

export function StudentManagementView({ onBack }: StudentManagementViewProps) {
  // --- State Variables ---
  const [students, setStudents] = useState<Student[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [averageSgpa, setAverageSgpa] = useState<string | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [addError, setAddError] = useState<string | null>(null); // Specific error for the dialog

  // --- NEW: State for Enroll Student Dialog ---
  const [isEnrollDialogOpen, setIsEnrollDialogOpen] = useState(false);
  const [studentToEnroll, setStudentToEnroll] = useState<Student | null>(null);
  const [enrollmentData, setEnrollmentData] = useState<{ courses: CourseName[], semesters: Semester[] }>({ courses: [], semesters: [] });
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedSemesterId, setSelectedSemesterId] = useState("");
  const [isEnrollDataLoading, setIsEnrollDataLoading] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [enrollError, setEnrollError] = useState<string | null>(null);
  // --- End State ---

  // --- Data Fetching (No changes here) ---
  const fetchStudents = () => {
    setLoadingStudents(true);
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/students`)
      .then(response => {
        setStudents(response.data);
      })
      .catch(err => {
        console.error("Error fetching students:", err);
        setError("Failed to load student records.");
      })
      .finally(() => {
        setLoadingStudents(false);
      });
  };

  const fetchAverageSgpa = () => {
    setLoadingStats(true);
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/stats/average-gpa`)
      .then(response => {
        setAverageSgpa(response.data.averageSgpa);
      })
      .catch(err => {
        console.error("Error fetching average SGPA:", err);
        setError(prev => prev || "Failed to load average SGPA.");
      })
      .finally(() => {
        setLoadingStats(false);
      });
  }

  useEffect(() => {
    setError(null);
    fetchStudents();
    fetchAverageSgpa();
  }, []);
  // --- End Data Fetching ---

  // --- Calculations (No changes here) ---
  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.status === 'Active').length;
  const departmentCount = new Set(students.map(s => s.department)).size;
  // --- End Calculations ---

  // --- Filtering Logic (No changes here) ---
  const filteredStudents = students.filter(student =>
    (student.first_name + ' ' + student.last_name).toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.student_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  // --- End Filtering ---

  // --- Helper function (No changes here) ---
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-500/10 text-green-700 border-green-500/20";
      case "Inactive": return "bg-gray-500/10 text-gray-700 border-gray-500/20";
      case "Alumni": return "bg-blue-500/10 text-blue-700 border-blue-500/20";
      default: return "bg-gray-500/10 text-gray-700 border-gray-500/20";
    }
  };
  // --- End Helper ---

  // --- Handlers ---
  const handleDeleteStudent = (studentId: string) => {
    console.log(`Attempting to delete student: ${studentId}`);
    if (window.confirm(`Are you sure you want to delete student ${studentId}? This action cannot be undone.`)) {
      setError(null);
      axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/students/${studentId}`)
        .then(response => {
          console.log(response.data.message);
          fetchStudents();
          fetchAverageSgpa();
        })
        .catch(err => {
          console.error("Error deleting student:", err);
          setError(err.response?.data?.message || "Failed to delete student. They may have existing records.");
        });
    }
  };

  const handleAddSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAddError(null); // --- FIX: Use addError state ---
    const formData = new FormData(event.currentTarget);
    const newStudentData = Object.fromEntries(formData.entries());

    if (!newStudentData.student_id || !newStudentData.first_name || !newStudentData.last_name || !newStudentData.email || !newStudentData.password || !newStudentData.department || !newStudentData.current_year) {
      setAddError("Please fill in all required fields."); // --- FIX: Use addError state ---
      return;
    }
    console.log("Submitting new student:", newStudentData);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/students`, newStudentData);
      if (response.status === 201) {
        setIsAddDialogOpen(false);
        fetchStudents();
        fetchAverageSgpa();
      }
    } catch (err: any) {
      console.error("Error adding student:", err);
      setAddError(err.response?.data?.message || "Failed to add student."); // --- FIX: Use addError state ---
    }
  };

  // --- NEW: Handlers for Enroll Dialog ---
  const openEnrollDialog = async (student: Student) => {
    setStudentToEnroll(student);
    setIsEnrollDialogOpen(true);
    setIsEnrollDataLoading(true);
    setEnrollError(null);
    setSelectedCourseId("");
    setSelectedSemesterId("");

    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/enrollment-data`);
      setEnrollmentData(response.data);
    } catch (err: any) {
      console.error("Error fetching enrollment data:", err);
      setEnrollError(err.response?.data?.message || "Failed to load courses and semesters.");
    } finally {
      setIsEnrollDataLoading(false);
    }
  };

  const handleEnrollSubmit = async () => {
    if (!studentToEnroll || !selectedCourseId || !selectedSemesterId) {
      setEnrollError("Please select both a course and a semester.");
      return;
    }

    setIsEnrolling(true);
    setEnrollError(null);

    const payload = {
      student_id: studentToEnroll.student_id,
      course_id: selectedCourseId,
      semester_id: Number(selectedSemesterId),
    };

    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/enrollments`, payload);
      // Success
      setIsEnrollDialogOpen(false);
      // Optionally, you could show a success toast here
      // We don't need to refresh the student list, but we could.
    } catch (err: any) {
      console.error("Error creating enrollment:", err);
      setEnrollError(err.response?.data?.message || "Failed to enroll student.");
    } finally {
      setIsEnrolling(false);
    }
  };
  // --- End Handlers ---

  // --- Loading/Error UI ---
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
        <Dialog open={isAddDialogOpen} onOpenChange={(isOpen: boolean) => { setIsAddDialogOpen(isOpen); setAddError(null); }}>
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
              {/* ... (rest of your add form is unchanged) ... */}
              <div className="space-y-2"><Label htmlFor="add-student-id">Student ID*</Label><Input id="add-student-id" name="student_id" placeholder="e.g., STU2025001" required /></div>
              <div className="space-y-2"><Label htmlFor="add-student-fname">First Name*</Label><Input id="add-student-fname" name="first_name" placeholder="Enter first name" required /></div>
              <div className="space-y-2"><Label htmlFor="add-student-lname">Last Name*</Label><Input id="add-student-lname" name="last_name" placeholder="Enter last name" required /></div>
              <div className="space-y-2"><Label htmlFor="add-student-email">Email*</Label><Input id="add-student-email" name="email" type="email" placeholder="Enter email address" required /></div>
              <div className="space-y-2"><Label htmlFor="add-student-password">Password*</Label><Input id="add-student-password" name="password" type="password" placeholder="Enter initial password" required /></div>
              <div className="space-y-2"><Label htmlFor="add-student-dept">Department*</Label><Select name="department" required><SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger><SelectContent><SelectItem value="CMPN">CMPN</SelectItem><SelectItem value="IT">IT</SelectItem><SelectItem value="EXCS">EXCS</SelectItem><SelectItem value="EXTC">EXTC</SelectItem></SelectContent></Select></div>
              <div className="space-y-2"><Label htmlFor="add-student-year">Year*</Label><Select name="current_year" required><SelectTrigger><SelectValue placeholder="Select year" /></SelectTrigger><SelectContent><SelectItem value="1">1</SelectItem><SelectItem value="2">2</SelectItem><SelectItem value="3">3</SelectItem><SelectItem value="4">4</SelectItem></SelectContent></Select></div>
              <div className="space-y-2"><Label htmlFor="add-student-ad-date">Admission Date</Label><Input id="add-student-ad-date" name="admission_date" type="date" /></div>
              <div className="space-y-2"><Label htmlFor="add-student-status">Status</Label><Select name="status"><SelectTrigger><SelectValue placeholder="Select status (default Active)" /></SelectTrigger><SelectContent><SelectItem value="Active">Active</SelectItem><SelectItem value="Inactive">Inactive</SelectItem></SelectContent></Select></div>

              {/* --- FIX: Display addError here --- */}
              {addError && <p className="text-sm text-red-500">{addError}</p>}

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button type="submit">Add Student</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards (No changes here) */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Students</CardDescription>
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
            <CardTitle className="text-3xl">{loadingStats ? '...' : (averageSgpa !== null ? averageSgpa : 'N/A')}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Departments</CardDescription>
            <CardTitle className="text-3xl">{loadingStats ? '...' : departmentCount}</CardTitle>
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
          {loadingStudents ? (
            <p className="text-center text-muted-foreground py-4">Loading students...</p>
          ) : error && !addError ? ( // Only show main error if addError isn't active
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
                        </div>
                      </TableCell>
                      <TableCell>{student.department}</TableCell>
                      <TableCell className="text-center">{student.current_year}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className={getStatusColor(student.status)}> {student.status} </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          {/* --- NEW: Enroll Button --- */}
                          <Button variant="ghost" size="icon" onClick={() => openEnrollDialog(student)} title="Enroll Student" className="text-blue-600 hover:text-blue-500">
                            <GraduationCap className="h-4 w-4" />
                          </Button>
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

      {/* --- NEW: Enroll Student Dialog --- */}
      <Dialog open={isEnrollDialogOpen} onOpenChange={setIsEnrollDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enroll Student</DialogTitle>
            <DialogDescription>
              Enrolling <span className="font-medium text-foreground">{studentToEnroll?.first_name} {studentToEnroll?.last_name}</span> (Year: {studentToEnroll?.current_year})
            </DialogDescription>
          </DialogHeader>

          {isEnrollDataLoading ? (
            <div className="flex justify-center items-center h-24">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="space-y-4 py-4">
              {(() => {
                // --- This is the smart filter logic ---
                if (!studentToEnroll) return null;
                const year = studentToEnroll.current_year;
                const validSemesterIds: { [key: number]: number[] } = {
                  1: [1, 2],
                  2: [3, 4],
                  3: [5, 6],
                  4: [7, 8],
                };
                const allowedIds = validSemesterIds[year] || [];
                const filteredSemesters = enrollmentData.semesters.filter(sem =>
                  allowedIds.includes(sem.semester_id)
                );
                // --- End of logic ---

                return (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="enroll-semester">Semester</Label>
                      <Select value={selectedSemesterId} onValueChange={setSelectedSemesterId}>
                        <SelectTrigger id="enroll-semester">
                          <SelectValue placeholder="Select a semester..." />
                        </SelectTrigger>
                        <SelectContent>
                          {filteredSemesters.length > 0 ? (
                            filteredSemesters.map(sem => (
                              <SelectItem key={sem.semester_id} value={String(sem.semester_id)}>
                                {sem.semester_name}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="none" disabled>No valid semesters found for this student's year</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="enroll-course">Course</Label>
                      <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
                        <SelectTrigger id="enroll-course">
                          <SelectValue placeholder="Select a course..." />
                        </SelectTrigger>
                        <SelectContent>
                          {enrollmentData.courses.length > 0 ? (
                            enrollmentData.courses.map(course => (
                              <SelectItem key={course.course_id} value={course.course_id}>
                                {course.course_id} - {course.course_name}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="none" disabled>No courses found</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                );
              })()}

              {/* Display error within the dialog */}
              {enrollError && <p className="text-sm text-red-500">{enrollError}</p>}
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsEnrollDialogOpen(false)} disabled={isEnrolling}>
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={handleEnrollSubmit}
              disabled={isEnrolling || isEnrollDataLoading || !selectedCourseId || !selectedSemesterId}
            >
              {isEnrolling && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {isEnrolling ? 'Enrolling...' : 'Enroll Student'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}