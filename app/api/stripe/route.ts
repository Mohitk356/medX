import { Description } from "@headlessui/react/dist/components/description/description";
import { NextResponse } from "next/server";
import { RootOrder } from "../../../intercface/order";

export const POST = async (req: Request) => {
    const body: RootOrder = await req.json();


    try {
        const stripe = require("stripe")(process.env.NEXT_PUBLIC_STRIPE_SECRET);
        const newBillingAddress = {
            line1: body.address.address,
            line2: "",
            city: body.address.city,
            state: body.address.state,
            postal_code: body.address.pincode,
            country: body.address.country,
        };


        const customer = await stripe.customers.create({
            email: body.billingAddress.email || body.address.email,
            address: newBillingAddress,
            description: body.address.email,
            name: body.address.name,
            phone: `${body.address.ccode} ${body.address.phoneNo}`,
        });

        const products = body.products.map((e, i) => {
            return {
                price_data: {
                    currency: body.currency,
                    product_data: {
                        name: e.name,
                        images: [e.img.url],
                    },
                    unit_amount: Math.round(e.price) * 100,
                    tax_rates: ['shr_1OohtFSBHrmCwozizYtqcWMO']
                },
                quantity: e.quantity,
            }
        });


        const session = await stripe.checkout.sessions.create({
            customer: customer.id,
            line_items: products,
            mode: 'payment',

            success_url: `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/stripe/status/?orderId=${body.orderId}&mode=online&status=true`,
            cancel_url: `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/stripe/status/?orderId=${body.orderId}&mode=online&status=false`,
            billing_address_collection: 'auto',

            // billing_details: {
            //     address: defaultBillingAddress,
            // },
            metadata: {
                firebase_uid: body.metaData.orderBy.id,
            },
        });


        // return session.id
        return NextResponse.json({ ...session, status: true });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ status: false });
    }
}