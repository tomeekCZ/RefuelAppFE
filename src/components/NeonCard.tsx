import React from "react";

interface NeonCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const NeonCard: React.FC<NeonCardProps> = ({ title, children, className = "" }) => {
  return (
    <div
      className={`bg-gray-900 border border-cyan-400 rounded-2xl p-4 transition duration-300 shadow-[0_0_10px_#00ffff]
        ${className}`}
    >
      <h2 className="text-cyan-400 text-lg font-semibold mb-2">{title}</h2>
      <div className="text-white">{children}</div>
    </div>
  );
};

export default NeonCard;
