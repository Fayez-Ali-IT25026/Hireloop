import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

import { stripe } from '../../../lib/stripe'
import { getSession } from '@/lib/core/server'

export async function POST() {


  const userSession = await getSession()

  // CHANGE: stop signed-out visitors before calling Stripe.
  // WHY: metadata values must be strings, so passing null made Stripe reject the
  // request with a confusing 500.
  if (!userSession?.user) {
    return NextResponse.json(
      { error: 'You must be signed in to start a payment.' },
      { status: 401 }
    )
  }

  try {
    const headersList = await headers()
    const origin = headersList.get('origin')

    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          // Provide the exact Price ID (for example, price_1234) of the product you want to sell
          price: 'price_1UcQ9f6izthQ7Voddso37oZs',
          quantity: 1,
        },
      ],
      mode: 'payment',
       customer_email: userSession.user.email,
        metadata: {
        // CHANGE: no "?? null" here — the guard above guarantees a user.
        userId: userSession.user.id,
      },
      success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      // Provide a name (for example, hosted_web_0001) to label this Checkout integration and measure its conversion independently
      integration_identifier: 'hire_loop_web_001',
    });
    return NextResponse.redirect(session.url as string, 303)
  } catch (err) {


     const error = err instanceof Error ? err : new Error(String(err))


    return NextResponse.json(
      { error: error.message },
      { status:500 }
    )
  }
}