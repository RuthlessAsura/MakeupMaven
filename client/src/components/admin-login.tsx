import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

type AdminLoginProps = {
  onLoginSuccess: () => void;
};

export default function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast({
        title: "Velden ontbreken",
        description: "Vul zowel de gebruikersnaam als het wachtwoord in.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoggingIn(true);
    
    try {
      // Store credentials in localStorage
      localStorage.setItem('adminCredentials', btoa(`${username}:${password}`));
      
      // Test if credentials work
      const response = await fetch('/api/admin/content/hero', {
        headers: {
          'Authorization': `Basic ${btoa(`${username}:${password}`)}`
        }
      });
      
      if (response.ok) {
        toast({
          title: "Inloggen gelukt",
          description: "U bent succesvol ingelogd als beheerder.",
        });
        onLoginSuccess();
      } else {
        toast({
          title: "Inloggen mislukt",
          description: "Ongeldige inloggegevens. Probeer het opnieuw.",
          variant: "destructive",
        });
        localStorage.removeItem('adminCredentials');
      }
    } catch (error) {
      toast({
        title: "Fout",
        description: "Er is een fout opgetreden bij het inloggen.",
        variant: "destructive",
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Admin Login</CardTitle>
          <CardDescription className="text-center">
            Log in om toegang te krijgen tot het beheerderspaneel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Gebruikersnaam</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoggingIn}
                placeholder="Voer uw gebruikersnaam in"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Wachtwoord</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoggingIn}
                placeholder="Voer uw wachtwoord in"
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoggingIn}>
              {isLoggingIn ? "Bezig met inloggen..." : "Inloggen"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-500">
            Alleen geautoriseerd personeel heeft toegang tot het beheerderspaneel
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}