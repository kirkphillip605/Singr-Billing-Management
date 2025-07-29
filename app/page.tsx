import Link from 'next/link';
    import { Button } from '@/components/ui/button';

    export default function Home() {
      return (
        <div className="container mx-auto p-4 text-center">
          <h1 className="text-3xl font-bold mb-4">Welcome to the Billing Portal</h1>
          <p className="mb-4">
            This is a sample billing portal. Please{' '}
            <Link href="/login" className="text-blue-500 hover:underline">
              login
            </Link>{' '}
            or{' '}
            <Link href="/register" className="text-blue-500 hover:underline">
              register
            </Link>{' '}
            to continue.
          </p>
          <Button asChild>
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </div>
      );
    }
