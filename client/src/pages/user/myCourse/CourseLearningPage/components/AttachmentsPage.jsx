import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Search, Download, FileText, FileImage, FileArchive, FileCode, Filter, FileJson } from "lucide-react"

const AttachmentsPage = ({ course, currentLesson }) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("current")

  // Filter attachments based on search query
  const filterAttachments = (attachments) => {
    if (!searchQuery) return attachments

    const query = searchQuery.toLowerCase()
    return attachments.filter(
      (attachment) =>
        attachment.title.toLowerCase().includes(query) ||
        attachment.lessonTitle.toLowerCase().includes(query) ||
        attachment.moduleTitle.toLowerCase().includes(query) ||
        attachment.fileType.toLowerCase().includes(query),
    )
  }

  // Get file icon based on file type
  const getFileIcon = (fileType) => {
    switch (fileType.toLowerCase()) {
      case "pdf":
        return <FileText className="h-5 w-5 text-red-500" />
      case "jpg":
      case "png":
      case "gif":
        return <FileImage className="h-5 w-5 text-blue-500" />
      case "zip":
      case "rar":
        return <FileArchive className="h-5 w-5 text-yellow-500" />
      case 'json' :
        return <FileJson className="h-5 w-5 text-gray-500" />
      case "js":
      case "html":
      case "css":
        return <FileCode className="h-5 w-5 text-green-500" />
      default:
        return <FileText className="h-5 w-5 text-gray-500" />
    }
  }

  const filteredAttachments =
    activeTab === "current" ? filterAttachments(currentLesson) : filterAttachments(course?.attachments)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search attachments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="current">Current Lesson</TabsTrigger>
            <TabsTrigger value="all">All Resources</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Card className="border-0 shadow-md">
        <CardHeader className="pb-2">
          <CardTitle>{activeTab === "current" ? "Current Lesson Resources" : "All Course Resources"}</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredAttachments.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {filteredAttachments.map((attachment, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                >
                  <Card className="border hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
                          {getFileIcon(attachment.fileType)}
                        </div>
                        <div className="flex-grow">
                          <h3 className="font-medium">{attachment.title}</h3>
                          <p className="text-sm text-gray-500 mt-1">Module : {attachment.moduleTitle}</p>
                          <p className="text-xs text-gray-500 mt-1">Lesson : {attachment.lessonTitle}</p>
                          <div className="flex items-center justify-between mt-2">
                            <Badge variant="outline" className="text-xs">
                              {attachment.fileType.toUpperCase()}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 gap-1 text-primary hover:text-primary/80"
                              asChild
                            >
                              <a href={attachment.link} download>
                                <Download className="h-4 w-4" />
                                <span>Download</span>
                              </a>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-gray-100 dark:bg-gray-800 inline-flex rounded-full p-4 mb-4">
                <FileText className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">No attachments found</h3>
              <p className="text-gray-500 dark:text-gray-400">
                {activeTab === "current"
                  ? "This lesson doesn't have any attachments"
                  : "No attachments match your search criteria"}
              </p>
              {searchQuery && (
                <Button variant="outline" className="mt-4" onClick={() => setSearchQuery("")}>
                  <Filter className="h-4 w-4 mr-2" />
                  Clear search
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default AttachmentsPage
