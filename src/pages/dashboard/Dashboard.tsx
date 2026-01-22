import React from 'react';
import Dashboardheader from "@/components/Dashboardheader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Package, Users } from 'lucide-react';

function Dashboard() {
  // Mock data - replace with actual API calls
  const stats = [
    { title: "Total Items", value: "1,248", icon: <Package className="h-4 w-4 text-muted-foreground" />, description: "+20% from last month" },
    { title: "Active Users", value: "42", icon: <Users className="h-4 w-4 text-muted-foreground" />, description: "+5 from last month" },
    { title: "Recent Activities", value: "24", icon: <Activity className="h-4 w-4 text-muted-foreground" />, description: "+12% from last month" },
  ];

  return (
    <div className="font-poppins">
      <Dashboardheader title="Dashboard" />
      
      <div className="p-8 space-y-6">

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                {stat.icon}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Chart or additional content will be displayed here
              </div>
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-center">
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        Activity {item}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Description of activity {item}
                      </p>
                    </div>
                    <div className="ml-auto text-sm text-muted-foreground">
                      Just now
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
