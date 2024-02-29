import { doc, getDoc, updateDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server"
import { db } from "../../../../../config/firebase-config";


export const GET = async (req: NextRequest, { params }) => {
    const stripe = require("stripe")(process.env.NEXT_PUBLIC_STRIPE_SECRET);
    const payment_intent = req.nextUrl.searchParams.get("payment_intent");

    const data = await getDoc(doc(db, "orders", params.id));
    const order = data.data();
    // update Payment Status 
    const res = await updateDoc(doc(db, "orders", params.id), {
        "payment.status": "failed",
        "status": "Rejected",
        "payment.completed": false,
        "payment.details": {
            id: params.id,
            paymentIntent: payment_intent,
            message: "Payment Failed"
        },
    });
    console.log(order, res);

    try {
        const paymentIntent = await stripe.paymentIntents.update(payment_intent, {
            description: `Medx Pharmacy - Payment Failed - OrderId: ${order.orderId}`,
        });
        await stripe.paymentIntents.cancel(payment_intent);
        return NextResponse.redirect(process.env.NEXT_PUBLIC_API_DOMAIN + `/payment-failed`);
    } catch (error) {
        return NextResponse.redirect(process.env.NEXT_PUBLIC_API_DOMAIN + `/payment-failed`);
    }
}