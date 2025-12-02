import React, { useState, useRef } from "react";
import { LuUser, LuUpload, LuTrash } from "react-icons/lu";

const ProfilePhotoSelector = ({ image, setImage }) => {
    const inputRef = useRef(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const openDialog = () => {
        if (inputRef.current) {
            inputRef.current.click();   
        }
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImage(file);
            setPreviewUrl(URL.createObjectURL(file));
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

            {!image ? (
                
                <div
                    className="w-20 h-20 flex items-center justify-center bg-purple-100 rounded-full relative cursor-pointer"
                    onClick={openDialog}   
                >
                    <LuUser className="text-4xl text-primary" />

                    <button
                        type="button"
                        onClick={openDialog}   
                        className="w-8 h-8 flex items-center justify-center bg-primary text-white rounded-full absolute -bottom-1 -right-1"
                    >
                        <LuUpload />
                    </button>
                </div>
            ) : (
                <div className="relative w-20 h-20">
                    <img
                        src={previewUrl}
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover cursor-pointer"
                        onClick={openDialog}   
                    />

                    <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full absolute -bottom-1 -right-1 cursor-pointer"
                    >
                        <LuTrash />
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProfilePhotoSelector;
