import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { auth, db } from "../../config/firebase-config";
import { constant } from "../constants";

function removeHtml(desc) {
    const tagsRemoved = desc.replace(/(<([^>]+)>)/ig, '');
    const plainTxt = document.createElement('textarea');
    plainTxt.innerHTML = tagsRemoved;
    return plainTxt.value;
}


function priceSlabsCheck(cartObj, product) {
    if ('priceSlabs' in product && product.priceSlabs.active) {
        if (product.isPriceList) {
            const variantSlabs = product.priceSlabs.variantSlabs || {};
            console.log('variantSlabs', variantSlabs);
            if (Object.keys(variantSlabs).length) {
                if (Object.keys(variantSlabs).includes(cartObj.pack.weight)) {
                    const slabs = variantSlabs[cartObj.pack.weight];
                    console.log('slabs', slabs);
                    if (slabs.length) {
                        let finalRange: any = {};
                        for (const element of slabs) {
                            console.log('element', element);
                            if ((cartObj.quantity >= element.qty[0]) && (cartObj.quantity <= element.qty[1])) {
                                finalRange = element;
                                break;
                            }
                        }
                        if (Object.keys(finalRange).length) {
                            if (cartObj.pack.variantType === 'pieces') {
                                cartObj.price = finalRange.price * parseInt(cartObj.pack.weight);
                                cartObj.pack.price = finalRange.price * parseInt(cartObj.pack.weight);
                                cartObj.mrpPrice = finalRange.mrp * parseInt(cartObj.pack.weight);
                            } else {
                                cartObj.price = finalRange.price;
                                cartObj.pack.price = finalRange.price;
                                cartObj.mrpPrice = finalRange.mrp;
                            }
                        }
                    }
                }
            }
        } else {
            const singleSlabs = product.priceSlabs.singleSlabs || {};
            if (Object.keys(singleSlabs).length) {
                let finalRange: any = {};
                for (const element of singleSlabs) {
                    if ((cartObj.quantity >= element.qty[0]) && (cartObj.quantity <= element.qty[1])) {
                        finalRange = element;
                        break;
                    }
                }
                if (Object.keys(finalRange).length) {
                    cartObj.price = finalRange.price;
                    cartObj.mrpPrice = finalRange.mrp;
                }
            }
        }
    }

    return cartObj;
}
function getCoverPic(product, index) {
    const variant = product.priceList[index];
    if (variant.images && variant.length > 0) {

        return 'images' in variant && variant.images.length ? variant.images[0] : product.coverPic;
    }
    return "";
}



function handleAddToCart() {
    const data = localStorage.getItem('cart');
    console.log(data);

}


async function getUserCartDetails(cookie) {
    let cart = [];



    let localStorageCart = JSON.parse(localStorage.getItem('cart'));
    if (localStorageCart && localStorageCart?.length != 0) {
        cart = [...localStorageCart]
    }



    if (auth.currentUser?.uid || (cookie && cookie.value !== "")) {
        let id = auth.currentUser?.uid || cookie.value;
        cart = [];

        const userCart = await getDocs(collection(db, `users/${id}/cart`)).then((val => {
            if (val.docs.length !== 0) {
                let arr = [];
                for (const cartObj of val.docs) {
                    arr.push({ ...cartObj.data(), id: cartObj.id })
                }

                return arr;
            }
            return [];
        }))
        if (userCart && userCart.length !== 0) {

            for (const userCartItem of userCart) {
                cart.push(userCartItem)
            }
        }
    }
    return cart;
}


async function updatedCartFromBackend(cartData: any[]) {
    return new Promise<any[]>(async (resolve, reject) => {
        try {
            let cartProducts = JSON.parse(JSON.stringify(cartData));
            let latestProducts = [];
            let updatedCartPdts = [];
            for (let index = 0; index < cartProducts.length; index++) {
                // let product = await this.afs.collection('products').doc(cartProducts[index].productId).valueChanges().pipe(first()).toPromise();
                const product = await getDoc(doc(db, 'products', cartProducts[index].productId)).then((val => {
                    if (val.exists) {
                        return { ...val.data(), id: val.id }
                    }
                    return null
                }))
                if (product) {
                    product['id'] = cartProducts[index].productId;
                    latestProducts.push(product);
                }

            }
            if (latestProducts.length) {
                updatedCartPdts = await getUpdatedPdts(latestProducts, cartProducts);
            }
            resolve(updatedCartPdts);

        } catch (error) {
            console.dir(error);
            resolve([]);
        }
    });
}

async function getUpdatedPdts(pdts, cartPdts) {
    return new Promise<any[]>(async (resolve) => {
        for (let c of cartPdts) {
            const productIndex = pdts.findIndex(p => p.id === c.productId);
            if (productIndex !== -1) {
                const dbProduct = pdts[productIndex];
                c.name = dbProduct.prodName;
                c.maxQty = dbProduct.maxQty ? dbProduct.maxQty : 0;
                c.minQty = dbProduct.minQty ? dbProduct.minQty : 1;
                c.status = dbProduct.inactiveByVendor ? false : typeof dbProduct.status !== undefined ? dbProduct.status : true;
                c.stopWhenNoQty = dbProduct.hasOwnProperty('stopWhenNoQty') && typeof dbProduct.stopWhenNoQty !== undefined ? dbProduct.stopWhenNoQty : false;
                c.retailDiscount = dbProduct.hasOwnProperty('retailDiscount') ? dbProduct.retailDiscount : 0;
                c.retailDiscountType = dbProduct.retailDiscountType || 'percentage';
                c.extraCharges = ('extraCharges' in dbProduct) && (typeof dbProduct.extraCharges === 'object') && dbProduct.extraCharges.active ? dbProduct.extraCharges : { charge: 0 };
                c.img = { url: dbProduct.coverPic?.url || dbProduct.images[0]?.url || constant.errImage };
                c.keywords = dbProduct?.searchKeywords
                if (!c.hasOwnProperty('pack')) {
                    c.totalQty = dbProduct.productQty ? dbProduct.productQty : '';
                    if (parseInt(dbProduct.productQty) && (c.quantity > parseInt(dbProduct.productQty))) {
                        c.quantity = parseInt(dbProduct.productQty);
                    }
                    if (dbProduct.discountedPrice && dbProduct.discountedPrice !== dbProduct.prodPrice) {
                        c.price = dbProduct.discountedPrice;
                        c.mrpPrice = dbProduct.prodPrice;
                    } else {
                        c.price = dbProduct.prodPrice;
                    }
                } else {
                    if (c.pack.variantType !== 'pieces') {
                        dbProduct.priceList.forEach((pl) => {
                            if (pl.weight === c.pack.weight) {
                                c.totalQty = pl.totalQuantity ? pl.totalQuantity : '';
                                if (parseInt(pl.totalQuantity) && (c.quantity > parseInt(pl.totalQuantity))) {
                                    c.quantity = parseInt(pl.totalQuantity);
                                }
                                if (pl.discountedPrice && pl.discountedPrice !== pl.price) {
                                    c.price = pl.discountedPrice;
                                    c.mrpPrice = pl.price;
                                    c.pack.price = pl.price;
                                } else {
                                    c.price = pl.price;
                                    c.pack.price = pl.price;
                                }
                            }
                        })
                    } else {
                        dbProduct.priceList.forEach((pl) => {
                            if (pl.weight === c.pack.weight) {
                                c.totalQty = pl.totalQuantity ? pl.totalQuantity : '';
                                if (parseInt(pl.totalQuantity) && (c.quantity > parseInt(pl.totalQuantity))) {
                                    c.quantity = parseInt(pl.totalQuantity);
                                }
                                if (pl.discountedPrice && pl.discountedPrice !== pl.price) {
                                    c.price = pl.discountedPrice * parseInt(pl.weight);
                                    c.mrpPrice = pl.price * parseInt(pl.weight);
                                    c.pack.price = pl.discountedPrice * parseInt(pl.weight);
                                    c.pack.perPcPrice = pl.discountedPrice;
                                } else {
                                    c.price = pl.price * parseInt(pl.weight);
                                    c.pack.price = pl.price * parseInt(pl.weight);
                                    c.pack.perPcPrice = pl.price;
                                }
                            }
                        })
                    }
                }

            } else {
                c.status = false;
            }
        }
        resolve(cartPdts);
    });

}



async function getGstAppilicableInfo() {
    const res = (await getDoc(doc(db, 'payment', 'info'))).data();
    if (res) {
        return res?.isGstApplicable
    }
    return false;
    // var res = await db.collection('payment').doc('info').get().then((value) {
    //     var data = value.data();
    //     return data?['isGstApplicable'];
    //   });
    //   return res;
}


export {
    removeHtml, priceSlabsCheck, getCoverPic, getUserCartDetails, updatedCartFromBackend, getUpdatedPdts, getGstAppilicableInfo
}