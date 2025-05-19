import React, { useState } from "react";
import NeonCard from "../../components/NeonCard";
import NeonButton from "../../components/NeonButton";
import { Link } from "react-router-dom";

const Register: React.FC = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<string[]>([]);
    const [showPassword, setShowPassword] = useState(false);


    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = [];

        if (!username.trim()) validationErrors.push("Username is required.");
        if (!email.trim()) validationErrors.push("Email is required.");
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
            validationErrors.push("Email is not valid.");
        if (!password.trim()) validationErrors.push("Password is required.");

        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors([]);
        console.log("Registering:", { username, email, password });
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <NeonCard title="Register" className="w-full max-w-sm">
                <form onSubmit={handleRegister} className="flex flex-col gap-4">
                    <input
                        className="px-4 py-2 rounded bg-gray-800 text-white border border-cyan-400 focus:outline-none"
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        className="px-4 py-2 rounded bg-gray-800 text-white border border-cyan-400 focus:outline-none"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <div className="relative">
                        <input
                            className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-cyan-400 focus:outline-none"
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-cyan-400 text-sm"
                            onClick={() => setShowPassword((prev) => !prev)}
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>

                    {errors.length > 0 && (
                        <div className="text-red-400 text-sm space-y-1">
                            {errors.map((err, i) => (
                                <p key={i}>• {err}</p>
                            ))}
                        </div>
                    )}

                    <NeonButton type="submit">Register</NeonButton>
                </form>

                <p className="text-sm text-center text-gray-400 mt-2">
                    Already have an account?{" "}
                    <Link to="/login" className="text-cyan-400 hover:underline">
                        Login here
                    </Link>
                </p>
            </NeonCard>
        </div>
    );
};

export default Register;
