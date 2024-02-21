import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'



function getUrlQuery(search) {
    const urlSearchParams = new URLSearchParams(search);
    const params = Object.fromEntries(urlSearchParams.entries());
    let newQuery = `?`;

    Object.entries(params).forEach((param) => {
        newQuery += `&${param[0]}=${param[1]}`
    })
    return newQuery
}


// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    const { nextUrl: { search } } = request;
    const pathName = request.nextUrl.pathname;
    // if (pathName.includes('/product-category/brands')) {
    //     let newUrl = pathName.replace('/product-category/brands', '/brand-product').split('/page/')[0];
    //     return NextResponse.redirect(new URL(newUrl + getUrlQuery(search), request.url))
    // }

    if (pathName.includes('/product-category') && !pathName.includes('brands')) {
        let newUrl = pathName.replace('/product-category', '/category').split('/page/')[0]
        return NextResponse.redirect(new URL(newUrl + getUrlQuery(search), request.url))
    }
}