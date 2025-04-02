"use client";

import { Card } from '@/components/ui/card';
import ClientDashboard from '@/components/dashboard/client-dashboard'; // Client Component
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const Dashboard =  () => {
function returnUserSession(){
  const session = useSession();
  const user = session?.data?.user;
  return user;
}

const router = useRouter();

useEffect(() => {
  router.refresh();
}, []);

const user = returnUserSession();
  return (
    <div className="flex justify-center  items-center min-h-screen bg-gray-200">
      <Card className="w-full max-w-3xl p-8 bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300 md:max-w-md sm:max-w-sm xs:max-w-xs">
        

        <div className="text-center text-lg text-foreground">
          <h1 className="text-xl font-semibold text-center">{user?.name}</h1>
          <h2>Welcome to your dashboard!</h2>
          <h3 className="text-muted-foreground">Here you can see details about your live portfolios</h3>
        </div>

        {/* Pass session data (the user object) to Client so that we can interact with details regarding that user */}
        <ClientDashboard user={user as any} />
      </Card>
    </div>
  );
};

export default Dashboard;