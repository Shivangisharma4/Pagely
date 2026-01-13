import { Card, CardContent } from "@/components/ui/card";
import { WifiOff } from "lucide-react";

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <WifiOff className="h-16 w-16 text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">You're Offline</h1>
          <p className="text-muted-foreground text-center mb-4">
            It looks like you've lost your internet connection. Some features may not be available.
          </p>
          <p className="text-sm text-muted-foreground text-center">
            Your data will sync automatically when you're back online.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
