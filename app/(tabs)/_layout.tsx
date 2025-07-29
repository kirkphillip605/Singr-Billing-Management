import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
    import { Home, Settings } from 'lucide-react';
    import Link from 'next/link';

    export default function TabsLayout({ children }: { children: React.ReactNode }) {
      return (
        <Tabs defaultValue="dashboard">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="dashboard">
              <Link href="/(tabs)/dashboard" className="flex items-center justify-center space-x-2">
                <Home className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            </TabsTrigger>
            <TabsTrigger value="billing">
              <Link href="/(tabs)/billing" className="flex items-center justify-center space-x-2">
                <Settings className="h-4 w-4" />
                <span>Billing</span>
              </Link>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="dashboard">{children}</TabsContent>
          <TabsContent value="billing">{children}</TabsContent>
        </Tabs>
      );
    }
