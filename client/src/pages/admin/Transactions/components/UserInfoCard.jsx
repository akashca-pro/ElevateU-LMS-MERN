import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Mail, Phone, MapPin, ExternalLink } from "lucide-react"
import { useNavigate } from "react-router-dom"

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
}

export default function UserInfoCard({ user, role }) {
  const navigate = useNavigate()
  return (
    <motion.div variants={cardVariants} initial="hidden" animate="visible">
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-shrink-0">
              <Avatar className="h-20 w-20 border-2 border-muted">
                <AvatarImage src={user?.profileImage} alt={user?.firstName} />
                <AvatarFallback className="text-2xl">{user?.firstName.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>

            <div className="flex-grow space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">{user?.firstName}</h3>
                    <Badge variant="outline" className="ml-2">
                      {role}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-sm">{user?.email}</p>
                </div>

                <Button 
                onClick={()=>navigate(`/admin/profile/${role === 'Seller' ? 'tutors' : 'students' }/${user._id}`)}
                 variant="outline" size="sm" className="gap-1 sm:self-start">
                  <ExternalLink className="h-3.5 w-3.5" />
                  View Profile
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                {user.phone && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-3.5 w-3.5" />
                    <span>{user.phone}</span>
                  </div>
                )}

                {user.location && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{user.location}</span>
                  </div>
                )}

                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-3.5 w-3.5" />
                  <span>{user?.email}</span>
                </div>
              </div>

              {user.additionalInfo && (
                <div className="text-sm text-muted-foreground border-t pt-2 mt-2">
                  <p>{user.additionalInfo}</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
