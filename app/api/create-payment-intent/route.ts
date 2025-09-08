import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!); 

export async function POST(req: NextRequest) {
  try {
    const { amount, description } = await req.json();

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // amount in cents
      currency: 'usd',
      capture_method: 'manual', // Set to manual to capture on the backend later
      description: description || 'Listing Fee',
      payment_method_types: ['card'], // Only allow card payments
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret, paymentIntentId: paymentIntent.id });
  } catch (error: any) {
    console.error('Error creating Payment Intent:', error);
    return new NextResponse(`Error: ${error.message}`, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
