import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        console.log("logout");

        const response = NextResponse.json({
            status: true
        });
        response.cookies.delete('uid')
        return response;

        // cookies().set('uid', "")
    } catch (error) {
        return NextResponse.json({ status: false, })
    }
}