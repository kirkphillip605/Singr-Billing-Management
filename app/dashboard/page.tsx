'use client';

    import { useEffect, useState } from 'react';
    import { useRouter } from 'next/navigation';
    import { toast } from '@/components/ui/use-toast';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
    import { Button } from '@/components/ui/button';
    import { Loader2 } from 'lucide-react';
    import Link from 'next/link';

    export default function DashboardPage() {
      const router = useRouter();
      const [user, setUser] = useState(null);
      const [isLoading, setIsLoading] = useState(true);

      useEffect(() => {
        async function fetchUser() {
          setIsLoading(true);
          try {
            const response = await fetch('/api/auth/me');
            if (response.ok) {
              const data = await response.json();
              setUser(data);
            } else {
              // Redirect to login if not authenticated
              router.replace('/login');
            }
          } catch (error) {
            toast({
              title: 'Error',
              description: 'Failed to fetch user data.',
              variant: 'destructive',
            });
            router.replace('/login');
          } finally {
            setIsLoading(false);
          }
        }

        fetchUser();
      }, [router]);

      const handleLogout = async () => {
        try {
          const response = await fetch('/api/auth/logout', {
            method: 'POST',
          });
          if (response.ok) {
            toast({
              title: 'Success',
              description: 'Logged out successfully!',
            });
            router.replace('/login');
          } else {
            toast({
              title: 'Error',
              description: 'Failed to logout.',
              variant: 'destructive',
            });
          }
        } catch (error) {
          toast({
            title: 'Error',
            description: 'An unexpected error occurred.',
            variant: 'destructive',
          });
        }
      };

      if (isLoading) {
        return (
          <div className="flex items-center justify-center h-screen">
            <Loader2 className="mr-2 h-8 w-8 animate-spin" />
            Loading...
          </div>
        );
      }

      if (!user) {
        return null; // Or a loading state
      }

      return (
        <div className="container mx-auto p-4">
          <Card>
            <CardHeader>
              <CardTitle>Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Welcome, {user.firstName}!</p>
              <p>Email: {user.email}</p>
              <Link href="/billing">
                <Button>Manage Billing</Button>
              </Link>
              <Button onClick={handleLogout} className="ml-2" variant="destructive">
                Logout
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }
