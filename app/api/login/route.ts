import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('uid') || ""
        const response = NextResponse.json({
            status: true,

        });
        console.log("COOKIES SET", id);

        response.cookies.set('uid', id, {
            maxAge: 60 * 60 * 24 * 7,
        });
        return response;



        // cookies().set('uid', "")
    } catch (error) {
        console.log("ERROR IN SETTING COOKIE", error);

        return NextResponse.json({ status: false })
    }
}