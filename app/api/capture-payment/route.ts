import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!); 

export async function POST(req: NextRequest) {
  try {
    const { paymentIntentId } = await req.json();

    if (!paymentIntentId) {
      return new NextResponse('Error: Payment Intent ID is required.', { status: 400 });
    }

    const paymentIntent = await stripe.paymentIntents.capture(paymentIntentId);

    return NextResponse.json({ paymentIntentStatus: paymentIntent.status });
  } catch (error: any) {
    console.error('Error capturing Payment Intent:', error);
    return new NextResponse(`Error: ${error.message}`, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
