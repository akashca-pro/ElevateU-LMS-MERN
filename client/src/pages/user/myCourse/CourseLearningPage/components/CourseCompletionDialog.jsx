import React from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Trophy, CheckCircle, Sparkles, ArrowLeft, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

const CourseCompletionDialog = ({ isOpen, onOpenChange, title, handleResetProgress }) => {
  const navigate = useNavigate();

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-3">
          <div className="mx-auto bg-gradient-to-r from-yellow-400 to-amber-500 p-4 rounded-full w-20 h-20 flex items-center justify-center">
            <Trophy className="h-10 w-10 text-white" />
          </div>

          <div>
            <DialogTitle className="text-center text-2xl font-bold bg-gradient-to-r from-amber-500 to-yellow-500 bg-clip-text text-transparent">
              Achievement Unlocked!
            </DialogTitle>
            <DialogDescription className="text-center pt-2 px-4">
              Congratulations! You've successfully completed{" "}
              <span className="font-semibold">{title}</span>. Your dedication and hard work have paid off!
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="py-4">
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-sm">Course Completed</h4>
                <p className="text-sm text-muted-foreground">
                  You've mastered all the modules and lessons in this course.
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-3">
          <Button className="sm:flex-1 gap-2" onClick={() => navigate('/user/profile/my-courses')}>
            <ArrowLeft className="h-4 w-4" />
            Back to Courses
          </Button>

          <Button className="sm:flex-1 gap-2" onClick={handleResetProgress}>
            <RotateCcw className="h-4 w-4" />
            Start Over
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CourseCompletionDialog;