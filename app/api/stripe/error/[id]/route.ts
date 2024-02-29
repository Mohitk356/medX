import { doc, getDoc, updateDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server"
import { db } from "../../../../../config/firebase-config";


export const GET = async (req: NextRequest, { params }) => {
    const payment_intent = req.nextUrl.searchParams.get("payment_intent");

    const data = await getDoc(doc(db, "orders", params.id));
    const order = data.data();

    const stripe = require("stripe")(process.env.NEXT_PUBLIC_STRIPE_SECRET);
    try {
        const paymentIntent = await stripe.paymentIntents.update(payment_intent, {
            description: `Medx Pharmacy - Payment Field - OrderId: ${order.orderId}`,
        });

        return NextResponse.redirect(process.env.NEXT_PUBLIC_API_DOMAIN + `/payment-failed`);
    } catch (error) {
        return NextResponse.redirect(process.env.NEXT_PUBLIC_API_DOMAIN + `/payment-failed`);
    }

}