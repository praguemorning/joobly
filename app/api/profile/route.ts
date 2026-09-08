import { User } from '@/models/User';
import generateRandomString from "@/lib/utils/generateRandomString";
import { hash } from "bcryptjs";
import dbConnect from "@/database/dbConnect";
import { getSessionUser } from "@/lib/auth/session";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { email } = body;

    if (email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return Response.json(existingUser);
      }

      const { name, image } = body;
      const generatedPassword = generateRandomString(32);
      const hashedPassword = await hash(generatedPassword, 12);

      const newUser = await User.create({ name, email, password: hashedPassword, image });
      return Response.json(newUser);
    }

    return Response.json({ error: 'Email is required' }, { status: 400 });
  } catch (error) {
    console.log('Error', error);
    return Response.json({ error: 'Failed to create user' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return Response.json({});
    }
    return Response.json(user);
  } catch (error) {
    console.error("Error fetching profile:", error);
    return Response.json({});
  }
}
