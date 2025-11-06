"use client";
import React, { useState } from "react";
import Button from "@/lib/components/button/button";
import Input from "@/lib/components/input/input";
import { useForm, SubmitHandler } from "react-hook-form";

interface Inputs {
    email: string;
}

const ForgotPassword = () => {
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { handleSubmit, control, formState: { errors } } = useForm<Inputs>();

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        setError(null);
        try {
            const res = await fetch('/api/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: data.email })
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || 'Error sending reset email.');
            }
            setSubmitted(true);
        } catch (e: any) {
            setError(e.message || "Error sending reset email. Try again later.");
        }
    };

    return (
        <section className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold mb-4 text-center">Forgot your password?</h1>
                {submitted ? (
                    <p className="text-green-600 text-center">If the email exists, you will receive a reset link shortly.</p>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                        <Input
                            control={control}
                            name="email"
                            label="Email address"
                            isRequired
                            placeholder="Enter your email"
                            errors={errors}
                            type="email"
                        />
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <Button className="btn-primary" style={{ width: "100%" }}>Send reset link</Button>
                    </form>
                )}
            </div>
        </section>
    );
};

export default ForgotPassword;
