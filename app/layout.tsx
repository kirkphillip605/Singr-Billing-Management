import './globals.css';
    import { Toaster } from '@/components/ui/toaster';
    import { Inter } from 'next/font/google';
    import Link from 'next/link';
    import { User2, LogOut, Home, Settings } from 'lucide-react';
    import {
      NavigationMenu,
      NavigationMenuItem,
      NavigationMenuLink,
      NavigationMenuList,
      NavigationMenuTrigger,
      NavigationMenuContent,
      NavigationMenuViewport,
    } from '@/components/ui/navigation-menu';
    import { Button } from '@/components/ui/button';
    import { useEffect, useState } from 'react';
    import { useRouter } from 'next/navigation';
    import { toast } from '@/components/ui/use-toast';
    import { Loader2 } from 'lucide-react';

    const inter = Inter({ subsets: ['latin'] });

    export const metadata = {
      title: 'Billing Portal',
      description: 'A production-ready billing portal web app.',
    };

    export default function RootLayout({
      children,
    }: {
      children: React.ReactNode;
    }) {
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
            }
          } catch (error) {
            toast({
              title: 'Error',
              description: 'Failed to fetch user data.',
              variant: 'destructive',
            });
          } finally {
            setIsLoading(false);
          }
        }

        fetchUser();
      }, []);

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

      return (
        <html lang="en">
          <body className={inter.className}>
            <div className="flex flex-col h-screen">
              <header className="bg-background border-b">
                <div className="container mx-auto p-4 flex items-center justify-between">
                  <Link href="/" className="flex items-center space-x-2">
                    {/* Replace with your logo */}
                    {/* <Logo className="h-6 w-6" /> */}
                    <span>Billing Portal</span>
                  </Link>
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <NavigationMenu>
                      <NavigationMenuList>
                        {user ? (
                          <>
                            <NavigationMenuItem>
                              <Link href="/dashboard" legacyBehavior passHref>
                                <NavigationMenuLink className="flex items-center space-x-2">
                                  <Home className="h-4 w-4" />
                                  <span>Dashboard</span>
                                </NavigationMenuLink>
                              </Link>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                              <Link href="/billing" legacyBehavior passHref>
                                <NavigationMenuLink className="flex items-center space-x-2">
                                  <Settings className="h-4 w-4" />
                                  <span>Billing</span>
                                </NavigationMenuLink>
                              </Link>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                              <Button onClick={handleLogout} variant="ghost" className="flex items-center space-x-2">
                                <LogOut className="h-4 w-4" />
                                <span>Logout</span>
                              </Button>
                            </NavigationMenuItem>
                          </>
                        ) : (
                          <>
                            <NavigationMenuItem>
                              <Link href="/login" legacyBehavior passHref>
                                <NavigationMenuLink className="flex items-center space-x-2">
                                  <User2 className="h-4 w-4" />
                                  <span>Login</span>
                                </NavigationMenuLink>
                              </Link>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                              <Link href="/register" legacyBehavior passHref>
                                <NavigationMenuLink className="flex items-center space-x-2">
                                  <User2 className="h-4 w-4" />
                                  <span>Register</span>
                                </NavigationMenuLink>
                              </Link>
                            </NavigationMenuItem>
                          </>
                        )}
                      </NavigationMenuList>
                    </NavigationMenu>
                  )}
                </div>
              </header>
              <main className="flex-1">{children}</main>
              <footer className="bg-muted border-t p-4 text-center">
                &copy; {new Date().getFullYear()} Billing Portal
              </footer>
            </div>
            <Toaster />
          </body>
        </html>
      );
    }
