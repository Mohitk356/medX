import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const stripe = require("stripe")(process.env.NEXT_PUBLIC_STRIPE_SECRET);
  try {
    const body: any = await req.json();
    const paymentIntent = await stripe.paymentIntents.update(body.id, {
      description: `Pay Medx Pharmacy - OrderId: ${body.order_id}`,
      metadata: {
        order_id: body.order_id,
      },
    });
    console.log(paymentIntent, body);

    return NextResponse.json({ message: "ok" });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ error: error.toString() });
  }
};
