import { doc, getDoc } from "firebase/firestore";
import { encodeURL } from "../parseUrl";
import { auth, db } from "../../config/firebase-config";

function bannerLink(bannerData: any) {
    if (bannerData.hasOwnProperty('link')) {
        const userId = auth.currentUser?.uid;
        const linkType = bannerData.link.type;
        const id = 'ids' in bannerData.link ? bannerData.link.ids : (typeof bannerData.link.id === 'string' ? [bannerData.link.id] : bannerData.link.id);
        const name = bannerData.link.name || '';
        const idLength = id.length;

        if (linkType?.toLowerCase() === "product") {
            if (idLength > 1) {
                const queryString = `?type=${linkType}&ids=` + encodeURIComponent(JSON.stringify(id));

                return `/taggedItems${queryString}`
            } else {
                return `/product/${bannerData?.link?.slug}`
            }
        }

        if (linkType?.toLowerCase() === "category") {
            if (idLength > 1) {
                const queryString = `?type=${linkType}&ids=` + encodeURIComponent(JSON.stringify(id));

                return `/taggedItems${queryString}`
            } else {
                return `/shop/category/${bannerData?.link?.slug}`
            }
        }

        if (linkType?.toLowerCase() === "subcategory") {
            if (idLength > 1) {
                const queryString = `?type=${linkType}&ids=` + encodeURIComponent(JSON.stringify(id));

                return `/taggedItems${queryString}`
            } else {
                return `/shop/category/${bannerData?.link?.categorySlug}/${bannerData?.link?.slug}`
            }
        }
        if (linkType?.toLowerCase() === "brand") {
            if (idLength > 1) {
                const queryString = `?type=${linkType}&ids=` + encodeURIComponent(JSON.stringify(id));

                return `/taggedItems${queryString}`
            } else {
                return `/product-category/brands/${bannerData?.link?.slug}`
            }
        }

        return "undefined"
    }
    return "undefined"
}


async function fetchTaggedItems({ type, ids }) {
    let arr = [];
    let collection = "";
    if (type === 'Product') {
        collection = 'products';
    }
    if (type === 'Category') {
        collection = 'categories';
    }
    if (type?.toLowerCase() === "brand") {
        collection = "brands"
    }

    if (ids && ids.length !== 0) {
        for (const id of ids) {
            let docData = await getDoc(doc(db, `${collection}`, id)).then(val => {
                let data = val.data();
                return { ...data, id: val.id }
            })
            arr.push(docData)
        }
    }

    if (arr && arr.length > 0) {
        return JSON.parse(JSON.stringify(arr));
    }

    return null;

}

export { bannerLink, fetchTaggedItems }