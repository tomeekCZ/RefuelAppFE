import React, { useState, useEffect } from "react";
import NeonCard from "../../components/NeonCard";
import NeonButton from "../../components/NeonButton";
import type { Currency } from "../../types/Currency";
import type { User } from "../../types/User";
import { fetchFromApi } from "../../services/api";

const Profile: React.FC = () => {
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [user, setUser] = useState<User>(() =>
        JSON.parse(localStorage.getItem("currentUser") || "{}")
    );
    const [currencies, setCurrencies] = useState<Currency[]>([]);
    const [displayName, setDisplayName] = useState(user.displayName || "");
    const [email, setEmail] = useState(user.email || "");
    const [preferredCurrencyId, setPreferredCurrencyId] = useState(user.preferredCurrencyId || 1)

    useEffect(() => {
        fetchFromApi("currencies")
          .then((data) => setCurrencies(data))
          .catch(console.error);
      }, []);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();

        const updatedUser: User = {
            ...user,
            displayName,
            email,
            preferredCurrencyId
        };

        setUser(updatedUser);
        localStorage.setItem("currentUser", JSON.stringify(updatedUser));

        alert("Profile updated!");
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setProfilePhoto(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemovePhoto = () => {
        setProfilePhoto(null);
        setPreviewUrl(null);
    };

    return (
        <div className="min-h-screen bg-black flex justify-center items-center p-4">
            <NeonCard title="Profile" className="w-full max-w-md">
                <form onSubmit={handleSave} className="flex flex-col gap-4">

                    {/* Display name */}
                    <input
                        className="px-4 py-2 bg-gray-800 text-white border border-cyan-400 rounded focus:outline-none"
                        type="text"
                        placeholder="Display Name"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                    />

                    {/* Email */}
                    <input
                        className="px-4 py-2 bg-gray-800 text-white border border-cyan-400 rounded focus:outline-none"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    {/* Password with toggle */}
                    <div className="relative">
                        <input
                            className="w-full px-4 py-2 bg-gray-800 text-white border border-cyan-400 rounded focus:outline-none"
                            type={showPassword ? "text" : "password"}
                            placeholder="New Password"
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

                    <div>
                        <label className="block text-cyan-400 text-sm mb-1">Preferred Currency</label>
                        <select
                            value={preferredCurrencyId ?? ""}
                            onChange={(e) => setPreferredCurrencyId(Number(e.target.value))}
                            className="w-full bg-gray-900 text-cyan-200 border border-cyan-400 rounded px-3 py-2"
                        >
                            {currencies.map((currency) => (
                                <option key={currency.currencyId} value={currency.currencyId}>
                                    {currency.currencyCode} — {currency.currencyName}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Profile Photo Upload */}
                    <div className="text-sm text-gray-300">
                        <label className="block mb-1">Profile Photo</label>
                        {previewUrl && (
                            <>
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    className="w-24 h-24 rounded-full border-2 border-cyan-400 mx-auto mb-2 object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={handleRemovePhoto}
                                    className="text-sm text-red-400 hover:underline mb-2 block mx-auto"
                                >
                                    Remove Photo
                                </button>
                            </>
                        )}
                        <label className="text-sm text-cyan-400 hover:underline cursor-pointer block text-center">
                            {profilePhoto ? "Change Photo" : "Upload Photo"}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handlePhotoChange}
                                className="hidden"
                            />
                        </label>
                    </div>

                    {/* Submit */}
                    <NeonButton type="submit">Save Changes</NeonButton>

                    {/* Disable account */}
                    <button
                        type="button"
                        className="text-sm text-red-400 hover:underline mt-2"
                        onClick={() => alert("Account disabled (not really yet)")}
                    >
                        Disable Account
                    </button>
                </form>
            </NeonCard>
        </div>
    );
};

export default Profile;
