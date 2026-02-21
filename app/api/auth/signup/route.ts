import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { createToken } from '@/lib/auth';
import { signupSchema } from '@/lib/validators';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = signupSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.message },
        { status: 400 }
      );
    }

    const { email, name, password, team } = validation.data;

    // Normalize team to uppercase
    const normalizedTeam = team.trim().toUpperCase();

    // Check existing email
    const existUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existUser) {
      return NextResponse.json(
        { error: 'User exists with same mail id' },
        { status: 409 }
      );
    }

    // Check existing team
    const existTeam = await prisma.user.findUnique({
      where: { team: normalizedTeam },
    });

    if (existTeam) {
      return NextResponse.json(
        { error: 'Team name already registered' },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        team: normalizedTeam,
        passwordHash,
      },
      select: {
        id: true,
        email: true,
        name: true,
        team: true,
        createdAt: true,
      },
    });

    const token = await createToken(user.id);

    const response = NextResponse.json({
      success: true,
      user,
    });

    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}