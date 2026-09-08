const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
import { PointsOrder } from "@/models/PointsOrder";
import { User } from "@/models/User";
import mongoose from "mongoose";

export async function POST(req: Request) {
    const sig = req.headers.get('stripe-signature');
    let event;

    try {
        const reqBuffer = await req.text();
        const signSecret = process.env.STRIPE_SIGN_SECRET!;
        event = stripe.webhooks.constructEvent(reqBuffer, sig, signSecret);
        console.log('Stripe Event:', JSON.stringify(event, null, 2));

    } catch (error) {
        console.error('stripe error');
        return new Response(JSON.stringify({ error: 'Invalid signature' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }


    if (event.type === 'checkout.session.completed') {
        console.log(event);
        const orderId = event?.data?.object?.metadata?.orderId;
        const isPaid = event?.data?.object?.payment_status === 'paid';

        if (isPaid) {
            try {
                await mongoose.connect(process.env.MONGODB_URI as string);
                console.log(`Order ID: ${orderId}`);
                console.log(`Is Paid: ${isPaid}`);

                const orderPaid = await PointsOrder.updateOne({ _id: orderId }, { paid: true });
                console.log(`Order Paid Response:`, orderPaid);

                const order = await PointsOrder.findById(orderId);
                console.log(`Order:`, order);

                if (orderPaid.modifiedCount > 0 && order) {
                    const updatedUser = await User.findOneAndUpdate(
                        { email: order.userEmail },
                        { $inc: { jobPostPoints: order.points } },
                        { new: true }
                    );
                    if (updatedUser) {
                        return new Response(JSON.stringify({ message: 'Payment processed successfully' }), {
                            status: 200,
                            headers: { 'Content-Type': 'application/json' },
                        });
                    } else {
                        return new Response(JSON.stringify({ message: 'Error updating user points' }), {
                            status: 500,
                            headers: { 'Content-Type': 'application/json' },
                        });
                    }
                } else {
                    return new Response(JSON.stringify({ message: 'Order not found or already processed' }), {
                        status: 400,
                        headers: { 'Content-Type': 'application/json' },
                    });
                }
            } catch (dbError) {
                console.error('Database error:', dbError);
                return new Response(JSON.stringify({ message: 'Database error' }), {
                    status: 500,
                    headers: { 'Content-Type': 'application/json' },
                });
            }
        } else {
            return new Response(JSON.stringify({ message: 'Payment not completed' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }
    }

    // Return 200 for other event types
    return new Response(JSON.stringify({ message: 'Event received' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });


}


