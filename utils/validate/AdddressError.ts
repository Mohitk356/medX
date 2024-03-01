import { validateEmail } from "../utilities";

export const ValidateAddressError = (addressToDeliver: any) => {
    const {
        address,
        city,
        lat,
        lng,
        name,
        phoneNo,
        pincode,
        state,
        country,
        stateCode,
        email,
    } = addressToDeliver;

    const errors = [];

    if (!name) {
        errors.push("Name is required");
    }

    if (!email) {
        errors.push("Email is required");
    } else if (!validateEmail(email)) {
        errors.push("Invalid email address");
    }

    if (phoneNo.length < 7 || phoneNo.length > 12) {
        errors.push("Invalid Mobile Number");
    }

    if (!country) {
        errors.push("Country is required");
    }

    if (!city) {
        errors.push("City is required");
    }

    if (!address) {
        errors.push("Address is required");
    }

    if (!pincode) {
        errors.push("Pincode is required");
    }

    return errors;
};
