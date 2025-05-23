
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function DiscountBanner() {
  return (
    <Alert className="bg-amber-50 border-amber-200 mb-0 rounded-none sticky top-0 z-[60] w-full">
      <AlertTriangle className="h-4 w-4 text-amber-500" />
      <AlertDescription className="text-amber-800 text-xs sm:text-sm md:text-base text-center w-full">
        Use coupon code <strong>CERTIQUEST25</strong> at checkout for 25% off on all courses!
      </AlertDescription>
    </Alert>
  );
}
