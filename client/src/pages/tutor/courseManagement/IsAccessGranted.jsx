import { Lock } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const IsAccessGranted = ({ children, useCheckApi }) => {
  const { status } = useCheckApi();

  if (status !== 403) return children;

  return (
    <div className="relative w-full h-screen flex items-start justify-center pt-[20vh]">
      <Card className="bg-black/70 text-white p-6 text-center w-96 shadow-lg">
        <CardHeader className="flex flex-col items-center">
          <Lock className="w-12 h-12 mb-3" />
          <h3 className="text-lg font-semibold">Access Restricted</h3>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-300">
            Your account needs to be verified to access this feature.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default IsAccessGranted;
