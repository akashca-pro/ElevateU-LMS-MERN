import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle ,CardFooter } from '@/components/ui/card'
import { Activity, Award, BarChart, Calendar, Clock, GraduationCap, MessageSquare, Sparkles, Star, Trophy, Users, Video } from 'lucide-react'
import React from 'react'

const ProfileCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 mt-6">

       {/* Teaching Stats Card */}
       <Card className="hover-lift glass-card bg-white/60 backdrop-blur-md border bg-white shadow-lg rounded-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <BarChart className="h-5 w-5 text-primary" /> 
              Teaching Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <Users className="h-8 w-8 text-primary" />
                  <p className="font-medium">Active Students</p>
                </div>
                <span className="text-xl font-bold">42</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <Video className="h-8 w-8 text-primary" />
                  <p className="font-medium">Courses Created</p>
                </div>
                <span className="text-xl font-bold">7</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <Clock className="h-8 w-8 text-primary" />
                  <p className="font-medium">Teaching Hours</p>
                </div>
                <span className="text-xl font-bold">156</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
    {/* Course Completion Rates Card */}
    <Card className="hover-lift glass-card bg-white/60 backdrop-blur-md border bg-white shadow-lg rounded-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-500" /> 
              Student Success Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              <div>
                <div className="flex justify-between mb-1">
                  <p className="font-medium">Course Completion Rate</p>
                  <p className="text-sm font-medium">87%</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '87%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <p className="font-medium">Student Satisfaction</p>
                  <p className="text-sm font-medium">92%</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-primary h-2.5 rounded-full" style={{ width: '92%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <p className="font-medium">Practical Implementation</p>
                  <p className="text-sm font-medium">78%</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: '78%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <p className="font-medium">Career Advancement</p>
                  <p className="text-sm font-medium">65%</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-orange-500 h-2.5 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

     {/* Student Feedback Card */}
     <Card className="hover-lift glass-card bg-white/60 backdrop-blur-md border bg-white shadow-lg rounded-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-yellow-500" /> 
              Student Feedback
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium">Overall Rating</p>
                  <div className="flex items-center">
                    <span className="text-xl font-bold mr-1">4.8</span>
                    <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '96%' }}></div>
                </div>
              </div>
              
              <div className="flex flex-col space-y-3">
                <div className="flex items-center justify-between px-3">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                    <span>5</span>
                  </div>
                  <div className="w-3/4 bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <span className="text-sm">85%</span>
                </div>
                
                <div className="flex items-center justify-between px-3">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                    <span>4</span>
                  </div>
                  <div className="w-3/4 bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '12%' }}></div>
                  </div>
                  <span className="text-sm">12%</span>
                </div>
                
                <div className="flex items-center justify-between px-3">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                    <span>3</span>
                  </div>
                  <div className="w-3/4 bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '3%' }}></div>
                  </div>
                  <span className="text-sm">3%</span>
                </div>
              </div>
              
              <div className="text-center text-sm text-muted-foreground mt-2">
                Based on 124 student reviews
              </div>
            </div>
          </CardContent>
        </Card>
    
    </div>
  )
}

export default ProfileCards
