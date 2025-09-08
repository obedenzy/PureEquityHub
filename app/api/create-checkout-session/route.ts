import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { amount, description } = await req.json();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: description || 'Listing Fee',
            },
            unit_amount: amount * 100, // Amount in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `https://3000-firebase-pureequityhub-1756184621136.cluster-aww2nevvpncqwrdjf3yxmum6me.cloudworkstations.dev/create-listing?payment=success`,
      cancel_url: `https://3000-firebase-pureequityhub-1756184621136.cluster-aww2nevvpncqwrdjf3yxmum6me.cloudworkstations.dev/create-listing?payment=cancelled`,
    });

    return NextResponse.json({ id: session.id });
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return new NextResponse(`Error: ${error.message}`, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';