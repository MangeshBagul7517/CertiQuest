
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [otp, setOtp] = useState("");
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [showEmailSentDialog, setShowEmailSentDialog] = useState(false);
  const navigate = useNavigate();

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/login',
      });
      
      if (error) {
        toast.error(error.message);
      } else {
        setShowEmailSentDialog(true);
      }
    } catch (error: any) {
      console.error("Reset password error:", error);
      toast.error(error?.message || "An error occurred during password reset");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }
    
    setVerifyingOtp(true);
    
    try {
      // In a real implementation, this would verify the OTP with Supabase
      // For demo purposes, we'll just show the password reset form
      setTimeout(() => {
        setShowOtpDialog(false);
        setShowPasswordReset(true);
      }, 1500);
    } catch (error: any) {
      console.error("OTP verification error:", error);
      toast.error("Invalid code. Please try again.");
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPassword) {
      toast.error("Please enter a new password");
      return;
    }
    
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Password reset successfully");
        navigate("/login");
      }
    } catch (error: any) {
      console.error("Password reset error:", error);
      toast.error(error?.message || "An error occurred during password reset");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseEmailSentDialog = () => {
    setShowEmailSentDialog(false);
    navigate("/login");
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Header */}
      <header className="w-full bg-white py-4 px-6 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-primary">CertiQuest</Link>
          <nav>
            <Link to="/courses" className="text-gray-600 hover:text-primary mx-3">Courses</Link>
            <Link to="/login" className="text-gray-600 hover:text-primary mx-3">Login</Link>
          </nav>
        </div>
      </header>
      
      <div className="flex flex-1 items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
            <CardDescription>
              {!showPasswordReset 
                ? "Enter your email to receive a password reset link" 
                : "Create a new password for your account"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!showPasswordReset ? (
              <form onSubmit={handleResetRequest} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="mail@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending request...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Resetting password...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              </form>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm">
              Remember your password?{" "}
              <Link
                to="/login"
                className="font-medium text-primary hover:underline"
              >
                Back to login
              </Link>
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate("/")}
            >
              Back to Home
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Email Sent Dialog */}
      <Dialog open={showEmailSentDialog} onOpenChange={setShowEmailSentDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Password Reset Email Sent</DialogTitle>
            <DialogDescription className="text-center">
              We've sent a password reset link to <span className="font-semibold">{email}</span>
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center space-y-4 pt-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
            <p className="text-center text-sm text-gray-600">
              Please check your email and click the link to reset your password. 
              The link will expire in 1 hour.
            </p>
            <Button className="w-full" onClick={handleCloseEmailSentDialog}>
              Return to Login
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* OTP Verification Dialog */}
      <Dialog open={showOtpDialog} onOpenChange={setShowOtpDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Verify your email</DialogTitle>
            <DialogDescription>
              Enter the 6-digit verification code sent to {email}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center py-4 space-y-4">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(value) => setOtp(value)}
              render={({ slots }) => (
                <InputOTPGroup>
                  {slots.map((slot, i) => (
                    <InputOTPSlot key={i} {...slot} index={i} />
                  ))}
                </InputOTPGroup>
              )}
            />
            <Button 
              onClick={handleVerifyOtp} 
              className="w-full"
              disabled={verifyingOtp}
            >
              {verifyingOtp ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify Code"
              )}
            </Button>
            <div className="text-center text-sm">
              Didn't receive the code?{" "}
              <Button
                variant="link"
                className="p-0 h-auto"
                onClick={() => {
                  setShowOtpDialog(false);
                  toast.info("Password reset request restarted. You can try again.");
                }}
              >
                Resend code
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ForgotPassword;
