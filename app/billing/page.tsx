'use client';

    import { useEffect, useState } from 'react';
    import { useRouter } from 'next/navigation';
    import { toast } from '@/components/ui/use-toast';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
    import { Button } from '@/components/ui/button';
    import { Loader2 } from 'lucide-react';

    export default function BillingPage() {
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
              <CardTitle>Billing</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Manage your billing information here.</p>
              <Button>Update Payment Method</Button>
              <Button className="ml-2" variant="secondary">
                Change Plan
              </Button>
              <Button className="ml-2" variant="destructive">
                Cancel Subscription
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }
