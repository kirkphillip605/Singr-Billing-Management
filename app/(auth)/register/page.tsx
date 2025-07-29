'use client';

    import { useState } from 'react';
    import { useRouter } from 'next/navigation';
    import { useForm } from 'react-hook-form';
    import { zodResolver } from '@hookform/resolvers/zod';
    import * as z from 'zod';
    import { toast } from '@/components/ui/use-toast';
    import { Input } from '@/components/ui/input';
    import { Button } from '@/components/ui/button';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
    import { Label } from '@/components/ui/label';
    import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
    import { Loader2 } from 'lucide-react';
    import Link from 'next/link';

    const formSchema = z.object({
      firstName: z.string().min(2, { message: 'First name must be at least 2 characters.' }),
      lastName: z.string().min(2, { message: 'Last name must be at least 2 characters.' }),
      businessName: z.string().optional(),
      phone: z.string().optional(),
      email: z.string().email({ message: 'Please enter a valid email address.' }),
      password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
    });

    type FormSchema = z.infer<typeof formSchema>;

    export default function RegisterPage() {
      const router = useRouter();
      const [isLoading, setIsLoading] = useState(false);

      const form = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          firstName: '',
          lastName: '',
          businessName: '',
          phone: '',
          email: '',
          password: '',
        },
      });

      const {
        register,
        handleSubmit,
        formState: { errors },
      } = form;

      async function onSubmit(values: FormSchema) {
        setIsLoading(true);
        try {
          const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
          });

          const data = await response.json();

          if (response.ok) {
            toast({
              title: 'Success',
              description: 'Account created successfully! Please check your email to verify.',
            });
            router.push('/login');
          } else {
            toast({
              title: 'Error',
              description: data.message || 'An error occurred.',
              variant: 'destructive',
            });
          }
        } catch (error) {
          toast({
            title: 'Error',
            description: 'An unexpected error occurred.',
            variant: 'destructive',
          });
        } finally {
          setIsLoading(false);
        }
      }

      return (
        <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
          <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
            <div className="absolute inset-0 bg-zinc-900" />
            <div className="relative z-20 flex items-center text-lg font-medium">
              <Link href="/">
                <div className="flex items-center space-x-2">
                  {/* Replace with your logo */}
                  {/* <Logo className="h-6 w-6" /> */}
                  <span>Billing Portal</span>
                </div>
              </Link>
            </div>
            <div className="relative z-20 mt-auto">
              <blockquote className="text-lg">
                &quot;This is a placeholder for a compelling message or
                advertisement.&quot;
              </blockquote>
              <cite className="text-sm font-medium">
                - Your Company Name
              </cite>
            </div>
          </div>
          <div className="lg:p-8">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Create an account</CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="John"
                            {...register('firstName')}
                          />
                        </FormControl>
                        <FormMessage>{errors.firstName?.message}</FormMessage>
                      </FormItem>
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Doe"
                            {...register('lastName')}
                          />
                        </FormControl>
                        <FormMessage>{errors.lastName?.message}</FormMessage>
                      </FormItem>
                      <FormItem>
                        <FormLabel>Business Name (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Acme Corp"
                            {...register('businessName')}
                          />
                        </FormControl>
                        <FormMessage>{errors.businessName?.message}</FormMessage>
                      </FormItem>
                      <FormItem>
                        <FormLabel>Phone (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="+1 555-123-4567"
                            {...register('phone')}
                          />
                        </FormControl>
                        <FormMessage>{errors.phone?.message}</FormMessage>
                      </FormItem>
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="you@example.com"
                            {...register('email')}
                          />
                        </FormControl>
                        <FormMessage>{errors.email?.message}</FormMessage>
                      </FormItem>
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••"
                            {...register('password')}
                          />
                        </FormControl>
                        <FormMessage>{errors.password?.message}</FormMessage>
                      </FormItem>
                      <Button disabled={isLoading} className="w-full">
                        {isLoading && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Create account
                      </Button>
                    </form>
                  </Form>
                  <p className="px-8 text-center text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <Link
                      href="/login"
                      className="hover:text-primary underline"
                    >
                      Login
                    </Link>
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      );
    }
