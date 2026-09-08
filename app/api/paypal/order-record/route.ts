import { PointsOrder } from "@/models/PointsOrder";
import { User } from "@/models/User";
import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import dbConnect from "@/database/dbConnect";

export async function POST(req: Request) {
  await dbConnect();
  const { title, price, points } = await req.json();

  const user = await getSessionUser();
  const userEmail = user?.email;

  if (!userEmail) {
    return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
  }

  try {
    await PointsOrder.create({
      userEmail,
      title,
      price,
      points,
      paymentType: "paypal",
      paid: true,
    });

    const updatedUser = await User.findOneAndUpdate(
      { email: userEmail },
      { $inc: { jobPostPoints: points } },
      { new: true }
    );

    if (updatedUser) {
      return NextResponse.json({ message: "Your points has been added!" });
    }
    return NextResponse.json({ message: "Some thing went wrong!" });
  } catch (error) {
    console.error("Error processing order:", error);
    return NextResponse.json(
      { error: "Failed to save order and update points" },
      { status: 500 }
    );
  }
}
