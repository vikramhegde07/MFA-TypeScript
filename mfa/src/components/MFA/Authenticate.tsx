// src/pages/VerifyMfa.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Label } from "../ui/label";


export default function Authenticate() {
    const [code, setCode] = useState("");
    const navigate = useNavigate();

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await api.post("/user/verify-mfa", { otp: parseInt(code) });

            if (res.data?.token) {
                // Save real token
                localStorage.setItem("token", res.data.token);
                sessionStorage.removeItem("tempToken");

                toast.success("MFA Verified!");
                navigate("/"); // Go to dashboard/home
            }
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Invalid code");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <form onSubmit={handleVerify} className="bg-card p-6 rounded-xl shadow max-w-sm w-full space-y-4">
                <h2 className="text-xl font-bold text-center">Verify MFA</h2>
                <Label>Enter 6 digit code</Label>
                <InputOTP maxLength={6} value={code} onChange={setCode}>
                    <InputOTPGroup>
                        {[...Array(6)].map((_, i) => (
                            <InputOTPSlot key={i} index={i} />
                        ))}
                    </InputOTPGroup>
                </InputOTP>
                <Button type="submit" className="w-full">Verify</Button>
            </form>
        </div>
    );
}
