export interface RootOrder {
    delivery: number
    orderId: string
    couponDiscount: number
    defaultGst: number
    totalAmountToPaid: number
    couponId: string
    couponName: string
    scheduledDate: string
    scheduledTime: string
    totalMrp: number
    discountOnMrp: number
    deliveryGstObj: DeliveryGstObj
    customerGstNo: string
    billingAddress: BillingAddress
    userNote: string
    currency: string
    description: string
    autoConfirmOrder: boolean
    storePickupObj: StorePickupObj
    metaData: MetaData
    products: Product[]
    address: Address
    orderId: any
    status: string
    createdAt: string
    payment: Payment
    msgId: string
    userName: string
    region: string
    userId: string
}

export interface DeliveryGstObj {
    value: number
    total: number
    extraChargeGst: number
}

export interface BillingAddress {
    city: string
    phoneNo: string
    defaultAddress: boolean
    state: string
    country: string
    createdAt: CreatedAt
    lat: number
    ccode: string
    name: string
    email: string
    company: string
    stateCode: string
    address: string
    lng: number
    pincode: string
}

export interface CreatedAt {
    nanoseconds: number
    seconds: number
}

export interface StorePickupObj { }

export interface MetaData {
    source: string
    orderBy: OrderBy
    inventoryManaged: boolean
}

export interface OrderBy {
    id: string
    name: string
    role: string
}

export interface Product {
    isCod: boolean
    gst: string
    img: Img
    templateId: string
    price: number
    priceSlabs: PriceSlabs
    restrictedCountries: any[]
    maxQty: number
    stopWhenNoQty: boolean
    pack: Pack
    gstExclusive: boolean
    name: string
    productId: string
    keywords: string[]
    commentMsg: string
    barcodeNo: string
    intake: Intake
    status: boolean
    quantity: number
    description: string
    minQty: number
    isPriceList: boolean
    slug: Slug
    barcode: string
    shippingWt: number
    hsn: string
    mrpPrice: number
    vendorId: string
    extraCharges: ExtraCharges
    totalQty: string
    sku: string
    commentImgs: any[]
    id: string
    gstObj: GstObj
}

export interface Img {
    url: string
}

export interface PriceSlabs {
    variantSlabs: VariantSlabs
    active: boolean
    singleSlabs: any[]
}

export interface VariantSlabs { }

export interface Pack {
    weight: string
    variantType: string
}

export interface Intake {
    calorie: any
    carbs: any
    protein: any
    fat: any
}

export interface Slug {
    updatedAt: UpdatedAt
    name: string
    updatedBy: string
}

export interface UpdatedAt {
    nanoseconds: number
    seconds: number
}

export interface ExtraCharges {
    charge: number
}

export interface GstObj {
    value: string
    total: number
    cgst: number
    sgst: number
    igst: string
}

export interface Address {
    city: string
    phoneNo: string
    defaultAddress: boolean
    state: string
    country: string
    createdAt: CreatedAt2
    lat: number
    ccode: string
    name: string
    email: string
    company: string
    stateCode: string
    address: string
    lng: number
    pincode: string
}

export interface CreatedAt2 {
    nanoseconds: number
    seconds: number
}

export interface Payment {
    completed: boolean
    mode: string
    details: any
}
