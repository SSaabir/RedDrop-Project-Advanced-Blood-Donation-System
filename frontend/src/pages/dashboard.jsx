import React from 'react';
import { Card, Button } from 'flowbite-react';
import { DashboardSidebar } from '../components/DashboardSidebar';
import { useAuthContext } from '../hooks/useAuthContext';

export default function Dashboard() {
  const { user } = useAuthContext();
  const userRole = user?.role; // Default to 'donor'; adjust based on your auth structure

  return (
    <div className="flex h-screen bg-gray-100">
      <DashboardSidebar />
      {userRole === 'Donor' ? (
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <h5 className="text-2xl font-bold tracking-tight text-red-700">Blood Type</h5>
              <p className="font-normal text-gray-700">O+</p>
            </Card>
            <Card>
              <h5 className="text-2xl font-bold tracking-tight text-red-700">Next Donation</h5>
              <p className="font-normal text-gray-700">March 15, 2025</p>
            </Card>
            <Card>
              <h5 className="text-2xl font-bold tracking-tight text-red-700">Total Donations</h5>
              <p className="font-normal text-gray-700">5</p>
            </Card>
          </div>
          <div className="mt-6">
            <Card>
              <h5 className="text-2xl font-bold tracking-tight text-red-700">Donation History</h5>
              <div className="h-96">
                <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg">
                  <span className="text-gray-500">Chart will go here</span>
                </div>
              </div>
            </Card>
          </div>
        </main>
      ) : userRole === 'Hospital' ? (
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <h5 className="text-2xl font-bold tracking-tight text-red-700">Blood Stock</h5>
              <p className="font-normal text-gray-700">50 Units</p>
            </Card>
            <Card>
              <h5 className="text-2xl font-bold tracking-tight text-red-700">Active Donors</h5>
              <p className="font-normal text-gray-700">120</p>
            </Card>
            <Card>
              <h5 className="text-2xl font-bold tracking-tight text-red-700">Pending Requests</h5>
              <p className="font-normal text-gray-700">8</p>
            </Card>
          </div>
          <div className="mt-6">
            <Card>
              <h5 className="text-2xl font-bold tracking-tight text-red-700">Blood Stock Levels</h5>
              <div className="h-96">
                <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg">
                  <span className="text-gray-500">Chart will go here</span>
                </div>
              </div>
            </Card>
          </div>
        </main>
      ) : userRole === 'Manager' ? (
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <h5 className="text-2xl font-bold tracking-tight text-red-700">Total Users</h5>
              <p className="font-normal text-gray-700">1,234</p>
            </Card>
            <Card>
              <h5 className="text-2xl font-bold tracking-tight text-red-700">Hospitals</h5>
              <p className="font-normal text-gray-700">45</p>
            </Card>
            <Card>
              <h5 className="text-2xl font-bold tracking-tight text-red-700">Inactive Accounts</h5>
              <p className="font-normal text-gray-700">12</p>
            </Card>
          </div>
          <div className="mt-6">
            <Card>
              <h5 className="text-2xl font-bold tracking-tight text-red-700">System Activity</h5>
              <div className="h-96">
                <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg">
                  <span className="text-gray-500">Chart will go here</span>
                </div>
              </div>
            </Card>
          </div>
        </main>
      ) : (
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6">
          <div className="text-center text-red-700 text-xl">Unauthorized Role</div>
        </main>
      )}
    </div>
  );
}