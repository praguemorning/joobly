import { PointsOrder } from "@/models/PointsOrder";
import { getSessionUser } from "@/lib/auth/session";
import dbConnect from "@/database/dbConnect";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

function siteBaseUrl(): string {
  const base =
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.NEXTAUTH_URL ||
    "https://praguemorning.cz/jobs";
  return base.replace(/\/$/, "");
}

export async function POST(req: Request) {
  await dbConnect();

  const { title, price, points } = await req.json();
  const user = await getSessionUser();
  const userEmail = user?.email || undefined;

  const orderDoc = await PointsOrder.create({
    userEmail,
    title,
    price,
    points,
    paymentType: "stripe",
    paid: false,
  });

  const stripeLineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
    {
      quantity: 1,
      price_data: {
        currency: "CZK",
        product_data: { name: title },
        unit_amount: price * 100,
      },
    },
  ];

  try {
    const base = siteBaseUrl();
    const stripeSession = await stripe.checkout.sessions.create({
      line_items: stripeLineItems,
      mode: "payment",
      customer_email: userEmail,
      success_url: `${base}/success`,
      cancel_url: `${base}/error`,
      metadata: { orderId: orderDoc._id.toString() },
    });

    return NextResponse.json({ url: stripeSession.url });
  } catch (error: unknown) {
    return NextResponse.json(
      { error, message: "Could not create checkout session" },
      { status: 500 }
    );
  }
}
