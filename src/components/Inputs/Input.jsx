import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const Input = ({ value, onChange, placeholder, label, type }) => {
    const [showPassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="mb-4 w-full">
            {label && <label className="block text-sm font-medium text-zinc-400 mb-1.5">{label}</label>}

            <div className="relative flex items-center w-full input-box rounded-xl overflow-hidden group">
                <input
                    type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
                    placeholder={placeholder}
                    className="w-full bg-transparent outline-none px-4 py-3 text-sm placeholder:text-zinc-600 transition-colors"
                    value={value}
                    onChange={(e) => onChange(e)}
                />

                {type === "password" && (
                    <div
                        className="pr-4 cursor-pointer text-zinc-500 hover:text-indigo-400 transition-colors flex items-center justify-center h-full"
                        onClick={toggleShowPassword}
                    >
                        {showPassword ? (
                            <FaRegEye size={18} />
                        ) : (
                            <FaRegEyeSlash size={18} />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Input;