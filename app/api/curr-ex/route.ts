import axios, { AxiosError } from "axios";
import { NextResponse, NextRequest } from "next/server";
var currencyExchangeRate = require("currency-exchange-rate");
const converter = require("currency-exchanger-js");
export async function POST(req: Request) {
  try {
    const { to } = await req.json();
    let value;

    if (to === "AED") {
      value = 1;
    } else {
      value = await axios
        .get(
          `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/aed.json`
        )
        .then((res) => {
          return res.data?.aed[to.toLowerCase()];
        });
    }
    const response = NextResponse.json({
      status: true,
      exRate: value,
    });

    // response.cookies.set('uid', id, {
    //     maxAge: 60 * 60 * 24 * 7,
    // });
    return response;

    // cookies().set('uid', "")
  } catch (error) {
    console.log("ERROR", error.request.url, error.response);

    return NextResponse.json({ status: false });
  }
}
