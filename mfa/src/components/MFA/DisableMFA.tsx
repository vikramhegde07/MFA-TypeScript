import { useState } from "react";
import { Button } from "../ui/button";
import PasswordPrompt from "./PasswordPrompt";
import api from "@/lib/api";
import toast from "react-hot-toast";

type DisableMFAProps = {
    onClose: () => void;
    onCancel: () => void;
};

export default function DisableMFA({ onClose, onCancel }: DisableMFAProps) {
    const [verified, setVerified] = useState<boolean>(false);

    const handleDisable = async () => {
        try {
            const res = await api.post('/user/disable-mfa');
            if (res.status === 200) {
                toast.success("MFA Disabled");
                onClose();
            }
        } catch (error) {
            console.error(error);
            toast.error("Error while disabling MFA")
        }
    }

    if (!verified)
        return <PasswordPrompt onVerified={() => setVerified(true)} onCancel={onCancel} />

    // Ask for confirmation or a TOTP input if needed
    return (
        <div className="border rounded p-4 mt-4 dark:border-zinc-700">
            <p className="text-sm mb-2 text-zinc-700 dark:text-zinc-300">
                Are you sure you want to disable MFA?
            </p>
            <Button variant="destructive" className="mr-2" onClick={handleDisable}>Yes, Disable</Button>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
        </div>
    );
}
