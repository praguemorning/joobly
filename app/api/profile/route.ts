import { User } from '@/models/User';
import generateRandomString from "@/lib/utils/generateRandomString";
import { hash } from "bcryptjs";
import { authOptions } from '@/lib/authOptions';
import { getServerSession } from 'next-auth';
import dbConnect from "@/database/dbConnect";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { email } = body;

    if (email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        // User exist
        return Response.json(existingUser);
      }

      // User not exist
      const { name, image } = body;
      const generatedPassword = generateRandomString(32);
      const hashedPassword = await hash(generatedPassword, 12);

      const newUser = await User.create({ name, email, password: hashedPassword, image });
      return Response.json(newUser);
    } else {
      return Response.json({ error: 'Email is required' }, { status: 400 });
    }

  } catch (error) {
    console.log('Error', error);
  }
}


export async function GET() {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;
    if (!email) {
      return Response.json({});
    }
    return Response.json(await User.findOne({ email }));
  } catch (error) {
    console.error("Error fetching profile:", error);
    return Response.json({});
  }
}