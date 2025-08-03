import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-hot-toast';
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function Register() {
    const { login } = useAuth();
    const navigator = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const data = {
            username: formData.get("username") as string,
            email: formData.get("email") as string,
            password: formData.get("password") as string,
            confirmPassword: formData.get("confirmPassword") as string,
        };

        if (data.password !== data.confirmPassword)
            return toast.error("Passwords do not match");

        try {
            const res = await api.post('/user/register', data)
            if (res.status === 201) {
                toast.success("Login successfull");
                const { token, user } = res.data;
                login({ token, user });
                navigator('/');
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to register user");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black transition-colors">
            <Card className="w-full max-w-md border border-gray-200 dark:border-zinc-800 shadow-md">
                <CardContent className="p-6 space-y-5">
                    <h2 className="text-2xl font-semibold text-center text-zinc-800 dark:text-white">
                        Create an Account
                    </h2>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                name="username"
                                type="text"
                                placeholder="e.g. johndoe"
                            />
                        </div>
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
                            <Label htmlFor="password">New Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                            />
                        </div>
                        <div className="flex justify-center mt-4">
                            <Button
                                type="submit"
                                className="w-fit"
                            >
                                Register
                            </Button>
                        </div>
                    </form>

                    <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
                        Already have an account?{" "}
                        <button
                            onClick={() => { navigator('/login') }}
                            className="text-blue-600 dark:text-blue-400 underline hover:opacity-80 cursor-pointer"
                        >
                            Login
                        </button>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
