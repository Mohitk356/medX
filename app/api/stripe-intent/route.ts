import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const stripe = require("stripe")(process.env.NEXT_PUBLIC_STRIPE_SECRET);
  const body: any = await req.json();
  var paymentIntent;
  const customer = await stripe.customers.create({
    email: body.user.email || body.user.address.email,
  });

  paymentIntent = await stripe.paymentIntents.create({
    currency: body?.currency,
    amount: body?.amount,
    customer: customer.id,
    automatic_payment_methods: {
      enabled: true,
    },
    description: `Pay Medx Pharmacy - (${
      body?.user?.phone || body.user.address.ccode + body.user.address.phoneNo
    })`,
    shipping: {
      name: body?.user?.address.name,
      address: {
        line1: body?.user?.address?.address,
        postal_code: body?.user?.address?.pincode,
        city: body?.user?.address?.city,
        state: body?.user?.address?.state,
        country: body?.user?.address?.country?.countryName,
      },
    },
  });
  let response = {
    clientSecret: paymentIntent.client_secret,
  };

  return NextResponse.json(response);
};
