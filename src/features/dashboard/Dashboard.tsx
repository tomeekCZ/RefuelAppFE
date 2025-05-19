import React from "react";
import NeonCard from "../../components/NeonCard";
import NeonButton from "../../components/NeonButton";
import { Link } from "react-router-dom";

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white p-4 flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-cyan-400">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <NeonCard title="Avg. Fuel Efficiency">
          <p className="text-xl">12.3 km/l</p>
        </NeonCard>

        <NeonCard title="Total Distance">
          <p className="text-xl">32,840 km</p>
        </NeonCard>

        <NeonCard title="Fuel Cost / km">
          <p className="text-xl">€0.11</p>
        </NeonCard>
      </div>

      <div className="flex justify-center mt-6">
        <Link to="/logs/new">
          <NeonButton>Log Refueling</NeonButton>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
