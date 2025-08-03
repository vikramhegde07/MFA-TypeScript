import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

export default function Login() {
    const navigator = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formdata = new FormData(e.currentTarget);
        const data = {
            email: formdata.get('email') as string,
            password: formdata.get('password') as string
        }

        try {
            const res = await api.post('/user/login', data);
            if (res.status === 200) {
                const { token, user, mfaRequired } = res.data;
                login({ token, user });
                if (mfaRequired) {
                    navigator('/mfa');
                }
                else {
                    navigator('/');
                }
            }
        } catch (error) {
            console.error(error);
            toast.error("Login Error!")
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-black transition-colors">
            <p className="text-sm text-center text-muted-foreground mb-4">
                <strong>Note:</strong> This is a demo application. All accounts and data created here will be automatically deleted after 24 hours. Please avoid using real credentials.
            </p>

            <Card className="w-full max-w-md border border-gray-200 dark:border-zinc-800 shadow-md">
                <CardContent className="p-6 space-y-5">
                    <h2 className="text-2xl font-semibold text-center text-zinc-800 dark:text-white">
                        Welcome Back
                    </h2>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                            />
                        </div>

                        <Button type="submit" className="w-full">
                            Login
                        </Button>
                    </form>

                    <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
                        Don&apos;t have an account?{" "}
                        <button
                            onClick={() => { navigator('/register') }}
                            className="text-blue-600 dark:text-blue-400 underline hover:opacity-80 cursor-pointer"
                        >
                            Register
                        </button>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
