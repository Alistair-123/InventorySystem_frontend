import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Dashboardheader from "@/components/Dashboardheader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Package, Users, DollarSign } from 'lucide-react';
import { ChartPieDonutText } from '@/components/ChartPieDonutText';
import axiosInstance from '@/utils/axiosInstance';
function Dashboard() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axiosInstance.get(
          "/dashoardroute/dashboard"
        );

        setDashboardData(res.data);
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <div className="p-6">Loading dashboard...</div>;
  if (!dashboardData) return <div className="p-6">Failed to load data</div>;

  const stats = [
    {
      title: "Total Items",
      value: dashboardData.totalItems.toLocaleString(),
      icon: <Package className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "Total Properties",
      value: dashboardData.totalProperties.toLocaleString(),
      icon: <Activity className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "Total Users",
      value: dashboardData.totalUsers.toLocaleString(),
      icon: <Users className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "Total Property Value",
      value: `₱ ${dashboardData.totalPropertyValue.toLocaleString()}`,
      icon: <DollarSign className="h-4 w-4 text-muted-foreground" />,
    },
  ];

  return (
    <div className="font-poppins">
      <Dashboardheader title="Dashboard" />
      <div className="p-4">
        <div className="flex gap-4 ">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 w-[45%] h-2/4">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  {stat.icon}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Donut Chart */}
          <div className="flex-1">
            <ChartPieDonutText
              statusBreakdown={dashboardData.propertyStatusBreakdown}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;