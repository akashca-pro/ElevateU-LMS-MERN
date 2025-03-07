import { Card, CardHeader, CardTitle,CardContent } from '@/components/ui/card'
import { Activity, Award, BookOpen, GraduationCap, Star, Target, Trophy } from 'lucide-react'
import React from 'react'

const ProfileCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 mt-4">
        {/* Achievements Card */}
        <Card className="hover-lift glass-card bg-white/60 backdrop-blur-md border bg-white shadow-lg rounded-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" /> 
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                <Award className="h-8 w-8 text-yellow-500" />
                <div>
                  <p className="font-medium">Course Completion</p>
                  <p className="text-sm text-muted-foreground">Completed 5 courses</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg">
                <Star className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-medium">Quiz Master</p>
                  <p className="text-sm text-muted-foreground">Scored 100% in 3 quizzes</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <GraduationCap className="h-8 w-8 text-gray-500" />
                <div>
                  <p className="font-medium">First Certificate</p>
                  <p className="text-sm text-muted-foreground">Earned on May 15, 2024</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Learning Goals Card */}
        <Card className="hover-lift glass-card bg-white/60 backdrop-blur-md border bg-white shadow-lg rounded-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" /> 
              Learning Goals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-primary/5 rounded-lg">
                <div className="mt-1">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Complete React Course</p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div className="bg-primary h-2.5 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">75% completed</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-primary/5 rounded-lg">
                <div className="mt-1">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Master TypeScript</p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div className="bg-primary h-2.5 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">45% completed</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-primary/5 rounded-lg">
                <div className="mt-1">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Learn Node.js</p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div className="bg-primary h-2.5 rounded-full" style={{ width: '30%' }}></div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">30% completed</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Learning Progress Card */}
        <Card className="hover-lift glass-card bg-white/60 backdrop-blur-md border bg-white shadow-lg rounded-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-500" /> 
              Learning Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              <div>
                <div className="flex justify-between mb-1">
                  <p className="font-medium">Course Completion</p>
                  <p className="text-sm font-medium">7/10</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '70%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <p className="font-medium">Assignments</p>
                  <p className="text-sm font-medium">12/15</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '80%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <p className="font-medium">Quiz Performance</p>
                  <p className="text-sm font-medium">85%</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <p className="font-medium">Weekly Study Goal</p>
                  <p className="text-sm font-medium">8/10 hrs</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-orange-500 h-2.5 rounded-full" style={{ width: '80%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
  )
}

export default ProfileCards
