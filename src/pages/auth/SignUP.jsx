import React, { useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Input from "../../components/Inputs/Input";
import { validateEmail } from "../../utils/helper";
import ProfilePhotoSelector from "../../components/Inputs/ProfilePhotoSelector";
import api from "../../utils/api";

const SignUP = () =>{
    const [profilePic, setProfilePic] = useState(null);
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error , setError] = useState(null);

    const navigate = useNavigate();

    //handle the sign up form submit.
    const handleSignUp = async (e) => {
  e.preventDefault();
  if (!fullName || !validateEmail(email) || !password) {
    setError("Please fill all fields correctly.");
    return;
  }

  try {
    let profileImageUrl = "";

    // 1. Upload Image First if selected
    if (profilePic) {
      const formData = new FormData();
      formData.append("image", profilePic);
      const imgRes = await api.post("/auth/upload-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      profileImageUrl = imgRes.data.imageUrl;
    }

    // 2. Register User
    const res = await api.post("/auth/register", {
      fullName,
      email,
      password,
      profileImageUrl,
    });

    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    }
  } catch (err) {
    setError(err.response?.data?.message || "Registration failed.");
  }
};

    return(
        <AuthLayout>
            <div className="w-full">
                <h3 className="text-2xl font-semibold text-white tracking-tight" >Create an Account</h3>
                <p className="text-sm text-zinc-400 mt-2 mb-8">Join us today by entering your details below </p>

                <form onSubmit={handleSignUp} className="space-y-4">

                    <ProfilePhotoSelector image={profilePic} setImage={setProfilePic}/>

                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                        <Input 
                        value={fullName}
                        onChange={({target}) => setFullName(target.value)}
                        label="Full Name"
                        placeholder="John"
                        type="text"
                        />

                        <Input
                        value={email}
                        onChange={({ target }) => setEmail(target.value)}
                        label="Email Address"
                        placeholder="somethingrandom@gmail.com"
                        type="text"
                        />
                        <div className="col-span-1 md:col-span-2">
                        <Input
                        value={password}
                        onChange={({ target }) => setPassword(target.value)}
                        label="Password"
                        placeholder="Minimum 8 Characters"
                        type="password"
                        />
                        </div>

                        {error && <p className="text-red-500 text-sm col-span-1 md:col-span-2">{error}</p>}
                        
                        <div className="col-span-1 md:col-span-2 pt-2">
                            <button type="submit" className="btn-primary py-3.5">
                              SIGN UP
                            </button>
                        </div>
                        <p className="text-sm text-zinc-400 mt-6 text-center col-span-1 md:col-span-2">
                            Already have an account?{" "}
                            <Link className="font-medium text-indigo-400 hover:text-indigo-300 underline underline-offset-4 transition-colors" to="/login">
                                Log In
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </AuthLayout>
    )
}
export default SignUP