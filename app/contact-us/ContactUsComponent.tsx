"use client";
import React from "react";
import ContactInfo from "../../components/contactinfo/ContactInfo";
import GoogleMap from "../../components/map/Map";

const ContactUsComponent = () => {
  return <div>
    <GoogleMap/>
      <ContactInfo/>
       </div>;
};

export default ContactUsComponent;
