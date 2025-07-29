'use client';

    import { useState } from 'react';
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
      email: z.string().email({ message: 'Please enter a valid email address.' }),
    });

    type FormSchema = z.infer<typeof formSchema>;

    export default function ForgotPasswordPage() {
      const [isLoading, setIsLoading] = useState(false);
      const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          email: '',
        },
      });

      async function onSubmit(values: FormSchema) {
        setIsLoading(true);
        try {
          const response = await fetch('/api/auth/password-reset/request', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
          });

          if (response.ok) {
            toast({
              title: 'Success',
              description: 'Password reset email sent. Please check your inbox.',
            });
          } else {
            const data = await response.json();
            toast({
              title: 'Error',
              description: data.message || 'Failed to send reset email.',
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
                  <CardTitle className="text-2xl">Forgot Password</CardTitle>
                </CardHeader>
                <CardContent>
                  <Form>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                      <Button disabled={isLoading} className="w-full">
                        {isLoading && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Reset Password
                      </Button>
                    </form>
                  </Form>
                  <p className="px-8 text-center text-sm text-muted-foreground">
                    Remember your password?{' '}
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
