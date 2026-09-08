import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { firstName, lastName, companyName, email, interest, hearAbout, message } = body;

        const transporter = nodemailer.createTransport({
            host: 'mail.webhouse.sk',
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            tls: {
                rejectUnauthorized: false,
            },
            requireTLS: true,
            connectionTimeout: 15000,
            greetingTimeout: 15000,
        });

        const mailOptions = {
            from: '"Prague Morning Contact Form" <info@praguemorning.cz>',
            to: process.env.EMAIL_TO,
            subject: `New contact message from ${firstName} ${lastName}`,
            html: `
        <h2>New Contact Message - Prague Morning</h2>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Company:</strong> ${companyName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Interested in:</strong> ${interest}</p>
        <p><strong>How did they hear about us:</strong> ${hearAbout}</p>
        <p><strong>Message:</strong></p>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 10px 0;">
          ${message}
        </div>
        <hr>
        <p><small>This message was sent from the Prague Morning contact form</small></p>
      `,
            replyTo: email,
        };

        console.log('Enviando email...');
        const info = await transporter.sendMail(mailOptions);
        console.log('✓ Email enviado:', info.messageId);

        return NextResponse.json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error detallado:', error);
        return NextResponse.json(
            {
                error: 'Error sending email',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}