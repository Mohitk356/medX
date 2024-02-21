import { createSlice, PayloadAction, createAsyncThunk, current } from "@reduxjs/toolkit";
import { getCoverPic, priceSlabsCheck, removeHtml } from "../../utils/cartUtilities/cartUtility";
import { auth, db } from "../../config/firebase-config";
import { addDoc, collection, deleteDoc, doc, setDoc, updateDoc } from "firebase/firestore";
import { removeCartObjFromUser } from "../../utils/databaseService";
import { constant } from "../../utils/constants";



const initialState: any = {
    cart: [],
    intakeModal: {
        selected: "",
        selectedValue: 0
    }
};



function getImage(product: any) {
    if (
        product?.coverPic &&
        product?.coverPic?.url &&
        !product?.coverPic?.url?.includes("assets/img")
    ) {
        return { url: product?.coverPic?.url };
    }
    if (
        product?.images &&
        product?.images[0]?.url &&
        !product?.images[0]?.url?.includes("assets/img")
    ) {
        return { url: product?.images[0]?.url };
    }
    return { urL: constant?.errImage };
}



export function getCartObj({ product, productID, quantity = 1 }: any) {
    let cartObj: any = {
        name: product.prodName,
        quantity: quantity || 1,
        img: getImage(product),
        productId: productID,
        commentMsg: '',
        slug: product?.slug || "",
        commentImgs: [],
        maxQty: product.maxQty ? product.maxQty : 0,
        minQty: product.minQty ? product.minQty : 1,
        gst: product.gst ? product.gst : 0,
        status: typeof product.status !== 'undefined' ? product.status : true,
        stopWhenNoQty: product.hasOwnProperty('stopWhenNoQty') && typeof product.stopWhenNoQty !== 'undefined' ? product.stopWhenNoQty : false,
        totalQty: product.productQty ? product.productQty : '',
        hsn: product.hsnCode ? product.hsnCode : '',
        sku: product.productCode ? product.productCode : '',
        barcode: product.barcode ? product.barcode : '',
        shippingWt: product.shippingWeight || 0,
        barcodeNo: product.barcodeNo || '',
        gstExclusive: product.gstExclusive || false,
        extraCharges: ('extraCharges' in product) && (typeof product.extraCharges === 'object') && product.extraCharges.active ? product.extraCharges : { charge: 0 },
        isCod: 'isCod' in product ? product.isCod : true,
        vendorId: product.vendorId || '',
        priceSlabs: 'priceSlabs' in product ? product.priceSlabs : { active: false },
        templateId: product.templateId || '',
        intake: product?.intake || null,
        keywords: product?.searchKeywords || [],
        pack: {
            weight: product?.prodName,
            variantType: 'variant',
        },
        mrpPrice: product.prodPrice || product?.discountedPrice,
        isPriceList: product?.isPriceList,
        restrictedCountries: product?.restrictedCountries || [],

    };

    let desc = removeHtml(product.prodDesc);
    cartObj['description'] = desc;
    if (product.discountedPrice && (product.discountedPrice !== product.prodPrice)) {
        cartObj['mrpPrice'] = product.prodPrice;
        cartObj['price'] = product.discountedPrice;
    } else {
        cartObj['price'] = product.prodPrice;
    }
    if (product.hasOwnProperty('color') && product.color.hasOwnProperty('name')) {
        cartObj['color'] = product.color;
    }
    if (product.ptype === 'child') {
        cartObj['parentProductId'] = product.parentId;
    }

    if (product.productType) {
        cartObj['orderType'] = product.productType;
        switch (product.productType) {
            case 'quotation': {
                cartObj['price'] = 0;
                cartObj['mrpPrice'] = 0;
                break;
            }
        }
    }

    cartObj = priceSlabsCheck(cartObj, product);

    return cartObj;
}

export function getPriceListCartObj({ product, index, quantity = 1 }) {
    let cartObj: any = {
        name: product.prodName,
        quantity: quantity || 1,
        img: getImage(product),
        slug: product?.slug || "",
        description: product.priceList[index].weight,
        commentMsg: '',
        commentImgs: [],
        maxQty: product.maxQty ? product.maxQty : 0,
        minQty: product.minQty ? product.minQty : 1,
        gst: product.gst ? product.gst : 0,
        status: typeof product.status !== 'undefined' ? product.status : true,
        stopWhenNoQty: product.hasOwnProperty('stopWhenNoQty') && typeof product.stopWhenNoQty !== 'undefined' ? product.stopWhenNoQty : false,
        totalQty: product.priceList[index].totalQuantity ? product.priceList[index].totalQuantity : '',
        hsn: product.hsnCode ? product.hsnCode : '',
        sku: ('sku' in product?.priceList[index] && product.priceList[index]?.sku != "") ? product.priceList[index].sku : product.productCode ? product.productCode : '',
        barcode: product.priceList[index].barcode ? product.priceList[index].barcode : '',
        shippingWt: product.priceList[index].shippingWeight || 0,
        barcodeNo: product.priceList[index].barcodeNo || '',
        gstExclusive: product.gstExclusive || false,
        extraCharges: ('extraCharges' in product) && (typeof product.extraCharges === 'object') && product.extraCharges.active ? product.extraCharges : { charge: 0 },
        isCod: 'isCod' in product ? product.isCod : true,
        vendorId: product.vendorId || '',
        vendorName: product?.vendorName || "",
        priceSlabs: 'priceSlabs' in product ? product.priceSlabs : { active: false },
        templateId: product.templateId || '',
        pack: {
            weight: product.priceList[index].weight,
            variantType: product.variantType ? product.variantType : 'variant'
        },
        intake: product?.intake || null,
        keywords: product?.searchKeywords || [],
        isPriceList: product?.isPriceList,
        restrictedCountries: product?.restrictedCountries || [],

    };

    cartObj['mrpPrice'] = product.priceList[index].price || product.priceList[index].discountedPrice;
    cartObj['price'] = product.priceList[index].discountedPrice;
    cartObj.pack['price'] = product.priceList[index].discountedPrice;

    if (product.variantType && product.variantType === 'pieces') {
        if (product.priceList[index].discountedPrice && product.priceList[index].discountedPrice !== product.priceList[index].price) {
            cartObj['mrpPrice'] = product.priceList[index].price * parseInt(product.priceList[index].weight);
            cartObj['price'] = product.priceList[index].discountedPrice * parseInt(product.priceList[index].weight);
            cartObj.pack['price'] = product.priceList[index].discountedPrice * parseInt(product.priceList[index].weight);
            cartObj.pack['perPcPrice'] = product.priceList[index].discountedPrice;
        } else {
            cartObj['price'] = product.priceList[index].price * parseInt(product.priceList[index].weight);
            cartObj.pack['price'] = product.priceList[index].price * parseInt(product.priceList[index].weight);
            cartObj.pack['perPcPrice'] = product.priceList[index].price;
        }
    } else {
        if (product.priceList[index].discountedPrice && product.priceList[index].discountedPrice !== product.priceList[index].price) {
            cartObj['mrpPrice'] = product.priceList[index].price;
            cartObj['price'] = product.priceList[index].discountedPrice;
            cartObj.pack['price'] = product.priceList[index].discountedPrice;
        } else {
            cartObj['price'] = product.priceList[index].price;
            cartObj.pack['price'] = product.priceList[index].price;
        }
    }

    if (product.hasOwnProperty('color') && product.color.hasOwnProperty('name')) {
        cartObj['color'] = product.color;
    }

    if (product.parentProductId) {
        cartObj['parentProductId'] = product.parentProductId;
        cartObj['productId'] = product.id;
    } else {
        cartObj['productId'] = product.id;
    }

    if (product.productType) {
        cartObj['orderType'] = product.productType;
        switch (product.productType) {
            case 'quotation': {
                cartObj['price'] = 0;
                cartObj['mrpPrice'] = 0;
                cartObj['pack']['price'] = 0;
                break;
            }
        }
    }

    cartObj = priceSlabsCheck(cartObj, product);


    return cartObj;
}




export const cartSlice = createSlice({
    name: "cartSlice",
    initialState,
    reducers: {
        reset: () => initialState,
        initializeCart: (state, action: PayloadAction<any>) => {
            state.cart = action.payload
        },
        addToCart: (state, action: PayloadAction<any>) => {
            let arr = state.cart;
            arr.push(action.payload);
            state.cart = arr;
            if (auth.currentUser?.uid) {

            } else {
                localStorage.setItem('cart', JSON.stringify(arr));
            }

        },
        removeFromCart: (state, action: PayloadAction<any>) => {
            const { product,
                productID,
                index,
                isPriceList,
            } = action.payload;
            let cart = current(state)?.cart;
            console.log("IS PRICELIST", isPriceList);

            let cartIndex = isPriceList ? cart.findIndex((item) => item?.productId === productID && item?.description === product?.pack?.weight) : cart.findIndex((item) => item?.productId === productID)
            let objec = cart[cartIndex] || null;
            let check = cart?.filter((cartItem, index) => index !== cartIndex);



            state.cart = check;
            if (auth.currentUser?.uid) {
                if (objec && objec?.id) {
                    removeCartObjFromUser(objec?.id)
                } else {
                    localStorage.setItem('cart', JSON.stringify(check));
                }
            } else {
                localStorage.setItem('cart', JSON.stringify(check));
            }
        },
        updateCartItemQuantity: (state, action: PayloadAction<any>) => {
            const { type,

                addedQty = 1,
                index,
            } = action.payload;
            let arr = state.cart;
            console.log({ arr });

            let currentQty = state.cart[index]['quantity']

            let cartitemId = state.cart[index]?.id || ""
            if (type === 'inc') {
                arr[index] = {
                    ...arr[index],
                    "quantity": type == "inc"
                        ? state.cart[index]['quantity'] + addedQty
                        : state.cart[index]['quantity'] - addedQty,
                };
            } else {
                if (currentQty - addedQty < addedQty) {
                    arr.splice(index, 1)
                } else {
                    arr[index] = {
                        ...arr[index],
                        "quantity": type == "inc"
                            ? state.cart[index]['quantity'] + addedQty
                            : state.cart[index]['quantity'] - addedQty,
                    };
                }
            }

            state.cart = arr;
            if (auth.currentUser?.uid) {
                if (cartitemId) {
                    if (type === 'inc') {
                        updateDoc(doc(db, `users/${auth.currentUser?.uid}/cart`, arr[index]?.id), {
                            quantity: type === "inc" ? currentQty + addedQty : currentQty - addedQty
                        })
                    } else {
                        if (currentQty - addedQty < addedQty) {
                            deleteDoc(doc(db, `users/${auth.currentUser?.uid}/cart`, cartitemId))
                        } else {
                            updateDoc(doc(db, `users/${auth.currentUser?.uid}/cart`, cartitemId), {
                                quantity: type === "inc" ? currentQty + addedQty : currentQty - addedQty
                            })
                        }
                    }
                }
            } else {
                localStorage.setItem('cart', JSON.stringify(arr));
            }
        },

        updateIntakeModalValues: (state, action: PayloadAction<any>) => {
            state.intakeModal = {
                selected: action?.payload?.selected,
                selectedValue: action?.payload?.selectedValue
            }
        }
    },

});

export const {
    addToCart,
    removeFromCart,
    reset,
    initializeCart,
    updateCartItemQuantity,
    updateIntakeModalValues
} = cartSlice.actions;
export default cartSlice.reducer;