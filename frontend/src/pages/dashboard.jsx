import { useEffect, useRef } from 'react';
import { Card } from 'flowbite-react';
import { DashboardSidebar } from '../components/DashboardSidebar';
import { useAuthContext } from '../hooks/useAuthContext';
import { useDashboardData } from '../hooks/useDashboardData';
import Chart from 'chart.js/auto';

export default function Dashboard() {
  const { user } = useAuthContext();
  const { data, loading, error } = useDashboardData();
  const userRole = user?.role;
  const chartRef = useRef(null);

  useEffect(() => {
    if (!data) return;
    const ctx = document.getElementById('dashboardChart')?.getContext('2d');
    if (!ctx) return;

    // Destroy existing chart before creating a new one
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    let chartData = {};
    if (userRole === 'Donor') {
      chartData = {
        labels: data.donationHistory?.map(d => new Date(d.date).toLocaleDateString()) || [],
        datasets: [{
          label: 'Donations',
          data: data.donationHistory?.map((_, index) => index + 1) || [],
          backgroundColor: 'rgba(220, 38, 38, 0.5)',
        }],
      };
    } else if (userRole === 'Hospital') {
      chartData = {
        labels: data.bloodStock?.map(s => s.bloodType) || [],
        datasets: [{
          label: 'Units',
          data: data.bloodStock?.map(s => s.units) || [],
          backgroundColor: 'rgba(220, 38, 38, 0.5)',
        }],
      };
    } else if (userRole === 'Manager') {
      chartData = {
        labels: ['Users', 'Hospitals', 'Inactive', 'Inquiries'],
        datasets: [{
          label: 'Counts',
          data: [
            data.totalUsers,
            data.hospitals,
            data.inactiveAccounts,
            data.pendingInquiries,
          ],
          backgroundColor: 'rgba(220, 38, 38, 0.5)',
        }],
      };
    }

    chartRef.current = new Chart(ctx, {
      type: 'bar',
      data: chartData,
      options: { scales: { y: { beginAtZero: true } } },
    });

    // Cleanup chart on unmount
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [data, userRole]);

  // (Your JSX remains unchanged below)

  if (loading) return <div className="flex h-screen items-center justify-center text-gray-600">Loading...</div>;
  if (error) return <div className="flex h-screen items-center justify-center text-red-700">{error}</div>;

  return (
    <div className="flex h-screen bg-gray-100">
      <DashboardSidebar />
      {userRole === 'Donor' && data ? (
        <main className="flex-1 p-6 overflow-auto bg-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="shadow-md">
              <h5 className="text-xl font-bold text-red-700">Blood Type</h5>
              <p className="text-gray-700">{data.bloodType}</p>
            </Card>
            <Card className="shadow-md">
              <h5 className="text-xl font-bold text-red-700">Next Appointment</h5>
              <p className="text-gray-700">
                {data.nextAppointment
                  ? `${new Date(data.nextAppointment.date).toLocaleDateString()} at ${data.nextAppointment.time}`
                  : 'None scheduled'}
              </p>
            </Card>
            <Card className="shadow-md">
              <h5 className="text-xl font-bold text-red-700">Total Donations</h5>
              <p className="text-gray-700">{data.totalDonations}</p>
            </Card>
            <Card className="shadow-md">
              <h5 className="text-xl font-bold text-red-700">Health Status</h5>
              <p className="text-gray-700">{data.healthStatus ? 'Eligible' : 'Not Eligible'}</p>
            </Card>
          </div>
          <div className="mt-6">
            <Card className="shadow-md">
              <h5 className="text-xl font-bold text-red-700">Donation History</h5>
              <div className="h-80">
                <canvas id="dashboardChart"></canvas>
              </div>
            </Card>
          </div>
        </main>
      ) : userRole === 'Hospital' && data ? (
        <main className="flex-1 p-6 overflow-auto bg-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="shadow-md">
              <h5 className="text-xl font-bold text-red-700">Blood Stock</h5>
              <p className="text-gray-700">{data.totalStock} Units</p>
            </Card>
            <Card className="shadow-md">
              <h5 className="text-xl font-bold text-red-700">Active Donors</h5>
              <p className="text-gray-700">{data.activeDonors}</p>
            </Card>
            <Card className="shadow-md">
              <h5 className="text-xl font-bold text-red-700">Pending Requests</h5>
              <p className="text-gray-700">{data.pendingRequests}</p>
            </Card>
          </div>
          <div className="mt-6">
            <Card className="shadow-md">
              <h5 className="text-xl font-bold text-red-700">Blood Stock Levels</h5>
              <div className="h-80">
                <canvas id="dashboardChart"></canvas>
              </div>
            </Card>
          </div>
        </main>
      ) : userRole === 'Manager' && data ? (
        <main className="flex-1 p-6 overflow-auto bg-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="shadow-md">
              <h5 className="text-xl font-bold text-red-700">Total Users</h5>
              <p className="text-gray-700">{data.totalUsers}</p>
            </Card>
            <Card className="shadow-md">
              <h5 className="text-xl font-bold text-red-700">Hospitals</h5>
              <p className="text-gray-700">{data.hospitals}</p>
            </Card>
            <Card className="shadow-md">
              <h5 className="text-xl font-bold text-red-700">Inactive Accounts</h5>
              <p className="text-gray-700">{data.inactiveAccounts}</p>
            </Card>
            <Card className="shadow-md">
              <h5 className="text-xl font-bold text-red-700">Pending Inquiries</h5>
              <p className="text-gray-700">{data.pendingInquiries}</p>
            </Card>
          </div>
          <div className="mt-6">
            <Card className="shadow-md">
              <h5 className="text-xl font-bold text-red-700">System Activity</h5>
              <div className="h-80">
                <canvas id="dashboardChart"></canvas>
              </div>
            </Card>
          </div>
        </main>
      ) : (
        <main className="flex-1 p-6 overflow-auto bg-gray-200">
          <div className="text-center text-red-700 text-xl">Invalid Role</div>
        </main>
      )}
    </div>
  );
} 