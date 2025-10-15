import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { ArrowLeft, Download, FileText, Video, Link as LinkIcon, BookOpen } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";

interface ResourcesViewProps {
  onBack: () => void;
}

export function ResourcesView({ onBack }: ResourcesViewProps) {
  const resources = {
    documents: [
      {
        id: 1,
        title: "Data Structures - Lecture Notes Week 1",
        course: "CS102",
        type: "PDF",
        size: "2.4 MB",
        uploadedDate: "2025-10-01"
      },
      {
        id: 2,
        title: "Calculus II - Problem Set 3",
        course: "MATH201",
        type: "PDF",
        size: "1.2 MB",
        uploadedDate: "2025-10-05"
      },
      {
        id: 3,
        title: "Physics I - Lab Manual",
        course: "PHYS201",
        type: "PDF",
        size: "5.8 MB",
        uploadedDate: "2025-09-28"
      },
      {
        id: 4,
        title: "Technical Writing - Style Guide",
        course: "ENG105",
        type: "DOCX",
        size: "890 KB",
        uploadedDate: "2025-10-03"
      }
    ],
    videos: [
      {
        id: 1,
        title: "Introduction to Linked Lists",
        course: "CS102",
        duration: "45:30",
        uploadedDate: "2025-10-02"
      },
      {
        id: 2,
        title: "Derivatives and Applications",
        course: "MATH201",
        duration: "58:15",
        uploadedDate: "2025-10-04"
      },
      {
        id: 3,
        title: "Newton's Laws of Motion",
        course: "PHYS201",
        duration: "52:20",
        uploadedDate: "2025-09-29"
      },
      {
        id: 4,
        title: "World War II Overview",
        course: "HIST110",
        duration: "1:12:45",
        uploadedDate: "2025-10-01"
      }
    ],
    links: [
      {
        id: 1,
        title: "Python Documentation",
        course: "CS101",
        url: "https://docs.python.org",
        description: "Official Python programming language documentation"
      },
      {
        id: 2,
        title: "Khan Academy - Calculus",
        course: "MATH201",
        url: "https://khanacademy.org",
        description: "Free calculus tutorials and practice exercises"
      },
      {
        id: 3,
        title: "PhET Interactive Simulations",
        course: "PHYS201",
        url: "https://phet.colorado.edu",
        description: "Interactive physics simulations"
      },
      {
        id: 4,
        title: "Purdue OWL Writing Lab",
        course: "ENG105",
        url: "https://owl.purdue.edu",
        description: "Writing resources and citation guides"
      }
    ]
  };

  const getFileIcon = (type: string) => {
    return <FileText className="h-5 w-5 text-blue-600" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>

      <div>
        <h2 className="mb-2">Learning Resources</h2>
        <p className="text-muted-foreground">Access course materials, videos, and external links</p>
      </div>

      {/* Resource Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardDescription>Documents</CardDescription>
            <CardTitle>{resources.documents.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Video Lectures</CardDescription>
            <CardTitle>{resources.videos.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>External Links</CardDescription>
            <CardTitle>{resources.links.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Total Courses</CardDescription>
            <CardTitle>6</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Resources Tabs */}
      <Tabs defaultValue="documents" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="documents" className="gap-2">
            <FileText className="h-4 w-4" />
            Documents
          </TabsTrigger>
          <TabsTrigger value="videos" className="gap-2">
            <Video className="h-4 w-4" />
            Videos
          </TabsTrigger>
          <TabsTrigger value="links" className="gap-2">
            <LinkIcon className="h-4 w-4" />
            Links
          </TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Course Documents</CardTitle>
              <CardDescription>Download lecture notes, assignments, and study materials</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {resources.documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors">
                  <div className="flex items-start gap-3 flex-1">
                    {getFileIcon(doc.type)}
                    <div className="flex-1">
                      <p>{doc.title}</p>
                      <div className="flex gap-3 mt-1 text-muted-foreground">
                        <Badge variant="outline">{doc.course}</Badge>
                        <span>{doc.size}</span>
                        <span>•</span>
                        <span>{doc.uploadedDate}</span>
                      </div>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="videos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Video Lectures</CardTitle>
              <CardDescription>Watch recorded lectures and tutorials</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {resources.videos.map((video) => (
                <div key={video.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                      <Video className="h-5 w-5 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <p>{video.title}</p>
                      <div className="flex gap-3 mt-1 text-muted-foreground">
                        <Badge variant="outline">{video.course}</Badge>
                        <span>{video.duration}</span>
                        <span>•</span>
                        <span>{video.uploadedDate}</span>
                      </div>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost">
                    Watch
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="links" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>External Resources</CardTitle>
              <CardDescription>Useful links and references for your courses</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {resources.links.map((link) => (
                <div key={link.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                      <LinkIcon className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p>{link.title}</p>
                      <p className="text-muted-foreground mt-1">{link.description}</p>
                      <div className="flex gap-3 mt-2">
                        <Badge variant="outline">{link.course}</Badge>
                      </div>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" asChild>
                    <a href="#" target="_blank" rel="noopener noreferrer">
                      Open
                    </a>
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
