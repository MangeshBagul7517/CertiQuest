
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
import Layout from "@/components/Layout";
import emailjs from '@emailjs/browser';

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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
      // Send password reset email via Supabase
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        toast.error(error.message);
      } else {
        // Also send a notification via EmailJS
        try {
          await emailjs.send(
            'service_jnwp6jj', // Replace with your EmailJS service ID
            'template_w9gnvdn', // Replace with your EmailJS template ID
            {
              to_email: email,
              to_name: email.split('@')[0],
              reset_link: `${window.location.origin}/reset-password`,
              subject: 'Password Reset Request - CertiQuest'
            },
            'RtNvifJglWDbjZCyo' // Replace with your EmailJS public key
          );
        } catch (emailError) {
          console.error("EmailJS notification error:", emailError);
          // Don't show this error to the user as the Supabase email was sent successfully
        }
        
        // Show success dialog
        setShowEmailSentDialog(true);
      }
    } catch (error: any) {
      console.error("Reset password error:", error);
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
    <Layout>
      <div className="flex flex-1 items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
            <CardDescription>
              Enter your email to receive a password reset link
            </CardDescription>
          </CardHeader>
          <CardContent>
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
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm">
              Remember your password?{" "}
              <Link
                to="/login"
                className="font-medium text-primary hover:text-primary/80 hover:underline"
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
    </Layout>
  );
};

export default ForgotPassword;
