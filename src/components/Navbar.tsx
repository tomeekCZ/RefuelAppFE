import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";

const navLinks = [
    { label: "Dashboard", to: "/dashboard" },
    { label: "Refuel", to: "/logs/new" },
    { label: "Cars", to: "/cars" },
    { label: "Analytics", to: "/analytics" },
    { label: "Log History", to: "/logs/history" },
    { label: "Profile", to: "/profile" },
];

const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="bg-black border-b border-cyan-400 p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
                <button
                    onClick={() => setIsOpen(true)}
                    className="text-cyan-400 z-50"
                    aria-label="Open menu"
                >
                    <Menu size={28} />
                </button>
                <h1 className="text-cyan-400 font-bold text-xl">FuelTracker</h1>
            </div>

            {isOpen && (
                <div className="fixed top-0 left-0 w-64 h-full bg-gray-900 border-r border-cyan-400 z-[9999] shadow-2xl animate-slide-in-left flex flex-col p-6">
                    <button
                        onClick={() => setIsOpen(false)}
                        className="self-end text-cyan-400 mb-4"
                        aria-label="Close menu"
                    >
                        <X size={28} />
                    </button>
                    <ul className="space-y-4 text-cyan-200 text-lg">
                        {navLinks.map((link) => (
                            <li key={link.to}>
                                <NavLink
                                    to={link.to}
                                    onClick={() => setIsOpen(false)}
                                    className={({ isActive }) =>
                                        `block ${isActive ? "text-cyan-400 font-semibold" : "text-cyan-200"} hover:underline`
                                    }
                                >
                                    {link.label}
                                </NavLink>
                            </li>
                        ))}
                        <li>
                            <button
                                onClick={() => {
                                    localStorage.removeItem("currentUser");
                                    window.location.href = "/login"; // redirect after logout
                                }}
                                className="text-red-400 hover:underline"
                            >
                                Logout
                            </button>
                        </li>
                    </ul>

                </div>
            )}
        </nav>
    );
};

export default Navbar;
