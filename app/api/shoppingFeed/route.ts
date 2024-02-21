import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../config/firebase-config";

export async function GET() {

    async function getProducts() {
        return await getDocs(
            query(collection(db, 'products'), where("status", "==", true))
        ).then((res) => {
            let arr = []
            if (res.docs.length !== 0) {
                for (const doc of res.docs) {
                    arr.push({ ...doc.data(), id: doc.id })
                }
            }
            return arr;
        });
    }

    function removeHtmlTags(inputString) {
        return inputString.replace(/(<([^>]+)>)/gi, '');
    }


    const products: any = await getProducts();

    const xmlContent = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
    <channel>
    <title>Medx Pharmacy</title>
<link>http://www.medxpharmacy.com</link>
<description>Free &amp; Fast Delivery. We deliver within 48 hours! 1000 + Brands. Premium &amp; Quality Assured Products</description>

${products && products?.map((prod) => {
        let removedDesc = removeHtmlTags(prod?.prodDesc).replaceAll('\n', '').replaceAll('\nn', "")
        return ` 
    <item>
    <g:id>${prod?.productCode || ""}</g:id>
    <g:title>${prod?.prodName?.replaceAll("&", " &amp; ") || ""}</g:title>
    <g:description>Discover Wellness with Medx Pharmacy! Shop top-quality global brands and save with every order through our cashback rewards. Your journey to fitness and wellness, now delivered right to your doorstep. Grab your deals today and enhance your healthy lifestyle!</g:description>
    <g:link>https://www.medxpharmacy.com/product/${prod?.slug?.name?.replaceAll("&", " &amp; ")}</g:link>
    <g:image_link>${prod?.coverPic?.url?.replaceAll("&", "&amp;")}</g:image_link>
    <g:price>${prod?.isPriceList ? prod?.priceList[0]?.discountedPrice : prod?.discountedPrice} AED</g:price>
    <g:availability>${prod?.isPriceList ? prod?.priceList[0]?.totalQuantity !== "0" ? "in_stock" : "out_of_stock" : prod?.productQty !== "0" ? "in_stock" : "out_of_stock"}</g:availability>
    </item>`
    }).join('')}
    </channel>
    </rss>`;

    return new Response(xmlContent, { headers: { "Content-Type": "text/xml" } });
    // return new Response(xmlContent, { headers: { "Content-Type": "text/xml" } });
}



// <g:brand>${prod?.vendorName?.replaceAll("&", " &amp; ")}</g:brand>
