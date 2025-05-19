import React from "react";

interface NeonButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
}

const NeonButton: React.FC<NeonButtonProps> = ({
  children,
  onClick,
  type = "button",
  className = "",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`
        relative inline-block px-6 py-2 font-semibold rounded-lg
        text-cyan-400 border border-cyan-400
        hover:bg-cyan-400 hover:text-black
        transition duration-300 ease-in-out
        hover:shadow-[0_0_10px_#00ffff,0_0_20px_#00ffff]
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default NeonButton;
