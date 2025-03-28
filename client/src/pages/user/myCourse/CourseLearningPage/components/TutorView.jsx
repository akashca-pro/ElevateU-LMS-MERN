import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Globe, Twitter, Github, Linkedin } from "lucide-react"

const TutorView = ({ tutor }) => {
  if (!tutor) return null

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-32" />
        <CardContent className="pt-0">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="-mt-12">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                <Avatar className="h-24 w-24 border-4 border-white shadow-md">
                  <AvatarImage src={tutor.profileImage} alt={tutor.name} />
                  <AvatarFallback className="text-2xl">
                    {tutor.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </motion.div>
            </div>

            <div className="space-y-2 pt-2">
              <div>
                <h2 className="text-2xl font-bold">{tutor.name}</h2>
                <p className="text-gray-500">{tutor.title}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {tutor.expertise.map((skill, index) => (
                  <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {skill}
                  </Badge>
                ))}
              </div>

              <div className="flex gap-2 pt-2">
                {tutor.socialLinks.website && (
                  <Button variant="outline" size="icon" asChild>
                    <a href={tutor.socialLinks.website} target="_blank" rel="noopener noreferrer">
                      <Globe className="h-4 w-4" />
                    </a>
                  </Button>
                )}
                {tutor.socialLinks.twitter && (
                  <Button variant="outline" size="icon" asChild>
                    <a href={tutor.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                      <Twitter className="h-4 w-4" />
                    </a>
                  </Button>
                )}
                {tutor.socialLinks.github && (
                  <Button variant="outline" size="icon" asChild>
                    <a href={tutor.socialLinks.github} target="_blank" rel="noopener noreferrer">
                      <Github className="h-4 w-4" />
                    </a>
                  </Button>
                )}
                {tutor.socialLinks.linkedin && (
                  <Button variant="outline" size="icon" asChild>
                    <a href={tutor.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                      <Linkedin className="h-4 w-4" />
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-md">
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-4">About the Instructor</h3>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{tutor.bio}</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default TutorView