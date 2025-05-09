
import type { RecentActivity } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from 'date-fns';

interface RecentActivityListProps {
  activities: RecentActivity[];
}

export default function RecentActivityList({ activities }: RecentActivityListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.length === 0 && <p className="text-sm text-muted-foreground">No recent activity.</p>}
        {activities.map((activity) => {
          const ActivityIcon = activity.icon;
          return (
            <div key={activity.id} className="flex items-start space-x-3">
              <Avatar className="h-8 w-8">
                {ActivityIcon ? (
                  <AvatarFallback className="bg-muted">
                    <ActivityIcon className="h-4 w-4 text-muted-foreground" />
                  </AvatarFallback>
                ) : (
                  <AvatarFallback>{activity.user ? activity.user.charAt(0).toUpperCase() : 'S'}</AvatarFallback>
                )}
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-medium leading-none">
                  {activity.description}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                  {activity.user && ` by ${activity.user}`}
                </p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
