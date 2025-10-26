import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { ArrowLeft, Download, FileText, Video, Link as LinkIcon, ExternalLink } from "lucide-react"; // Added ExternalLink
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";

interface ResourcesViewProps {
  onBack: () => void;
}

export function ResourcesView({ onBack }: ResourcesViewProps) {
  // --- Using the data structure from your "old code" ---
  const resources = {
    documents: [
      { id: 1, title: "Data Structures - Notes", course: "CS101", type: "PDF", size: "2.4 MB", uploadedDate: "2025-10-01", url: "https://drive.google.com/file/d/1ppvLAF_0hVzRHdlJtnBKUWp2MkmBz6bi/view?usp=sharing"}, // Added URL placeholder
      { id: 2, title: "Calculus II - Problem Set ", course: "IT201", type: "PDF", size: "1.2 MB", uploadedDate: "2025-10-05", url: "https://drive.google.com/file/d/17nraGpsgxlMTDo9E4XTli3jKetthvs8P/view?usp=sharing"},
      { id: 3, title: "Engineering Physics", course: "CMPN102", type: "PDF", size: "5.8 MB", uploadedDate: "2025-09-28", url: "https://drive.google.com/file/d/1ome49_R9tI2MY5EJedVg7dVX434oDZW4/view?usp=sharing"},
      { id: 4, title: "System Analysis & Design", course: "CMPN301", type: "PDF", size: "890 KB", uploadedDate: "2025-10-03", url: "https://drive.google.com/file/d/1DX8zLgeOs7DKTQYoELL0dTf2SElAQsMw/view?usp=sharing"}
    ],
    videos: [
      { id: 1, title: "Introduction to Linked Lists", course: "CMPN102", duration: "06:20", uploadedDate: "2019-10-02", url: "https://youtube.com/watch?v=R9PTBwOzceo"}, 
      { id: 2, title: "Derivatives and Applications", course: "IT201", duration: "58:15", uploadedDate: "2025-10-04", url: "https://youtube.com/watch?v=WiOdQQYLMU4"},
      { id: 3, title: " Data Base Management System", course: "CMPN203", duration: "5:33:20", uploadedDate: "2025-09-29", url: "https://youtube.com/watch?v=YRnjGeQbsHQ"},
      { id: 4, title: "Operating Systems", course: "EXCS401", duration: "1:12:45", uploadedDate: "2025-10-01", url: "https://youtube.com/watch?v=xw_OuOhjauw"}
    ],
    links: [
      { id: 1, title: "Python Documentation", course: "CMPN301", url: "https://docs.python.org", description: "Official Python programming language documentation" },
      { id: 2, title: "Khan Academy - Calculus", course: "IT101", url: "https://khanacademy.org", description: "Free calculus tutorials and practice exercises" },
      { id: 3, title: "PhET Interactive Simulations", course: "EXTC201", url: "https://phet.colorado.edu", description: "Interactive physics simulations" },
      { id: 4, title: "Purdue OWL Writing Lab", course: "IT102", url: "https://owl.purdue.edu", description: "Writing resources and citation guides" }
    ]
  };
  // --- End of Data ---

  // Basic icon getter, can be enhanced later if needed for DOCX vs PDF etc.
  const getFileIcon = (type: string) => {
    return <FileText className="h-5 w-5 text-blue-600 flex-shrink-0" />; // Keep icon size consistent
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={onBack} className="mb-4"> {/* Changed variant and size */}
           <ArrowLeft className="h-4 w-4 mr-2" />
           Back to Dashboard
         </Button>
      </div>

      <div>
        <h2 className="mb-2 text-2xl font-bold">Learning Resources</h2> {/* Increased heading size */}
        <p className="text-muted-foreground">Access course materials, videos, and external links</p>
      </div>

      {/* Resource Stats */}
      <div className="grid md:grid-cols-4 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">Documents</CardTitle><div className="text-2xl">{resources.documents.length}</div></CardHeader></Card>
          <Card><CardHeader><CardTitle className="text-sm">Video Lectures</CardTitle><div className="text-2xl">{resources.videos.length}</div></CardHeader></Card>
          <Card><CardHeader><CardTitle className="text-sm">External Links</CardTitle><div className="text-2xl">{resources.links.length}</div></CardHeader></Card>
          <Card><CardHeader><CardTitle className="text-sm">Total Courses</CardTitle><div className="text-2xl">6</div></CardHeader></Card> {/* Kept placeholder */}
      </div>


      {/* Resources Tabs */}
      <Tabs defaultValue="documents" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="documents" className="gap-2">
            <FileText className="h-4 w-4" /> Documents
          </TabsTrigger>
          <TabsTrigger value="videos" className="gap-2">
            <Video className="h-4 w-4" /> Videos
          </TabsTrigger>
          <TabsTrigger value="links" className="gap-2">
            <LinkIcon className="h-4 w-4" /> Links
          </TabsTrigger>
        </TabsList>

        {/* --- DOCUMENTS TAB CONTENT --- */}
        <TabsContent value="documents" className="mt-4"> {/* Removed space-y-4 from here */}
          <Card>
            <CardHeader>
              <CardTitle>Course Documents</CardTitle>
              <CardDescription>Download lecture notes, assignments, and study materials</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2"> {/* Added space-y-2 for spacing between rows */}
              {resources.documents.map((doc) => (
                // Row container: Flex, space between left/right, padding, border, hover
                <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors">
                  {/* Left Group: Icon + Text Block */}
                  <div className="flex items-start gap-3 overflow-hidden min-w-0 mr-2">
                    {getFileIcon(doc.type)}
                    {/* Text Block: Allow grow/shrink, prevent overflow */}
                    <div className="flex-1 overflow-hidden min-w-0">
                      <p className="font-medium truncate whitespace-nowrap">{doc.title}</p>
                      {/* Metadata Row: Flex, gap, smaller text */}
                      <div className="flex items-center flex-wrap gap-x-2 gap-y-1 mt-1 text-xs text-muted-foreground"> {/* Adjusted gap and text size */}
                        <Badge variant="secondary">{doc.course}</Badge> {/* Changed badge variant */}
                        <span>{doc.size}</span>
                        <span>•</span>
                        <span>{doc.uploadedDate}</span>
                      </div>
                    </div>
                  </div>
                  {/* Right Group: Download Button */}
                  <Button size="icon" variant="ghost" asChild className="flex-shrink-0 ml-auto">
                    <a href={doc.url} download={doc.title.includes('.') ? doc.title : `${doc.title}.pdf`} title="Download">
                      <Download className="h-5 w-5" />
                    </a>
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- VIDEOS TAB CONTENT --- */}
        <TabsContent value="videos" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Video Lectures</CardTitle>
              <CardDescription>Watch recorded lectures and tutorials</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {resources.videos.map((video) => (
                <div key={video.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors">
                  {/* Left Group */}
                  <div className="flex items-start gap-3 overflow-hidden min-w-0 mr-2">
                     <Video className="h-5 w-5 text-red-600 flex-shrink-0" /> {/* Adjusted Icon */}
                     <div className="flex-1 overflow-hidden min-w-0">
                       <p className="font-medium truncate whitespace-nowrap">{video.title}</p>
                       <div className="flex items-center flex-wrap gap-x-2 gap-y-1 mt-1 text-xs text-muted-foreground">
                         <Badge variant="secondary">{video.course}</Badge>
                         <span>{video.duration}</span>
                         <span>•</span>
                         <span>{video.uploadedDate}</span>
                       </div>
                     </div>
                  </div>
                   {/* Right Group */}
                  <Button size="icon" variant="ghost" asChild className="flex-shrink-0 ml-auto">
                    <a href={video.url} target="_blank" rel="noopener noreferrer" title="Watch Video">
                       <ExternalLink className="h-5 w-5" /> {/* Use ExternalLink */}
                    </a>
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- LINKS TAB CONTENT --- */}
        <TabsContent value="links" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>External Resources</CardTitle>
              <CardDescription>Useful links and references for your courses</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {resources.links.map((link) => (
                <div key={link.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors">
                  {/* Left Group */}
                  <div className="flex items-start gap-3 overflow-hidden min-w-0 mr-2">
                     <LinkIcon className="h-5 w-5 text-green-600 flex-shrink-0" /> {/* Adjusted Icon */}
                     <div className="flex-1 overflow-hidden min-w-0">
                       <p className="font-medium truncate whitespace-nowrap">{link.title}</p>
                       <p className="text-xs text-muted-foreground mt-1 truncate whitespace-nowrap">{link.description}</p> {/* Use smaller text for description */}
                       <div className="flex items-center flex-wrap gap-x-2 gap-y-1 mt-1 text-xs text-muted-foreground">
                         <Badge variant="secondary">{link.course}</Badge>
                       </div>
                     </div>
                  </div>
                  {/* Right Group */}
                  <Button size="icon" variant="ghost" asChild className="flex-shrink-0 ml-auto">
                    <a href={link.url} target="_blank" rel="noopener noreferrer" title="Open Link">
                      <ExternalLink className="h-5 w-5" /> {/* Use ExternalLink */}
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

