import { NextResponse } from "next/server";
import { getCountryByName } from "../../../utils/constants";

export const POST = async (req: Request) => {
  const stripe = require("stripe")(process.env.NEXT_PUBLIC_STRIPE_SECRET);
  const body: any = await req.json();
  console.log(body);

  const countryName = getCountryByName(body?.user?.address?.country)
  var paymentIntent;
  const customer = await stripe.customers.create({
    email: body.user.email || body.user.address.email,
    name: body?.user?.address.name,
    address: {
      line1: body?.user?.address?.address,
      postal_code: body?.user?.address?.pincode,
      city: body?.user?.address?.city,
      state: body?.user?.address?.state,
      country: countryName.icon,
    },

  });

  paymentIntent = await stripe.paymentIntents.create({
    currency: body?.currency,
    amount: body?.amount,
    customer: customer.id,
    automatic_payment_methods: {
      enabled: true,
    },
    description: `Pay Medx Pharmacy - Pending..`,
    shipping: {
      name: body?.user?.address.name,
      address: {
        line1: body?.user?.address?.address,
        postal_code: body?.user?.address?.pincode,
        city: body?.user?.address?.city,
        state: body?.user?.address?.state,
        country: countryName.icon,
      },
    },
  });
  let response = {
    clientSecret: paymentIntent.client_secret,
    id: paymentIntent.id,
  };

  return NextResponse.json(response);
};
