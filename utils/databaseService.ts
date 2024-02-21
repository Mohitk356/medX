import axios from "axios";
import { getCookie } from "cookies-next";
import {
    QuerySnapshot,
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    limit,
    orderBy,
    query,
    setDoc,
    updateDoc,
    where,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { auth, db, storage } from "../config/firebase-config";
import { fetchBrandProductsForShopPage, fetchProductsForShopPage } from "../config/typesense";
import { getMaxAndMinPriceForFilters } from "./utilities";

export const fetchFarmGallery = async () => {
    const docRef = doc(db, "settings", "gallery");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return { status: true, res: { ...docSnap.data(), id: docSnap.id } };
    } else {
        // docSnap.data() will be undefined in this case
        return { status: false };
    }
};

export const fetchCategories = async () => {
    const res = await fetch(process.env.NEXT_PUBLIC_API_DOMAIN + '/api/categories',
        // { next: { revalidate: 60 * 60 * 24 * 7 } }
        { cache: 'no-store', method: "POST" }

        // { cache: '' }
    );
    const data = await res.json();
    return JSON.parse(JSON.stringify(data));
};

export const checkUserLogin = (cookie: any) => {
    const uid = auth.currentUser?.uid;
    if (uid) {
        return true;
    }

    if (cookie?.value) {
        return true;
    }

    return false;
    // if (uid && cookie?.value) {
    //   return true;
    // } else {
    //   return false;
    // }
};

export async function getUserTransactions(uid) {
    if (uid) {
        const res = await getDocs(query(collection(db, `users/${uid}/walletTransactions`), orderBy('createdAt', 'desc'))).then((docs) => {
            if (docs.docs.length === 0) {
                return []
            }

            let arr = [];

            for (const doc of docs.docs) {
                arr.push({ ...doc.data(), id: doc.id })
            }

            return arr;
        })

        return res;
    }
    return [];
}

export const getUserData = async (cookieData: any) => {

    let cookie;
    if (cookieData) {
        cookie = cookieData;
    } else {
        cookie = { value: getCookie('uid') }
    }


    let uid;
    if (auth.currentUser?.uid) {
        uid = auth.currentUser?.uid;
    }
    if (cookie?.value) {
        uid = cookie?.value;
    }

    if (uid) {
        const docRef = doc(db, "users", uid);
        try {

            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return JSON.parse(JSON.stringify({ ...docSnap.data(), id: docSnap.id }));
            } else {
                return null;
            }
        } catch (error) {
            console.log(error);
            return null

        }
    } else {
        return null;
    }
};

export const getUserAddresses = async (cookieData) => {
    let cookie;

    if (cookieData) {
        cookie = cookieData;
    } else {
        cookie = { value: getCookie('uid') }
    }
    let uid;
    if (auth.currentUser?.uid) {
        uid = auth.currentUser?.uid;
    }
    if (cookie?.value) {
        uid = cookie?.value;
    }

    if (uid) {
        try {
            console.log("STARTED");

            const addresses = await getDocs(query(collection(db, `users/${uid}/addresses`), orderBy('createdAt', 'desc'))).then((res: QuerySnapshot) => {
                if (res.docs.length === 0) {
                    return [];
                }
                let arr = [];
                for (const address of res.docs) {
                    const data = address.data();
                    arr.push({ ...data, id: address.id })
                }
                return arr;
            }).catch((e) => {
                console.log("STARTED", { e });

            })
            return addresses;
        } catch (error) {
            console.log("STARTED", error);

        }
    } else {
        return [];
    }
}



export const handleContactUsSubmit = async (data: any) => {
    const docRef = await addDoc(collection(db, "enquiries"), data);
    if (docRef.id) {
        return true;
    }
    return false;
};
export const handleLeadSubmit = async (data: any) => {
    const docRef = await addDoc(collection(db, "leads"), data);
    if (docRef.id) {
        return true;
    }
    return false;
};
export const handleBuyNowRequestSubmit = async (data: any) => {
    const docRef = await addDoc(collection(db, "buyNowRequest"), data);
    if (docRef.id) {
        return true;
    }
    return false;
};


export const fetchHomeSections = async () => {

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/api/home-page`,
        //  { next: { revalidate: 60 * 60 * 24 } }

        { cache: 'no-store', method: "POST" }
    );
    const data = await res.json();

    return data;
}


export const fetchMuscleShowPage = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/api/muscle-show-2023`,
        //  { next: { revalidate: 60 * 60 * 24 } }

        { cache: 'no-store', method: "POST" }
    );
    const data = await res.json();

    return data;
}

export async function fetchSinglePost({ postdetails }) {
    console.log(decodeURIComponent(postdetails));

    let res = await getDocs(
        query(collection(db, "articles"), where("slug", "==", decodeURIComponent(postdetails)))
    ).then((val) => {
        if (val.docs.length === 0) return null;
        let pos = val.docs[0].data();
        return pos;
    });
    return JSON.parse(JSON.stringify(res));
}


export async function getWalletInfo() {
    return (await getDoc(doc(db, "settings", 'wallet'))).data();
}
export async function getReferralInfo() {
    return (await getDoc(doc(db, "settings", 'referral'))).data();
}

async function fetchBannerSliders(section) {
    return new Promise(async (resolve) => {

        const querySnapshot = query(collection(db, `widgets/${section?.widgetID}/slides`), where('active', '==', true));
        const res = await getDocs(querySnapshot);
        if (res.docs) {
            let arr = [];
            for (const slid of res.docs) {
                arr.push({ ...slid?.data(), id: slid?.id })
            }

            resolve({ status: true, arr, id: section?.widgetID });
        }
        return resolve({
            status: false
        });
    })
}



async function fetchImageBanner(section) {
    return new Promise(async (resolve) => {

        const querySnapshot = query(collection(db, `widgets/${section?.widgetID}/webSlides`), where('active', '==', true), orderBy('createdAt', 'desc'));
        const res = await getDocs(querySnapshot);
        if (res.docs) {
            let arr = [];
            for (const slid of res.docs) {
                arr.push({ ...slid?.data(), id: slid?.id })
            }

            resolve({ status: true, arr, id: section?.widgetID });
        }
        return resolve({
            status: false
        });
    })
}

async function fetchProductCarousel(section) {
    return new Promise(async (resolve) => {

        const querySnapshot = query(collection(db, `widgets/${section?.widgetID}/products`), where('data.status', '==', true), orderBy('sortedAt', 'desc'));
        const res = await getDocs(querySnapshot);
        if (res.docs) {
            let arr = [];
            for (const product of res.docs) {
                arr.push({ ...product?.data(), id: product?.id })
            }
            resolve({ status: true, arr, id: section?.widgetID });
        }
        return resolve({
            status: false
        });
    })
}

async function fetchCategoriesWidget(section) {
    return new Promise(async (resolve) => {

        const docRef = doc(db, "widgets", section?.widgetID);
        const docSnap = (await getDoc(docRef)).data();
        if (docSnap) {
            let categoryIdList = docSnap?.categoryList;

            if (categoryIdList) {
                let arr = [];

                for (const category of categoryIdList) {
                    const categoryData = await getDoc(doc(db, 'categories', category)).then(val => {
                        return { ...val.data(), id: val.id }
                    })
                    arr.push(categoryData);
                }
                resolve({ status: true, arr, id: section?.widgetID });
            }
            return {
                status: false
            };
        }
        return resolve({
            status: false
        });
    })
}

async function fetchVendors(section) {
    return new Promise(async (resolve) => {

        const docRef = doc(db, "widgets", section?.widgetID);
        const docSnap = (await getDoc(docRef)).data();
        if (docSnap) {
            let vendorsIdList = docSnap?.vendorsList;

            if (vendorsIdList) {
                let arr = [];

                for (const vendor of vendorsIdList) {
                    const vendorData = await getDoc(doc(db, `features/multiVendor/vendors`, vendor)).then(val => {
                        return { ...val.data(), id: val.id }
                    })
                    arr.push(vendorData);
                }
                resolve({ status: true, arr, id: section?.widgetID });
            }
            return {
                status: false
            };
        }
        return resolve({
            status: false
        });

    })
}

async function fetchTextBlock(section) {
    return new Promise(async (resolve) => {

        const docRef = doc(db, "widgets", section?.widgetID);
        const docSnap = (await getDoc(docRef)).data();
        if (docSnap) {
            resolve({ status: true, docSnap, id: section?.widgetID });
        }
        return resolve({
            status: false
        });
    })
}

async function fetchProductList(section) {
    return new Promise(async (resolve) => {

        const querySnapshot = query(collection(db, `widgets/${section?.widgetID}/products`), where('data.status', '==', true), orderBy('sortedAt', 'desc'));
        const res = await getDocs(querySnapshot);
        if (res.docs) {
            let arr = [];
            for (const product of res.docs) {
                arr.push({ ...product?.data(), id: product?.id })
            }
            resolve({ status: true, arr, id: section?.widgetID });
        }
        return resolve({
            status: false
        });
    })
}

async function fetchImageBlock(section) {
    return new Promise(async (resolve) => {

        const docRef = doc(db, "widgets", section?.widgetID);
        const docSnap = (await getDoc(docRef)).data();
        if (docSnap) {
            resolve({ status: true, docSnap, id: section?.widgetID });
        }
        return resolve({
            status: false
        });
    })
}

async function fetchVideoBlock(section) {
    return new Promise(async (resolve) => {

        const docRef = doc(db, "widgets", section?.widgetID);
        const docSnap = (await getDoc(docRef)).data();
        if (docSnap) {
            resolve({ status: true, docSnap, id: section?.widgetID });
        }
        return resolve({
            status: false
        });
    })
}

export const fetchSubCategories = async ({ slug, subCategorySlug = null }) => {

    const catId = await getDocs(query(collection(db, "categories"), where('slug.name', '==', slug))).then((val: QuerySnapshot) => {
        if (val.docs.length != 0) {
            return val.docs[0].id;
        } else {
            return "";
        }
    })




    let subCatId;


    if (subCategorySlug === null) {
        if (catId) {
            const subCats = await getDocs(query(collection(db, `categories/${catId}/subcategories`), where('status', '==', true), orderBy('sortedAt', 'desc'))).then((val) => {
                if (val.docs.length === 0) {
                    return [];
                }

                let arr = [];

                for (const subCat of val.docs) {

                    arr.push({ ...subCat.data(), id: subCat.id })
                }
                return arr;
            })
            return JSON.parse(JSON.stringify(subCats));
        }
    } else {
        if (catId) {

            subCatId = await getDocs(query(collection(db, `categories/${catId}/subcategories`), where('slug.name', '==', subCategorySlug))).then((val: QuerySnapshot) => {
                if (val.docs.length != 0) {
                    return val.docs[0].id;
                } else {
                    return "";
                }
            })


            if (subCatId) {
                const subSubCats = await getDocs(query(collection(db, `categories/${catId}/subcategories/${subCatId}/subcategories`), where('status', '==', true), orderBy('sortedAt', 'desc'))).then((val) => {
                    if (val.docs.length === 0) {
                        return [];
                    }

                    let arr = [];

                    for (const subCat of val.docs) {
                        arr.push({ ...subCat.data(), id: subCat.id })
                    }
                    return arr;
                })
                return JSON.parse(JSON.stringify(subSubCats));
            }
        }
    }
    return [];
}


export const fetchCategoryProducts = async ({ slug, subCatSlug = null, subSubCatSlug = null, filters = null }) => {
    // console.log("INSIDE CHECK ", filters);

    console.log("STARTED PRODUCTS", slug, subCatSlug, subSubCatSlug);

    let categoryId;
    let subCategoryId;
    let subSubCategoryId;

    let catId = await getDocs(query(collection(db, "categories"), where('slug.name', '==', slug))).then((val: QuerySnapshot) => {
        if (val.docs.length != 0) {
            return val.docs[0].id;
        } else {
            return "";
        }
    })
    categoryId = catId;
    let subCatId = null;

    console.log("CATID ", catId);



    if (subCatSlug) {

        subCatId = await getDocs(query(collection(db, `categories/${catId}/subcategories`), where('slug.name', '==', subCatSlug))).then((val: QuerySnapshot) => {
            if (val.docs.length != 0) {
                return val.docs[0].id;
            } else {
                return "";
            }
        })
        catId = subCatId;
        subCategoryId = subCatId
    }



    let subsubcatId = null;

    if (subSubCatSlug) {
        if (subCatId) {
            subsubcatId = await getDocs(query(collection(db, `categories/${categoryId}/subcategories/${subCategoryId}/subcategories`), where('slug.name', '==', subSubCatSlug))).then((val: QuerySnapshot) => {
                if (val.docs.length != 0) {
                    return val.docs[0].id;
                } else {
                    return "";
                }
            })

            catId = subsubcatId;
            subSubCategoryId = subsubcatId
        }
    }




    if (catId) {
        console.log("CAT ID", catId);

        const products = await fetchProductsForShopPage({ catId, filters: filters })
        if (!products || products.length === 0) {
            if (subSubCatSlug) {
                return await fetchCategoryProducts({ slug: slug, subCatSlug: subCatSlug, subSubCatSlug: null })
            }
            if (subCatId && !subSubCatSlug) {
                return await fetchCategoryProducts({ slug: slug, subCatSlug: null, subSubCatSlug: null })
            }
        }

        let minMax = null;

        if (products.length !== 0) {
            minMax = getMaxAndMinPriceForFilters(products);
        }

        return JSON.parse(JSON.stringify({ products, minMax }));
    }

    return [];
}

export const getBrandData = async ({ slug }) => {
    let brandId = await getDocs(query(collection(db, "brands"), where('slug.name', '==', slug))).then((val: QuerySnapshot) => {
        console.log("DOCS LENGTH:", val.docs.length, slug);

        if (val.docs.length != 0) {
            return val.docs[0].id;
        } else {
            return "";
        }
    })

    if (brandId) {

        return (await getDoc(doc(db, "brands", brandId))).data()
    } else {
        return null
    }
}

export const fetchBrandProducts = async ({ slug }) => {
    let brandId = await getDocs(query(collection(db, "brands"), where('slug.name', '==', slug))).then((val: QuerySnapshot) => {
        console.log("DOCS LENGTH:", val.docs.length, slug);

        if (val.docs.length != 0) {
            return val.docs[0].id;
        } else {
            return "";
        }
    })

    if (brandId) {
        const products = await fetchBrandProductsForShopPage({ brandId, filters: null })

        let minMax = null;

        if (products.length !== 0) {
            minMax = getMaxAndMinPriceForFilters(products);
        }

        return JSON.parse(JSON.stringify({ products, minMax }));
    }
}



export const fetchSingleProduct = async (slug) => {

    const product = await getDocs(query(collection(db, "products"), where('slug.name', '==', slug))).then(async (val: QuerySnapshot) => {
        if (val.docs.length != 0) {
            return { ...val?.docs[0].data(), id: val.docs[0].id };


        } else {
            return null;
        }
    })

    return JSON.parse(JSON.stringify(product));
}


export const additionalProductData = async (product) => {


    let brandProductsData = [];

    if (product?.brands && product?.brands?.length !== 0) {
        let brandId = product?.brands[0];
        await getDocs(query(collection(db, "products"), where('brands', 'array-contains', brandId), where('status', '==', true), limit(50))).then((brandProducts) => {
            if (brandProducts?.docs.length === 0) return [];

            for (const prod of brandProducts.docs) {
                brandProductsData.push({ ...prod.data(), id: prod?.id })
            }
        })
    }



    const sections = (await getDoc(doc(db, `products/${product?.id}/sections`, 'productWidgets'))).data();

    let promiseArr = [];

    if (sections && sections?.sections && sections?.sections?.length > 0) {
        for (const section of sections?.sections) {
            if (section?.location === "all" || section?.location === "web") {
                switch (section?.widgetType) {
                    case "image-banner":
                        if (section?.widgetID) {
                            promiseArr.push(fetchImageBanner(section))
                        }
                        break;
                    case "product-carousel":
                        if (section?.widgetID) {

                            promiseArr.push(fetchProductCarousel(section))
                        }
                        // fetchProductCarousel(section, regionId);
                        break;
                    case "video-block":
                        if (section?.widgetID) {

                            promiseArr.push(fetchVideoBlock(section))
                        }
                        break;

                    default:
                }
            }
        }
    }

    if (promiseArr.length !== 0) {
        const res = await Promise.allSettled(promiseArr).then((values: any) => {
            let arr = [];
            values.forEach(val => {
                arr.push(val?.value);
            })
            return arr;



        })
        return {
            brandProducts: brandProductsData, sections: {
                sections: sections?.sections,
                sectionsData: res
            }
        };
    } else {
        return { brandProducts: brandProductsData };
    }


}


export const fetchSectionData = async (secId) => {
    return (await getDoc(doc(db, 'widgets', secId))).data();
}


export const addCartObjToUser = async (cartObj) => {
    return await addDoc(collection(db, `users/${auth.currentUser?.uid}/cart`), cartObj).then(val => {
        return val.id
    });
}
export const removeCartObjFromUser = async (docId) => {
    console.log("removed,", docId);

    return await deleteDoc(doc(db, `users/${auth.currentUser?.uid}/cart`, docId))

}

export const fetchStates = async () => {
    return await getDoc(doc(db, 'settings', 'states')).then((val) => {
        const data = val.data();
        return data?.codes;
    })
}


export const addressFromPinCode = async (pincode) => {
    try {
        const res = await axios.get(`http://www.postalpincode.in/api/pincode/${pincode}`)
        const data = res.data;
        if (data) {
            return data;
        } else {
            return null;
        }
    } catch (error) {
        return null
    }
}

export const updateDefaultAddress = async (address) => {
    return await updateDoc(doc(db, `users`, auth.currentUser?.uid), {
        defaultAddress: address
    })

}
export const addAddressToUser = async (address) => {
    return await addDoc(collection(db, `users/${auth.currentUser?.uid}/addresses`), address)
    // return await updateDoc(doc(db, `users`, auth.currentUser?.uid), {
    //     defaultAddress: address
    // })

}

export const fetchBySlug = async ({ collectionSlug = '', collectionName = "", subCollection = null, subCollectionSlug = null, subSubCollection = null, subSubCollectionSlug = null }) => {
    let name = '';
    let data = null;

    let collRef;

    let collectionDoc = await getDocs(query(collection(db, "categories"), where('slug.name', '==', collectionSlug))).then((val: QuerySnapshot) => {
        if (val.docs.length != 0) {
            return val.docs[0].id;
        } else {
            return "";
        }
    })



    if (subSubCollection && subSubCollectionSlug) {

        let subCollectionDoc = await getDocs(query(collection(db, `categories/${collectionDoc}/${subCollection}`), where('slug.name', '==', subCollectionSlug))).then((val: QuerySnapshot) => {

            if (val.docs.length != 0) {
                return val.docs[0].id;
            } else {
                return "";
            }
        })


        collRef = query(collection(db, `${collectionName}/${collectionDoc}/${subCollection}/${subCollectionDoc}/${subSubCollection}`), where('slug.name', '==', subSubCollectionSlug));
    }
    else if (subCollection && subCollectionSlug) {

        collRef = query(collection(db, `${collectionName}/${collectionDoc}/${subCollection}`), where('slug.name', '==', subCollectionSlug));
    } else {
        collRef = query(collection(db, `${collectionName}`), where('slug.name', '==', collectionSlug));
    }

    data = await getDocs(collRef).then((val) => {
        if (val.docs.length === 0) {
            return null
        }
        let docData: any = val.docs[0].data()
        name = docData?.name;
        return { ...docData, id: val.docs[0].id }
    })



    return { name, data }
}


export async function addItemtoWishList(item, id = "") {
    if (!auth.currentUser?.uid) return;
    try {
        await setDoc(doc(db, `users/${auth.currentUser?.uid}/wishlist`, (item?.id || id)), {
            id: item?.id || id,
            name: item?.prodName || item?.name || "",
            createdAt: new Date()
        });
        return true
    } catch (error) {
        console.log("ERR", error);
        return false;
    }

}

export async function fetchUserWishList(cookieData = null) {
    let cookie;

    if (cookieData) {
        cookie = cookieData;
    } else {
        cookie = { value: getCookie('uid') }
    }


    let uid;
    if (auth.currentUser?.uid) {
        uid = auth.currentUser?.uid;
    }
    if (cookie?.value) {
        uid = cookie?.value;
    }


    if (!uid) return null

    try {
        let data = await getDocs(collection(db, `users/${uid}/wishlist`)).then((val) => {
            if (val.docs.length > 0) {
                let arr = [];
                for (const doc of val.docs) {
                    ; arr.push({ ...doc.data(), id: doc.id })
                }
                return arr;
            } else {
                return null;
            }
        })

        return data;
    } catch (error) {
        console.log(error);
    }

}

export async function fetchUserWishListProducts(cookie) {
    const userWishlist = await fetchUserWishList(cookie);
    if (userWishlist && userWishlist.length > 0) {
        let wishlistProducts = []
        for (const wishlistDoc of userWishlist) {
            const product = await (getDoc(doc(db, 'products', wishlistDoc?.id))).then(doc => {
                return { ...doc.data(), id: doc.id };
            })
            wishlistProducts.push(product)
        }
        return JSON.parse(JSON.stringify(wishlistProducts));
    } else {
        return null
    }

    // let wishlistProducts = []
    // for (const wishlistDoc of userWishlist) {
    //     const product = await (getDoc(doc(db, 'products', wishlistDoc?.id))).then(doc => {
    //         return { ...doc.data(), id: doc.id };
    //     })
    //     wishlistProducts.push(product)
    // }
    // console.log("wishlistProducts",wishlistProducts);

    // return JSON.parse(JSON.stringify(wishlistProducts));
}

export async function removeItemFromWishList(itemId) {
    if (!auth.currentUser?.uid) return;

    try {
        await deleteDoc(doc(db, `users/${auth.currentUser?.uid}/wishlist`, itemId));
        return true;
    } catch (error) {
        console.log(error);
        return false
    }

}



export async function fetchMenus() {
    const data = (await getDoc(doc(db, 'studio/website/sections', 'header'))).data();
    return data;
}


export async function getStoreDetails() {
    return (await getDoc(doc(db, 'settings', 'store'))).data();
}



export async function getCountries() {
    return await getDoc(doc(db, 'features', 'multiCountries')).then((val) => {
        let data = val.data();
        let countries = data?.countries;

        let arr = []

        for (const cn of countries) {
            if (cn?.active) {
                arr.push(cn)
            }
        }
        return arr;

    });
}


export async function fetchArticles() {
    return await getDocs(collection(db, 'articles')).then((val) => {
        if (val.docs.length === 0) return null;
        let arr = [];
        for (const article of val.docs) {
            arr.push({ ...article.data(), id: article.id })
        }

        return JSON.parse(JSON.stringify(arr));
    });
}
export async function fetchStoreLinksData() {
    return (await getDoc(doc(db, 'settings', 'app'))).data();

    // return await getDocs(collection(db, 'settings')).then((val) => {
    //     if (val.docs.length === 0) return null;
    //     let arr = [];
    //     for (const article of val.docs) {
    //         arr.push({ ...article.data(), id: article.id })
    //     }

    //     return arr;
    // });
}


export async function fetchAboutUs() {
    return (await getDoc(doc(db, 'pages', 'about'))).data();
}
export async function fetchPolicies() {
    return (await getDoc(doc(db, 'settings', 'policies'))).data();
}

export async function fetchSpecificCaloriesProduct(intakeAmount, cart, selected) {
    let lowerSelected = selected === "Calories" ? "calorie" : selected.toLowerCase()
        ; console.log({ lowerSelected });

    let ref = query(collection(db, `products`), where(`intake.${lowerSelected}`, '<=', intakeAmount));
    let data = await getDocs(ref).then((val) => {
        if (val.docs.length > 0) {
            let arr = [];
            val.docs.forEach((doc) => {
                if (doc?.data()?.status) {
                    arr.push({ ...doc.data(), id: doc.id })
                }
            })

            return arr;
        }
        return [];

    })

    let ids = cart?.map((item) => item?.productId);
    let res = [];

    for (const prod of data) {
        if (!ids.includes(prod?.id)) {
            res.push(prod)
        }
    }
    return res;
    // return data;

}



export async function fetchExchangeRate({ to }) {
    const res = await fetch(
        process.env.NEXT_PUBLIC_API_DOMAIN + "/api/curr-ex",
        {
            method: "POST",
            body: JSON.stringify({ to }),
            headers: {
                "content-type": "application/json",
            },
        }
    );
    const data = await res.json();
    return data
}


export async function uploadFile({ file, email = null, refCollection }) {
    if (!file) return;

    let storageRef;
    if (email) {
        storageRef = ref(
            storage,
            `${refCollection}/${email}/${file.name}`
        );
    } else {
        storageRef = ref(
            storage,
            `${refCollection}/${file.name}`
        );
    }
    const uploadTask = await uploadBytes(storageRef, file);
    let url = await getDownloadURL(storageRef);

    return url
}

export const getUserOrders = async (cookieData) => {
    let cookie;

    if (cookieData) {
        cookie = cookieData;
    } else {
        cookie = { value: getCookie("uid") };
    }
    let uid;
    if (auth.currentUser?.uid) {
        uid = auth.currentUser?.uid;
    }
    if (cookie?.value) {
        uid = cookie?.value;
    }
    console.log(uid);

    if (uid) {
        // console.log(uid , "llllll")
        const orders = query(collection(db, "orders"), where("userId", "==", uid), orderBy('createdAt', 'desc'));

        const querySnapshot = await getDocs(orders);

        if (querySnapshot.docs.length === 0) {
            return [];
        }
        // console.log(querySnapshot.docs.length , "llllll")
        if (querySnapshot.docs && querySnapshot.docs.length > 0) {
            let arr = [];

            querySnapshot.docs.forEach((doc) => {
                arr.push({ ...doc?.data(), id: doc.id });
            });

            return JSON.parse(JSON.stringify(arr));
        }
        return [];
    } else {
        return [];
    }
};


export async function fetchAllBrands() {
    return await getDocs(query(collection(db, "brands"), where('status', '==', true))).then((docs) => {
        if (docs.docs.length === 0) return;
        let arr = [];

        for (const doc of docs.docs) {
            arr.push({ id: doc.id, name: doc.data()?.name })
        }
        return arr;
    })
}


export const RemoveAddress = async (addressId) => {
    let cookie;

    cookie = { value: getCookie("uid") };

    let uide;

    if (auth.currentUser?.uid) {
        uide = auth.currentUser?.uid;
    }
    if (cookie?.value) {
        uide = cookie?.value;
    }
    try {
        // Reference to the address document to be deleted
        const addressDocRef = doc(db, `users/${uide}/addresses`, addressId);

        // Delete the address document
        await deleteDoc(addressDocRef);

        // Show a success message
    } catch (error) {
        console.error("Error removing address:", error);
    }
};


export const updateUserDetails = async (updatedUserData) => {
    return await updateDoc(
        doc(db, `users`, auth.currentUser?.uid),
        updatedUserData,
        { merge: true }
    );
};


export const UpdateEditDetails = async (addressId, updatedDetails, { isNewAddress = false }) => {
    let cookie;

    cookie = { value: getCookie("uid") };

    let uide;

    if (auth.currentUser?.uid) {
        uide = auth.currentUser?.uid;
    }
    if (cookie?.value) {
        uide = cookie?.value;
    }

    try {
        if (isNewAddress) {
            const addressDocRef = await addDoc(collection(db, `users/${uide}/addresses`), { ...updatedDetails, createdAt: new Date() });
            await updateDoc(doc(db, `users`, uide), { defaultAddress: updatedDetails });

        } else {
            const addressDocRef = doc(db, `users/${uide}/addresses`, addressId);
            await updateDoc(addressDocRef, updatedDetails, { merge: true });
        }
    } catch (error) {
        console.error("Error editing address:", error);
    }
};

export const fetchStorLocations = async () => {
    const res = await getDocs(collection(db, "branches")).then((snaoShot) => {
        if (snaoShot.docs.length === 0) return [];

        let arr = [];
        for (const location of snaoShot.docs) {
            let data = location.data();
            arr.push({ ...data, id: location.id })
        }

        return arr
    })

    return JSON.parse(JSON.stringify(res))
    // return (await getDoc(doc(db, "storeLocations", 'locations'))).data();
}