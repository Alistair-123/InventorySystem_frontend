import React from 'react';
import Dashboardheader from "@/components/Dashboardheader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Package, Users, DollarSign } from 'lucide-react';
import { ChartPieDonutText } from '@/components/ChartPieDonutText';

function Dashboard() {
  const stats = [
    {
      title: "Total Items",
      value: "1,248",
      icon: <Package className="h-4 w-4 text-muted-foreground" />,
      description: "+20% from last month",
    },
    {
      title: "Total Properties",
      value: "384",
      icon: <Activity className="h-4 w-4 text-muted-foreground" />,
      description: "+8% from last month",
    },
    {
      title: "Total Users",
      value: "42",
      icon: <Users className="h-4 w-4 text-muted-foreground" />,
      description: "+5 from last month",
    },
    {
      title: "Total Property Value",
      value: "$2.4M",
      icon: <DollarSign className="h-4 w-4 text-muted-foreground" />,
      description: "+12% from last month",
    },
  ];

  return (
    <div className="font-poppins">
      <Dashboardheader title="Dashboard" />
      <div className="p-4">
        <div className="flex gap-4">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 w-[45%]">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  {stat.icon}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Donut Chart */}
          <div >
            <ChartPieDonutText />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;