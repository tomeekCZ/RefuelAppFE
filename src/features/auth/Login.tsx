import React, { useState } from "react";
import NeonCard from "../../components/NeonCard";
import NeonButton from "../../components/NeonButton";
import { Link, useNavigate } from "react-router-dom";
import type { User } from "../../types/User";
import { fetchFromApi } from "../../services/api";

const Login: React.FC = () => {
    const [username, setUsername] = useState("driver1");
    const [password, setPassword] = useState("password");
    const [errors, setErrors] = useState<string[]>([]);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = [];
      
        if (!username.trim()) validationErrors.push("Username is required.");
        if (!password.trim()) validationErrors.push("Password is required.");
      
        if (validationErrors.length > 0) {
          setErrors(validationErrors);
          return;
        }
      
        try {
          const user: User = await fetchFromApi("login", {
            method: "POST",
            body: JSON.stringify({ username, password }),
          });
      
          localStorage.setItem("currentUser", JSON.stringify(user));
          setErrors([]);
          navigate("/dashboard");
        } catch (err: unknown) {
            if (err instanceof Error) {
              try {
                const parsed = JSON.parse(err.message.replace(/^API error: \d+ - /, ""));
                setErrors([parsed.error || "Login failed."]);
              } catch {
                setErrors(["Login failed. Please try again."]);
              }
            } else {
              setErrors(["Unexpected error occurred."]);
            }
          }
      };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <NeonCard title="Login" className="w-full max-w-sm">
                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    <input
                        className="px-4 py-2 rounded bg-gray-800 text-white border border-cyan-400 focus:outline-none"
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
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

                    <NeonButton type="submit">Login</NeonButton>
                </form>

                <p className="text-sm text-center text-gray-400 mt-2">
                    Don’t have an account?{" "}
                    <Link to="/register" className="text-cyan-400 hover:underline">
                        Register here
                    </Link>
                </p>
            </NeonCard>
        </div>
    );
};

export default Login;
