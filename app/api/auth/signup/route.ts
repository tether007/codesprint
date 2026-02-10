import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { createToken, setAuthCookie } from '@/lib/auth';
import { signupSchema } from '@/lib/validators';

export async function POST(req: NextRequest) {

    try{
        const body = await req.json();

        //validating the input from util
        const validation = signupSchema.safeParse(body);

        if (!validation.success) {
        return NextResponse.json(
            { error: validation.error.message },
            { status: 400 }
        );
        }

        //get data from zod obj
        const {email, name ,password} = validation.data;

        const existUser = await prisma.user.findUnique({
            where: {email},
        });

        if(existUser){
            return NextResponse.json(
                { error: 'User exists with same mail id' },
                { status: 409 }
        );
            
        }


        //hash the password (10 rounds)
        const passwordHash = await bcrypt.hash(password, 10);


        // -------------DB querying ----------------

        const user = await prisma.user.create({
        data: {
            email,
            name,
            passwordHash,
        },
        select: {
            id: true,
            email: true,
            name: true,
            createdAt: true,
        },
        });
        
        //JWT
        const token = await createToken(user.id);
        setAuthCookie(token);


        return NextResponse.json({
        success: true,
        user,
        });
    }
    catch (error) 
    {
            console.error('Signup error:', error);
            return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
            );
    }

    
}