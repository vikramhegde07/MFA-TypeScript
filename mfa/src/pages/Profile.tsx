import { useAuth } from "@/context/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import EnableMFA from "@/components/MFA/EnableMFA";
import DisableMFA from "@/components/MFA/DisableMFA";
import { useState } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { BadgeCheck, ShieldOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
    const { user, login, logout } = useAuth();
    const [showEnable, setShowEnable] = useState(false);
    const [showDisable, setShowDisable] = useState(false);
    const navigator = useNavigate();

    const handleClose = async () => {
        try {
            const res = await api.get("/user/refresh-user");
            const { token, user } = res.data;
            logout();
            login({ token, user });
            if (user.mfaEnabled) setShowDisable(true);
            else setShowEnable(true);
        } catch (error) {
            console.log(error);
            toast.error("Error while refreshing user");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-zinc-900 dark:to-black transition-colors">
            <Card className="w-full max-w-md border border-gray-200 dark:border-zinc-800 shadow-xl rounded-xl">
                <CardContent className="p-6 space-y-6">
                    <h2 className="text-3xl font-bold text-center text-zinc-800 dark:text-white">
                        Profile
                    </h2>

                    <div className="space-y-3 text-center">
                        <p className="text-lg text-zinc-700 dark:text-zinc-300">
                            <span className="font-medium">Name:</span> {user?.username}
                        </p>
                        <p className="text-lg text-zinc-700 dark:text-zinc-300">
                            <span className="font-medium">Email:</span> {user?.email}
                        </p>

                        <div
                            className={`inline-flex items-center justify-center gap-2 text-sm px-4 py-2 rounded-full font-medium mt-2
                ${user?.mfaEnabled
                                    ? "bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-300"
                                    : "bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-300"
                                }
              `}
                        >
                            {user?.mfaEnabled ? (
                                <>
                                    <BadgeCheck size={18} /> MFA Enabled
                                </>
                            ) : (
                                <>
                                    <ShieldOff size={18} /> MFA Disabled
                                </>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 items-center pt-4">
                        {!user?.mfaEnabled ? (
                            <>
                                {!showEnable && (
                                    <Button
                                        onClick={() => setShowEnable(true)}
                                        className="w-full"
                                    >
                                        Enable MFA
                                    </Button>
                                )}
                                {showEnable && (
                                    <EnableMFA
                                        onClose={handleClose}
                                        onCancel={() => setShowEnable(false)}
                                    />
                                )}
                            </>
                        ) : (
                            <>
                                {!showDisable && (
                                    <Button
                                        variant="destructive"
                                        className="w-full"
                                        onClick={() => setShowDisable(true)}
                                    >
                                        Disable MFA
                                    </Button>
                                )}
                                {showDisable && (
                                    <DisableMFA
                                        onClose={handleClose}
                                        onCancel={() => setShowDisable(false)}
                                    />
                                )}
                            </>
                        )}

                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => { navigator('/') }}
                        >Home</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
