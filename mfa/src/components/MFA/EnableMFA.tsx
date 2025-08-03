import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import PasswordPrompt from "./PasswordPrompt";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

type EnableMFAProps = {
    onClose: () => void;
    onCancel: () => void;
};

export default function EnableMFA({ onClose, onCancel }: EnableMFAProps) {
    const [code, setCode] = useState("");
    const [verified, setVerified] = useState<boolean>(false);
    const [qrData, setQRData] = useState<string | undefined>(undefined);
    const [mfaVerified, setmfaVerified] = useState(false);

    const getQR = async () => {
        if (verified) {
            try {
                const res = await api.get('/user/setup-mfa');
                const { qrCode } = res.data;
                setQRData(qrCode);
            } catch (err) {
                toast.error("Error while setting up MFA");
                console.error(err);
            }
        }
    }

    const handleVerify = async () => {
        try {
            const res = await api.post("/user/verify-mfa-setup", { token: code });
            if (res.status === 200)
                setmfaVerified(true);
            toast.success("MFA Enabled");
        } catch (err: any) {
            toast.error("Failed to verify MFA")
            console.error(err);
        }
    };
    useEffect(() => {
        getQR();
    }, [verified])

    if (!verified)
        return <PasswordPrompt onVerified={() => setVerified(true)} onCancel={onCancel} />

    if (mfaVerified)
        return (
            <div className="flex items-center justify-center">
                <Button variant="outline" onClick={onClose}>Close and Refresh</Button>
            </div>
        )

    return (
        <div className="border rounded p-4 mt-4 dark:border-zinc-700">
            {qrData !== undefined && <img src={qrData} alt="QR Code" className="mx-auto" />}
            <p className="text-sm text-center text-zinc-700 dark:text-zinc-300">
                Scan the QR code with your Authenticator app, then enter the 6-digit code:
            </p>

            <div className="flex justify-center my-3">
                <InputOTP maxLength={6} value={code} onChange={setCode}>
                    <InputOTPGroup>
                        {[...Array(6)].map((_, i) => (
                            <InputOTPSlot key={i} index={i} />
                        ))}
                    </InputOTPGroup>
                </InputOTP>
            </div>

            <div className="flex justify-center gap-2">
                <Button variant="ghost" onClick={onCancel}>Cancel</Button>
                <Button onClick={handleVerify} disabled={code.length !== 6}>Verify Code</Button>
            </div>
        </div>
    );
}
