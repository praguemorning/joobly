import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { firstName, lastName, companyName, email, interest, hearAbout, message } = body;

        const transporter = nodemailer.createTransport({
            host: 'mail.webhouse.sk',
            port: 25,
            secure: false,
            auth: {
                user: 'info@praguemorning.cz',
                pass: 'Rudefans8686.',
            },
            tls: {
                rejectUnauthorized: false,
            },
        });

        // Configure the email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_TO,
            subject: `New contact message from ${firstName} ${lastName}`,
            html: `
        <h2>New Contact Message - Joobly</h2>
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
        <p><small>This message was sent from the Joobly contact form</small></p>
      `,
            replyTo: email,
        };

        // Send the email
        await transporter.sendMail(mailOptions);

        return NextResponse.json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        return NextResponse.json(
            { error: 'Error sending email' },
            { status: 500 }
        );
    }
}