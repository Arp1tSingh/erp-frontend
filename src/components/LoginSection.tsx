import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { UserCircle, Shield } from "lucide-react";
import axios from 'axios';

interface LoginSectionProps {
  onLogin: (role: "student" | "admin") => void;
}

export function LoginSection({ onLogin }: LoginSectionProps) {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  // 2. This is the new, real handleSubmit function
  const handleSubmit = async (event: React.FormEvent, role: "student" | "admin") => {
  event.preventDefault();
  setError(null);

  const loginUrl = 'http://localhost:3001/api/login';

  try {
    const response = await axios.post(loginUrl, {
      userId: id, 
      password: password,
      role: role,
    });

    if (response.status === 200) {
      // --- THIS IS THE NEW LINE YOU NEED TO ADD ---
      // Save the user object returned from the backend to the browser's local storage.
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Now we call the onLogin function to trigger the redirect (this stays the same).
      onLogin(role);
    }

  } catch (err: any) {
    if (err.response && err.response.data && err.response.data.message) {
      setError(err.response.data.message);
    } else {
      setError("Login failed. Please try again later.");
    }
  }
};

  // 3. Create a function to clear the form when tabs change
  const handleTabChange = () => {
    setId("");
    setPassword("");
    setError(null);
  };

  // --- EDITS END HERE ---

  return (
    <div className="w-full max-w-md">
      {/* Add onValueChange to clear the form */}
      <Tabs defaultValue="student" className="w-full" onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="student" className="gap-2">
            <UserCircle className="h-4 w-4" />
            Student
          </TabsTrigger>
          <TabsTrigger value="admin" className="gap-2">
            <Shield className="h-4 w-4" />
            Admin
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="student">
          {/* Wrap content in a form element */}
          <form onSubmit={(e) => handleSubmit(e, 'student')}>
            <Card>
              <CardHeader>
                <CardTitle>Student Login</CardTitle>
                <CardDescription>
                  Access your academic records and resources
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="student-id">Student ID</Label>
                  <Input 
                    id="student-id" 
                    placeholder="Enter your student ID" 
                    type="text"
                    // Bind input to state
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="student-password">Password</Label>
                  <Input 
                    id="student-password" 
                    placeholder="Enter your password" 
                    type="password"
                    // Bind input to state
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                {/* Conditionally render error message */}
                {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                <Button 
                  className="w-full" 
                  type="submit" // Change to a submit button
                >
                  Sign In
                </Button>
                <div className="text-center text-sm">
                  <a href="#" className="underline text-muted-foreground hover:text-foreground transition-colors">
                    Forgot password?
                  </a>
                </div>
              </CardContent>
            </Card>
          </form>
        </TabsContent>
        
        <TabsContent value="admin">
          {/* Wrap content in a form element */}
          <form onSubmit={(e) => handleSubmit(e, 'admin')}>
            <Card>
              <CardHeader>
                <CardTitle>Admin Login</CardTitle>
                <CardDescription>
                  Access the administrative dashboard
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Admin ID</Label>
                  <Input 
                    id="admin-id" 
                    placeholder="Enter your admin email ID" 
                    type="text" // Changed to text to match student ID
                    // Bind input to state
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-password">Password</Label>
                  <Input 
                    id="admin-password" 
                    placeholder="Enter your password" 
                    type="password"
                    // Bind input to state
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                {/* Conditionally render error message */}
                {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                <Button 
                  className="w-full" 
                  type="submit" // Change to a submit button
                >
                  Sign In
                </Button>
                <div className="text-center text-sm">
                  <a href="#" className="underline text-muted-foreground hover:text-foreground transition-colors">
                    Forgot password?
                  </a>
                </div>
              </CardContent>
            </Card>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}