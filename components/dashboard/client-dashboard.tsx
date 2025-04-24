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
import { useEffect, useState } from "react";
import { Timeline, TimelineItem, TimelineDot, TimelineContent, TimelineTime } from "@/components/ui/timeline"; // shadcnui timeline
import { Card } from "@/components/ui/card";

interface ClientDashboardProps {
  user: {
    id: string;
    name: string;
    email: string;
    emailVerified: Date;
  };
}

interface ViewData {
  viewCount: number;
  recentViews: Date[];
}

const ClientDashboard = ({ user }: ClientDashboardProps) => {
  const [viewData, setViewData] = useState<ViewData | null>(null);

  useEffect(() => {
    const fetchViewData = async () => {
      try {
        const response = await fetch(`/api/portfolio?userId=${user.id}`);
        const data = await response.json();
        setViewData(data);
      } catch (error) {
        console.error('Error fetching view data:', error);
        setViewData({ viewCount: 0, recentViews: [] });
      }
    };

    fetchViewData();
  }, [user.id]);

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  return (
    <div className="text-center mt-4 w-full h-full">
      <Drawer>
        <DrawerTrigger className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
          View Analytics
        </DrawerTrigger>
        <DrawerContent className="h-[80vh] sm:h-[60vh]">
          <DrawerHeader className="text-center">
            <DrawerTitle className="text-xl sm:text-2xl">{user.name}'s Profile Views</DrawerTitle>
            <DrawerDescription className="mt-4">
              {viewData ? (
                <div className="space-y-6 max-w-2xl mx-auto px-4">
                  <Card className="p-4 sm:p-6">
                    <h3 className="text-2xl sm:text-3xl font-bold">{viewData.viewCount}</h3>
                    <p className="text-muted-foreground text-sm sm:text-base">Total Views</p>
                  </Card>
                  
                  {viewData.recentViews.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-lg sm:text-xl font-semibold mb-4">Recent Views</h3>
                      <div className="overflow-y-auto max-h-[40vh] sm:max-h-[30vh] pr-4">
                        <Timeline>
                          {viewData.recentViews.map((view, index) => (
                            <TimelineItem key={index}>
                              <TimelineDot />
                              <TimelineContent>
                                <p className="text-sm sm:text-base font-medium">View #{viewData.viewCount - index}</p>
                                <TimelineTime dateTime={view.toString()}>
                                  {formatTimeAgo(view)}
                                </TimelineTime>
                              </TimelineContent>
                            </TimelineItem>
                          ))}
                        </Timeline>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-2xl font-bold mt-4">Loading...</p>
              )}
            </DrawerDescription>
          </DrawerHeader>
          <DrawerFooter className="border-t pt-4">
            <DrawerClose className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors">
              Close
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default ClientDashboard;