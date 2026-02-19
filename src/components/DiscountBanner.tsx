
import { useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export default function DiscountBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <Alert className="bg-amber-50 border-amber-200 mb-0 rounded-none sticky top-0 z-[60] w-full">
      <div className="flex items-center justify-center w-full relative">
        <AlertTriangle className="h-4 w-4 text-amber-500 mr-2 flex-shrink-0" />
        <AlertDescription className="text-amber-800 text-xs sm:text-sm md:text-base text-center">
          Use coupon code <strong>CERTIQUEST25</strong> at checkout for 25% off on all courses!
        </AlertDescription>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 h-6 w-6 text-amber-600 hover:text-amber-800 hover:bg-amber-100"
          onClick={() => setIsVisible(false)}
          aria-label="Close banner"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </Alert>
  );
}
