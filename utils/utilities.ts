import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../config/firebase-config";

export const checkIfPriceDiscounted = ({ discountedPrice, price }) => {
    if (discountedPrice < price) {
        return true
    }
    return false
}

export const initialAddress = {
    address: "",
    city: "",
    lat: 0,
    lng: 0,
    name: "",
    phoneNo: "",
    pincode: "",
    state: "",
    stateCode: "",
    defaultAddress: true,
    country: "",
    ccode: "+971",
};

export const paymentMethods = [
    {
        name: "Cash on Delivery", value: "cash",
    },
    {
        name: "Pay Online", value: "stripe",
    },
];

export const tabs = ["Shipping", "Payment", "Confirmation"];


export function getCartItemsTotalIntakes(cart, type) {
    let total = 0
    switch (type) {
        case "Fat":
            if (cart && cart.length > 0) {

                cart.forEach(item => {
                    if (item?.intake && item?.intake?.fat) {

                        total += (parseFloat(item?.intake?.fat) * item?.quantity)
                    }
                });
            };
            break;
        case "Carbs":
            if (cart && cart.length > 0) {

                cart.forEach(item => {
                    if (item?.intake && item?.intake?.carbs) {
                        total += (parseFloat(item?.intake?.carbs) * item?.quantity)
                    }
                });
            };
            break;
        case "Protein":
            if (cart && cart.length > 0) {

                cart.forEach(item => {
                    if (item?.intake && item?.intake?.protein) {
                        total += (parseFloat(item?.intake?.protein) * item?.quantity)
                    }
                });
            };
            break;

        case "Calories":
            if (cart && cart.length > 0) {

                cart.forEach(item => {
                    if (item?.intake && item?.intake?.calorie) {
                        total += (parseFloat(item?.intake?.calorie) * item?.quantity)
                    }
                });
            };
            break;
        default:
            break;
    }

    return total;
}

export function checkIfItemExistInCart(cart, product, { variant = 0 }) {
    if (product?.isPriceList) {
        return cart?.filter((item) => item?.productId === product?.id && product?.priceList[variant]?.weight === item?.pack?.weight)
            .length !== 0;
    } else {
        return cart?.filter((item) => item?.productId === product?.id)
            .length !== 0;
    }
}
export function getProductFromCart(cart, product) {
    return cart?.filter((item) => item?.productId === product?.id)
        .length !== 0 ? cart?.filter((item) => item?.productId === product?.id)[0] : null;
}

export function getProductIndexFromCart(cart, product) {
    return cart.findIndex((item) => item?.productId === product?.id);
}


export function getMaxAndMinPriceForFilters(arr) {
    let min = Number.MAX_VALUE;


    let max = 0;




    arr.forEach(element => {
        if (element?.discountedPrice > max) {
            max = element?.discountedPrice
        }

        if (element.discountedPrice < min) {
            min = element?.discountedPrice
        }
    });

    let res = [Math.ceil(min), Math.ceil(max)];
    return res

}


export function getFilteredProducts({ filters, products }) {
    let newArr = products || []
    if (filters.price !== null && products && products?.length !== 0) {
        newArr = products.filter((e) => e?.discountedPrice >= filters.price[0] && e?.discountedPrice <= filters?.price[1])
    }

    return newArr
}

export function getStockInfo(product, variant) {
    let qty = 0;
    if (!product?.isPriceList) {
        qty = product?.productQty;
    } else {
        qty = product?.priceList[variant]?.totalQuantity
    }


    return qty;
}

export function getCountry(allCountries, currentCurrency) {
    return (allCountries && allCountries.filter((country) => country.currencyCode === currentCurrency)[0]) || "";
}

export function checkIfItemExistsInWishlist(userWishList, prodId) {

    return userWishList?.filter((item) => item?.id === prodId).length;
}


export const getDiscountedPercentage = ({ price, discountedPrice }: any) => {
    return `${Math.ceil(((price - discountedPrice) / price) * 100)}%`
};
// return (allCountries && allCountries.filter((country) => country.currencyCode === currentCurrency)[0]) || "";


export function getProductPriceDetails({ isDiscounted = false, product, currRate, index }) {
    if (product?.isPriceList) {
        if (isDiscounted) {
            return (product?.priceList[index]?.discountedPrice * currRate)?.toFixed(2)
        } else {
            return (product?.priceList[index]?.price * currRate)?.toFixed(2)
        }
    } else {
        if (isDiscounted) {
            return (product?.discountedPrice * currRate)?.toFixed(2)
        } else {
            return (product?.prodPrice * currRate)?.toFixed(2)
        }
    }
}

export function checkIfProductQuanityIsAvailable(product, index) {
    if (product?.isPriceList) {
        return parseInt(product?.priceList[index]?.totalQuantity) > 0

    } else {
        return parseInt(product?.productQty) > 0
    }
}


export function editHtml(html) {

    let check = html.split('\n').map((item, index) => {
        return (index === 0) ? item : ["<br/>", item]
    })

    let final = check.join('').split('\\n').map((item, index) => {
        return (index === 0) ? item : ["<br/>", item]
    })
    console.log({ final: final.join('') });

    return final.join('')
}

export function checkIfProductHasSection(product) {
    console.log("PRODUCT DATA", product);

    if (product?.sections && product?.sections?.sections && product?.sections?.sections?.length !== 0 && product?.sections?.sectionsData && product?.sections?.sectionsData?.length !== 0) return true
    return false
}
export function getProductFilteredSections(type, product) {
    let widgetId = product?.sections?.sections?.filter((val) => val?.widgetType === type && val?.sectionName !== "Free shipping").map((section: any) => section?.widgetID)

    let filteredSectionsData = product?.sections?.sectionsData?.filter((data) => widgetId.includes(data?.id));

    return filteredSectionsData
}
export function getProductFreeShippingImage(type, product) {
    let widgetId = product?.sections?.sections?.filter((val) => val?.widgetType === type && val?.sectionName === "Free shipping").map((section: any) => section?.widgetID)
    console.log("WIDGET", { widgetId });

    let filteredSectionsData = product?.sections?.sectionsData?.filter((data) => widgetId.includes(data?.id));

    console.log("WIDGET", { filteredSectionsData });

    return filteredSectionsData
}


export function calculateNutritionPercentage(type, value, calories) {

    //protein multiply by 4
    if (type === "Protein") {
        let productNutrientCalories = value * 4;
        return `${(productNutrientCalories / calories).toFixed(2)}`;
    }
    //carbs multiply by 4
    if (type === "Carbs") {
        let productNutrientCalories = value * 4;
        return `${(productNutrientCalories / calories).toFixed(2)}`;
    }
    //fat multiply by 4
    if (type === "Fat") {
        let productNutrientCalories = value * 9;
        return `${(productNutrientCalories / calories).toFixed(2)}`;
    }

    return `100`
}


export function makeLeastSignificantDigitZero(number) {
    // Find the remainder when dividing by 10
    let remainder = number % 10;

    // If the remainder is not 0, round up to the nearest multiple of 10
    if (remainder !== 0) {
        number = number + (10 - remainder);
    }

    return number;
}




export async function getActiveDocs(collectionName) {
    return new Promise(async (resolve, reject) => {
        const baseUrl = "https://www.medxpharmacy.com"
        try {
            let isUniversal = false;
            const envDoc = await getDoc(doc(db, "settings", "environment"));
            if (envDoc.data() && envDoc.data().hasOwnProperty("isUniversal")) {
                isUniversal = envDoc.data().isUniversal;
            }
            let docs = [];
            let docRef;

            if (collectionName == "services") {
                docRef = (await getDocs(collection(db, collectionName))).docs;
            }
            else if (collectionName === "articles") {
                const articleDocRef = await getDocs(
                    collection(db, collectionName)
                ).then((res) => res.docs);

                if (articleDocRef && articleDocRef.length !== 0) {
                    articleDocRef.forEach((doc) => {
                        docs.push({
                            url: `${baseUrl}/health-information-center/${doc.data()?.slug}`,
                        });
                    });
                }

            }
            else if (collectionName == "subcategories") {
                console.log("inside subcol");
                const catDocRef = await getDocs(
                    query(collection(db, "categories"), where("status", "==", true))
                ).then((val) => val.docs);
                let allCategories = [];

                catDocRef.forEach(async (doc) => {
                    allCategories.push({ id: doc.id, ...doc.data() });
                });
                for (const category of allCategories) {
                    if (category && category.id) {
                        if (category.isSubcategories) {
                            console.log(
                                "FETCHING",
                                `categories/${category?.id}/subcategories`
                            );
                            const subCategoriesDocsRef = await getDocs(
                                query(
                                    collection(db, `categories/${category?.id}/subcategories`),
                                    where("status", "==", true)
                                )
                            ).then((val) => val.docs);
                            subCategoriesDocsRef.forEach(async (doc) => {
                                if (isUniversal) {
                                    docs.push({
                                        url: `${baseUrl}/category/${category?.slug?.name
                                            }/${doc?.data()?.slug?.name}`,
                                    });
                                } else {
                                    docs.push({
                                        url: `${baseUrl}/category/${category?.slug?.name
                                            }/${doc?.data()?.slug?.name}`,
                                    });
                                }
                            });
                        }
                    }
                }
            } else if (collectionName == "subsubcategories") {
                const catDocRef = await getDocs(
                    query(collection(db, "categories"), where("status", "==", true))
                ).then((val) => val.docs);
                let allCategories = [];

                catDocRef.forEach(async (doc) => {
                    allCategories.push({ id: doc.id, ...doc.data() });
                });
                for (const category of allCategories) {
                    if (category && category.id) {
                        if (category.isSubcategories) {
                            const subCategoriesDocsRef = await getDocs(
                                query(
                                    collection(db, `categories/${category?.id}/subcategories`),
                                    where("status", "==", true)
                                )
                            ).then((val) => val.docs);
                            for (const subCategory of subCategoriesDocsRef) {
                                if (subCategory?.data()?.isSubcategories) {
                                    const subSubCategoriesDocsRef = await getDocs(
                                        query(
                                            collection(
                                                db,
                                                `categories/${category?.id}/subcategories/${subCategory.id}/subcategories`
                                            ),
                                            where("status", "==", true)
                                        )
                                    ).then((val) => val.docs);

                                    if (
                                        subSubCategoriesDocsRef &&
                                        subSubCategoriesDocsRef.length !== 0
                                    ) {
                                        subSubCategoriesDocsRef.forEach(async (doc) => {
                                            if (isUniversal) {
                                                docs.push({
                                                    url: `${baseUrl}/shop/category/${category?.slug?.name
                                                        }/${subCategory?.data()?.slug?.name}/${doc?.data()?.slug?.name
                                                        }`,
                                                });
                                            } else {
                                                docs.push({
                                                    url: `${baseUrl}/shop/category/${category?.slug?.name
                                                        }/${subCategory?.data()?.slug?.name}/${doc?.data()?.slug?.name
                                                        }`,
                                                });
                                            }
                                        });
                                    }
                                }
                            }
                        }
                    }
                }
            } else {
                docRef = await getDocs(
                    query(collection(db, collectionName), where("status", "==", true))
                ).then((res) => res.docs);
            }

            if (docRef && docRef.length !== 0) {
                docRef.forEach((doc) => {
                    if (doc && doc.id && doc.data()) {
                        docs.push({
                            url: `${baseUrl}/${collectionName === "products" ? "product" : collectionName === "brands" ? "brand-product" : "category"
                                }/${doc?.data()?.slug?.name}`,
                        });
                    }
                });
            }
            resolve(docs);
        } catch (error) {
            console.log("error", error);
            resolve([]);
        }
    });
}