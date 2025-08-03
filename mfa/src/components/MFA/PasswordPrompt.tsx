import { useState } from "react";
import api from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

type Props = {
    onVerified: () => void;
    onCancel: () => void;
};

export default function PasswordPrompt({ onVerified, onCancel }: Props) {
    const [password, setPassword] = useState("");

    const handleVerify = async () => {
        try {
            const res = await api.post("/user/verify-password", { password });
            if (res.status === 200) {
                const { message, verified } = res.data;
                toast.success(message);
                if (verified)
                    onVerified();
            }
        } catch (err) {
            toast.error("Invalid password");
        }
    };

    return (
        <div className="space-y-2 mt-4 w-full">
            <Input
                type="password"
                placeholder="Enter password to continue"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <div className="flex flex-row justify-end gap-3 mt-4">
                <Button variant="destructive" onClick={onCancel} className="cursor-pointer">Cancel</Button>
                <Button onClick={handleVerify} className="cursor-pointer">Continue</Button>
            </div>
        </div>
    );
}
