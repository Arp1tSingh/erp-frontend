import { useState, useEffect } from "react";
import axios from "axios"; 
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ArrowLeft, Search, Plus, Edit, Trash2, Users, Clock, Loader2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "./ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

// --- Types (No change) ---
type Course = {
  course_id: string;
  course_name: string;
  credit_hours: number;
  faculty_name: string;
  department: string;
  schedule: string;
  status: string;
  enrollmentCount: number; 
};

// This type is used for both Add and Edit forms
type CourseFormData = {
  course_id: string;
  course_name: string;
  credit_hours: string; 
  faculty_name: string;
  department: string;
  schedule: string;
  status: string;
};

interface CourseManagementViewProps {
  onBack: () => void;
}

const initialFormState: CourseFormData = {
  course_id: "",
  course_name: "",
  credit_hours: "",
  faculty_name: "",
  department: "CMPN", // Default value
  schedule: "",
  status: "Active", // Default value
};

// --- Component ---

export function CourseManagementView({ onBack }: CourseManagementViewProps) {
  // --- State Definitions ---
  
  const [courses, setCourses] = useState<Course[]>([]);
  const [stats, setStats] = useState({
    totalCourses: 0,
    activeCourses: 0,
    totalEnrollment: 0,
    avgClassSize: 0,
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Add Dialog State
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newCourseData, setNewCourseData] = useState<CourseFormData>(initialFormState);

  // Delete Dialog State
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // --- NEW: Edit Dialog State ---
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editFormData, setEditFormData] = useState<CourseFormData>(initialFormState);


  // --- Data Fetching ---

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  async function fetchCourseData() {
    // We don't set loading to true here, so the refresh is smoother
    // setLoading(true); 
    setError(null);

    try {
      const response = await axios.get(`${apiBaseUrl}/api/admin/courses-overview`);
      setStats(response.data.stats);
      setCourses(response.data.courses);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(`Failed to load data: ${errorMessage}`);
      console.error('Error fetching course data:', err);
    } finally {
      setLoading(false); // Only set loading false on initial load
    }
  }

  useEffect(() => {
    fetchCourseData(); // This runs once on mount
  }, []);

  // --- Add Form Handlers ---

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setNewCourseData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSelectChange = (name: keyof CourseFormData) => (value: string) => {
    setNewCourseData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddCourse = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const dataToSend = {
        ...newCourseData,
        credit_hours: Number(newCourseData.credit_hours),
      };
      
      await axios.post(`${apiBaseUrl}/api/courses`, dataToSend);

      setIsAddDialogOpen(false);
      setNewCourseData(initialFormState);
      await fetchCourseData(); // Refresh data

    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to add course";
      setError(errorMessage);
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Delete Handlers ---

  const openDeleteDialog = (course: Course) => {
    setCourseToDelete(course);
    setIsDeleteDialogOpen(true);
    setError(null); 
  };

  const handleDeleteCourse = async () => {
    if (!courseToDelete) return;
    
    setIsDeleting(true);
    setError(null);

    try {
      await axios.delete(`${apiBaseUrl}/api/courses/${courseToDelete.course_id}`);
      
      setIsDeleteDialogOpen(false);
      setCourseToDelete(null);
      await fetchCourseData(); // Refresh data

    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to delete course.";
      setError(errorMessage);
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };
  
  // --- NEW: Edit Handlers ---
  
  // 1. Opens the edit dialog and pre-fills the form
  const openEditDialog = (course: Course) => {
    // Convert 'credit_hours' (number) to a string for the form input
    const formData = {
      ...course,
      credit_hours: String(course.credit_hours),
    };
    setEditFormData(formData);
    setIsEditDialogOpen(true);
    setError(null);
  };

  // 2. Handles changes in the EDIT form's inputs
  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };
  
  // 3. Handles changes in the EDIT form's selects
  const handleEditSelectChange = (name: keyof CourseFormData) => (value: string) => {
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 4. Submits the UPDATE request
  const handleUpdateCourse = async () => {
    setIsUpdating(true);
    setError(null);

    try {
      // Prepare data, converting credits back to number
      const dataToSend = {
        ...editFormData,
        credit_hours: Number(editFormData.credit_hours),
      };
      
      // We don't send course_id in the body, it's in the URL
      // (though our backend logic handles it if it's there)
      const { course_id, ...updateData } = dataToSend;

      await axios.put(`${apiBaseUrl}/api/courses/${editFormData.course_id}`, updateData);
      
      // Success
      setIsEditDialogOpen(false);
      await fetchCourseData(); // Refresh data

    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to update course.";
      setError(errorMessage);
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  // --- Render Logic (No change) ---
  const filteredCourses = courses.filter(course =>
    course.course_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.course_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.faculty_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    return status === "Active" 
      ? "bg-green-500/10 text-green-700 border-green-500/20" 
      : "bg-gray-500/10 text-gray-700 border-gray-500/20";
  };
  
  if (loading && courses.length === 0) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }
  
  {error && !isAddDialogOpen && !isDeleteDialogOpen && !isEditDialogOpen && (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong className="font-bold">Error: </strong>
      <span className="block sm:inline">{error}</span>
    </div>
  )}

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
        
        {/* --- Add Course Dialog (No change) --- */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setError(null); setNewCourseData(initialFormState); }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Course
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Course</DialogTitle>
              <DialogDescription>Enter course information to create a new offering</DialogDescription>
            </DialogHeader>
            {error && isAddDialogOpen && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm" role="alert">
                {error}
              </div>
            )}
            <div className="grid md:grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="course_id">Course Code</Label>
                <Input id="course_id" placeholder="e.g., CS101" value={newCourseData.course_id} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="credit_hours">Credits</Label>
                <Input id="credit_hours" type="number" placeholder="e.g., 3" value={newCourseData.credit_hours} onChange={handleInputChange} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="course_name">Course Name</Label>
                <Input id="course_name" placeholder="Enter course name" value={newCourseData.course_name} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select value={newCourseData.department} onValueChange={handleSelectChange('department')}>
                  <SelectTrigger id="department">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CMPN">CMPN</SelectItem>
                    <SelectItem value="IT">IT</SelectItem>
                    <SelectItem value="EXCS">EXCS</SelectItem>
                    <SelectItem value="EXTC">EXTC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="faculty_name">Instructor</Label>
                <Input id="faculty_name" placeholder="e.g., Dr. Sarah Williams" value={newCourseData.faculty_name} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="schedule">Schedule</Label>
                <Input id="schedule" placeholder="e.g., MWF 10:00-11:30" value={newCourseData.schedule} onChange={handleInputChange} />
              </div>
               <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={newCourseData.status} onValueChange={handleSelectChange('status')}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button onClick={handleAddCourse} disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                {isSubmitting ? "Adding..." : "Add Course"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* --- Stats Cards (No change) --- */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardDescription>Total Courses</CardDescription>
            <CardTitle>{loading ? "..." : stats.totalCourses}</CardTitle>
          </CardHeader>
        </Card>
        {/* ...other cards... */}
        <Card>
          <CardHeader>
            <CardDescription>Active Courses</CardDescription>
            <CardTitle>{loading ? "..." : stats.activeCourses}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Total Enrollment</CardDescription>
            <CardTitle>{loading ? "..." : stats.totalEnrollment}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Avg. Class Size</CardDescription>
            <CardTitle>{loading ? "..." : stats.avgClassSize}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* --- Course Table --- */}
      <Card>
        <CardHeader>{/* ... */}</CardHeader>
        <CardContent>
          <Table>
            <TableHeader>{/* ... */}</TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto my-4 text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ) : filteredCourses.length === 0 ? (
                 <TableRow>
                  <TableCell colSpan={9} className="text-center">
                    No courses found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredCourses.map((course) => (
                  <TableRow key={course.course_id}>
                    <TableCell>{course.course_id}</TableCell>
                    <TableCell>{course.course_name}</TableCell>
                    <TableCell>{course.faculty_name}</TableCell>
                    <TableCell>{course.department}</TableCell>
                    <TableCell className="text-center">{course.credit_hours}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{course.schedule}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>{course.enrollmentCount ?? 0}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className={getStatusColor(course.status)}>
                        {course.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        
                        {/* --- MODIFIED: Edit Button --- */}
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => openEditDialog(course)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        
                        {/* --- Delete Button (No change) --- */}
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => openDeleteDialog(course)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* --- Delete Confirmation Dialog (No change) --- */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the course
              <strong className="text-foreground"> {courseToDelete?.course_id} - {courseToDelete?.course_name}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {error && isDeleteDialogOpen && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm" role="alert">
              {error}
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={handleDeleteCourse}
              disabled={isDeleting}
            >
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {isDeleting ? "Deleting..." : "Continue"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* --- NEW: Edit Course Dialog --- */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Course</DialogTitle>
            <DialogDescription>
              Updating course: {editFormData.course_id} - {editFormData.course_name}
            </DialogDescription>
          </DialogHeader>
          
          {/* Show edit-specific errors here */}
          {error && isEditDialogOpen && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm" role="alert">
              {error}
            </div>
          )}
          
          <div className="grid md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-course-code">Course Code</Label>
              <Input id="edit-course-code" value={editFormData.course_id} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="credit_hours">Credits</Label>
              <Input id="credit_hours" type="number" placeholder="e.g., 3" value={editFormData.credit_hours} onChange={handleEditInputChange} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="course_name">Course Name</Label>
              <Input id="course_name" placeholder="Enter course name" value={editFormData.course_name} onChange={handleEditInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select value={editFormData.department} onValueChange={handleEditSelectChange('department')}>
                <SelectTrigger id="department">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CMPN">CMPN</SelectItem>
                  <SelectItem value="IT">IT</SelectItem>
                  <SelectItem value="EXCS">EXCS</SelectItem>
                  <SelectItem value="EXTC">EXTC</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="faculty_name">Instructor</Label>
              <Input id="faculty_name" placeholder="e.g., Dr. Sarah Williams" value={editFormData.faculty_name} onChange={handleEditInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="schedule">Schedule</Label>
              <Input id="schedule" placeholder="e.g., MWF 10:00-11:30" value={editFormData.schedule} onChange={handleEditInputChange} />
            </div>
             <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={editFormData.status} onValueChange={handleEditSelectChange('status')}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={isUpdating}>
              Cancel
            </Button>
            <Button onClick={handleUpdateCourse} disabled={isUpdating}>
              {isUpdating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {isUpdating ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}