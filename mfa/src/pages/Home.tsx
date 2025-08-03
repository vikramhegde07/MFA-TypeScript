import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BadgeCheck, ShieldOff, LogOut, UserCog } from "lucide-react";

export default function Home() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-zinc-900 dark:to-black transition-colors">
            <p className="text-center text-base md:text-lg text-muted-foreground mb-6">
                Welcome to the MFA Example App — a public demo to explore Multi-Factor Authentication. All user accounts and task data are temporary and will be deleted automatically after 24 hours.
            </p>

            <Card className="w-full max-w-md border border-gray-200 dark:border-zinc-800 shadow-xl rounded-xl">
                <CardContent className="p-6 space-y-6">
                    <h2 className="text-3xl font-bold text-center text-zinc-800 dark:text-white">
                        Welcome, {user?.username || "User"}!
                    </h2>

                    <div className="text-center space-y-2">
                        <p className="text-lg text-zinc-700 dark:text-zinc-300">
                            MFA Status:
                        </p>

                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-opacity-10 transition-colors
              ${user?.mfaEnabled
                                ? "bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-300"
                                : "bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-300"
                            }`}
                        >
                            {user?.mfaEnabled ? (
                                <>
                                    <BadgeCheck size={18} /> Enabled
                                </>
                            ) : (
                                <>
                                    <ShieldOff size={18} /> Disabled
                                </>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 pt-4 items-center">
                        <Button
                            onClick={() => navigate("/profile")}
                            className="w-full flex items-center gap-2"
                            variant="default"
                        >
                            <UserCog size={18} /> Go to Profile
                        </Button>

                        <Button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2"
                            variant="destructive"
                        >
                            <LogOut size={18} /> Logout
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
