import React, { useState, useRef, useEffect } from "react";
import { LuUser, LuUpload, LuTrash } from "react-icons/lu";

const ProfilePhotoSelector = ({ image, setImage }) => {
    const inputRef = useRef(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    // If image is a string (URL from backend), set it as preview
    useEffect(() => {
        if (typeof image === 'string') {
            setPreviewUrl(image);
        } else if (image instanceof File) {
            const url = URL.createObjectURL(image);
            setPreviewUrl(url);
            return () => URL.revokeObjectURL(url);
        } else {
            setPreviewUrl(null);
        }
    }, [image]);

    const openDialog = () => {
        if (inputRef.current) {
            inputRef.current.click();
        }
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImage(file);
        }
    };

    const handleRemoveImage = () => {
        setImage(null);
        setPreviewUrl(null);
    };

    return (
        <div className="flex justify-center mb-6">
            <input
                type="file"
                accept="image/*"
                ref={inputRef}
                onChange={handleImageChange}
                className="hidden"
            />

            {!previewUrl ? (
                <div
                    className="w-24 h-24 flex items-center justify-center bg-zinc-900 border-2 border-dashed border-zinc-700 rounded-full relative cursor-pointer group hover:border-indigo-500 transition-colors"
                    onClick={openDialog}
                >
                    <LuUser className="text-4xl text-zinc-600 group-hover:text-indigo-400 transition-colors" />

                    <div className="w-8 h-8 flex items-center justify-center bg-zinc-800 border border-zinc-700 text-zinc-400 group-hover:bg-indigo-600 group-hover:border-indigo-500 group-hover:text-white rounded-full absolute bottom-0 right-0 shadow-lg transition-colors">
                        <LuUpload size={14} />
                    </div>
                </div>
            ) : (
                <div className="relative w-24 h-24 group">
                    <div className="w-full h-full rounded-full overflow-hidden border-2 border-zinc-800 shadow-xl group-hover:border-indigo-500 transition-colors cursor-pointer" onClick={openDialog}>
                        <img
                            src={previewUrl}
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                            <span className="text-xs font-medium text-white shadow-sm">Change</span>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="w-8 h-8 flex items-center justify-center bg-zinc-900 border border-zinc-800 text-red-400 hover:bg-red-500 hover:text-white hover:border-red-500 rounded-full absolute bottom-0 right-0 shadow-lg transition-all"
                    >
                        <LuTrash size={14} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProfilePhotoSelector;
