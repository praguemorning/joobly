import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import mongoose from 'mongoose';
import { User } from '@/models/User';

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();
        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        await mongoose.connect(process.env.MONGODB_URI as string);
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ success: true });
        }

        const token = Math.random().toString(36).slice(2);
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 1000 * 60 * 60; // 1H
        await user.save();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_FROM,
                pass: process.env.EMAIL_PASS,
            },
        });

        const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${token}`;
        await transporter.sendMail({
            to: email,
            from: process.env.EMAIL_FROM,
            subject: 'Reset your password',
            html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. This link expires in 1 hour.</p>`
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Forgot password error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
