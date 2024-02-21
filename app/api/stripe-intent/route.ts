import { NextResponse } from "next/server";
export const POST = async (req: Request) => {
    const stripe = require("stripe")(process.env.NEXT_PUBLIC_STRIPE_SECRET);
    const body: any = await req.json();

    const paymentIntent = await stripe.paymentIntents.create({
        currency: body?.currency,
        amount: body?.amount,
        automatic_payment_methods: {
            enabled: true,
        },
        // payment_method_types: ["card", "apple_pay"],
        description: `${body?.user?.name} (${body?.user?.phone})`,
        shipping: {
            name: body?.user?.name,
            address: {
                line1: body?.user?.address?.address,
                postal_code: body?.user?.address?.pincode,
                city: body?.user?.address?.city,
                state: body?.user?.address?.state,
                country: body?.user?.address?.country?.countryName,
            },
        },
    })


    let response = {
        clientSecret: paymentIntent.client_secret
    };


    // const response = await fetchHomeSections();
    console.log("Server Err0r = ", response);

    return NextResponse.json(response);
} 