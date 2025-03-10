"use client";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger } from "@/components/ui/drawer";

interface ClientDashboardProps {
  user: {
    id: string;
    name: string;
    email: string;
    emailVerified: Date;
  };
}

const ClientDashboard = ({ user }: ClientDashboardProps) => {
  return (
    <div className="text-center mt-4 w-full h-full">
      <Drawer>
        <DrawerTrigger>View</DrawerTrigger>
          <DrawerContent className="h-3/4">
          <DrawerHeader className="text-center justify-center">
          <DrawerTitle>{user.name}'s Profile Views</DrawerTitle>
          
          <DrawerDescription></DrawerDescription>
          </DrawerHeader>
        <DrawerFooter>
        
        <DrawerClose>
          Close
        </DrawerClose>
        </DrawerFooter>
        </DrawerContent>
      </Drawer>

    </div>
  );
};

export default ClientDashboard;