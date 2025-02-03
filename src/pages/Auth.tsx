import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { session } = useAuth();

  // Redirect if already logged in
  if (session) {
    navigate("/");
    return null;
  }

  const handleAuth = async (isLogin: boolean) => {
    try {
      setLoading(true);
      console.log(`Attempting to ${isLogin ? 'sign in' : 'sign up'} with email:`, email);
      
      const { error } = isLogin
        ? await supabase.auth.signInWithPassword({ 
            email: email.trim(),
            password: password.trim()
          })
        : await supabase.auth.signUp({ 
            email: email.trim(),
            password: password.trim()
          });

      if (error) {
        console.error('Auth error:', error);
        throw error;
      }

      console.log(`${isLogin ? 'Sign in' : 'Sign up'} successful`);

      if (!isLogin) {
        toast({
          title: "Success",
          description: "Please check your email for verification.",
        });
      } else {
        navigate("/");
      }
    } catch (error: any) {
      console.error('Caught error:', error);
      toast({
        title: "Authentication Error",
        description: error.message || "An error occurred during authentication",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-industrial-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome to Supply Chain Dashboard</CardTitle>
          <CardDescription>
            Sign in to your account or create a new one
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <div className="flex flex-col space-y-2">
              <Button
                onClick={() => handleAuth(true)}
                disabled={loading}
                className="w-full"
              >
                {loading ? "Loading..." : "Sign In"}
              </Button>
              <Button
                onClick={() => handleAuth(false)}
                disabled={loading}
                variant="outline"
                className="w-full"
              >
                Create Account
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;