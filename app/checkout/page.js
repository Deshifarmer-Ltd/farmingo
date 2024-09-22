"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/contexts/cart/cart-context";
import { ROUTES } from "@/routes/routes";
import toast from "react-hot-toast";
import { useAuth } from "@/contexts/auth/auth-context";
import { useAuthModal } from "@/contexts/auth/login-modal";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import { getSelectedZone } from "@/utils/getSelectedZone";
import { useRouter } from "next/navigation";

const CheckoutPage = () => {
  const { cart, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { openLoginModal } = useAuthModal();
  const [authToken, setAuthToken] = useState(Cookies.get("authToken"));
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errors, setErrors] = useState({});
  const savedZone = getSelectedZone();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      setAuthToken(Cookies.get("authToken"));
    }
  }, [isAuthenticated]);

  const validateInputs = () => {
    const newErrors = {};
    const phoneRegex = /^(\+8801[3-9]\d{8}|01[3-9]\d{8})$/; // Bangladeshi phone number format
    if (!name) newErrors.name = "Name is required.";
    if (!address) newErrors.address = "Address is required.";
    if (!phoneNumber) {
      newErrors.phone = "Phone number is required.";
    } else if (phoneNumber.length !== 11) {
      newErrors.phone = "Phone number must be exactly 11 digits.";
    } else if (!phoneRegex.test(phoneNumber)) {
      newErrors.phone = "Please enter a valid Bangladeshi phone number.";
    }
    return newErrors;
  };

  const handleOrder = async () => {
    if (!isAuthenticated) {
      openLoginModal();
      return;
    }

    const validationErrors = validateInputs();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to confirm this order?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, confirm it!",
    });

    if (result.isConfirmed) {
      try {
        const zoneResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}${ROUTES.ZONES}`
        );
        if (!zoneResponse.ok) {
          throw new Error("Failed to fetch zones");
        }
        const zonesData = await zoneResponse.json();
        const zone = zonesData.find((zone) => zone.name === savedZone);

        if (!zone) {
          throw new Error("Selected zone not found in zones data");
        }

        const productData = cart.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
        }));

        const orderData = {
          zone_id: zone.id,
          product: productData,
          customer: {
            name,
            address,
            phone: phoneNumber,
          },
        };

        const requestOptions = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(orderData),
        };

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}${ROUTES.ORDER}`,
          requestOptions
        );
        if (!response.ok) {
          throw new Error("Failed to send order data");
        }

        toast.success("Order placed successfully");
        clearCart();
        router.push("/");
      } catch (error) {
        console.error("Error sending order data:", error.message);
        toast.error("Error placing the order");
      }
    }
  };

  // Live validation for phone number
  useEffect(() => {
    if (phoneNumber) {
      const validationErrors = validateInputs();
      setErrors((prev) => ({
        ...prev,
        phone: validationErrors.phone,
      }));
    } else {
      setErrors((prev) => ({ ...prev, phone: undefined }));
    }
  }, [phoneNumber]);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow container mx-auto px-4 py-8 max-w-screen-lg flex flex-col md:flex-row">
        {/* Delivery Information Section as Card */}
        <div className="w-full md:w-1/2 pr-0 md:pr-4 mb-4 md:mb-0">
          <div className="bg-white rounded-md shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Delivery Information
            </h2>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setErrors((prev) => ({ ...prev, name: undefined }));
                }}
                className={`border rounded-md p-2 w-full shadow-md ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
                style={{ backgroundColor: "#f9f9f9" }}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name}</p>
              )}
            </div>

            <div className="mb-4">
              <input
                type="text"
                placeholder="Phone Number"
                value={phoneNumber}
                onChange={(e) => {
                  setPhoneNumber(e.target.value);
                  setErrors((prev) => ({ ...prev, phone: undefined }));
                }}
                className={`border rounded-md p-2 w-full shadow-md ${
                  errors.phone ? "border-red-500" : "border-gray-300"
                }`}
                style={{ backgroundColor: "#f9f9f9" }}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone}</p>
              )}
            </div>

            <div className="mb-4">
              <textarea
                placeholder="Delivery Address"
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  setErrors((prev) => ({ ...prev, address: undefined }));
                }}
                className={`border rounded-md p-2 w-full shadow-md ${
                  errors.address ? "border-red-500" : "border-gray-300"
                }`}
                style={{ backgroundColor: "#f9f9f9" }}
                rows="3"
              />
              {errors.address && (
                <p className="text-red-500 text-sm">{errors.address}</p>
              )}
            </div>

            <div className="flex justify-center items-center py-4">
              <button
                onClick={handleOrder}
                className="bg-green-600 text-white px-6 py-2 rounded-md mb-2"
              >
                Confirm Order
              </button>
              <p className="text-lg font-semibold ml-4">
                Total Price: ৳
                {cart.reduce(
                  (total, item) => total + item.quantity * item.price,
                  0
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Checkout Items Section as Card */}
        <div className="w-full md:w-1/2 pl-0 md:pl-4">
          <div className="bg-white rounded-md shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Checkout Items
            </h2>
            {cart.length === 0 ? (
              <p className="text-gray-800">Your cart is empty.</p>
            ) : (
              <div>
                <div className="grid grid-cols-1 gap-4">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="border rounded-md shadow-md p-4 flex items-center justify-between bg-white"
                    >
                      <div className="flex items-center">
                        <img
                          src={`${process.env.NEXT_PUBLIC_IMG_URL}${item.image}`}
                          alt={item.name}
                          className="w-16 h-16 mr-4 rounded-md"
                        />
                        <div>
                          <p className="text-gray-800 font-semibold">
                            {item.name}
                          </p>
                          <p className="text-gray-600">৳{item.price} each</p>
                          <p className="text-gray-600">
                            Total: {item.quantity} {item.unit} = ৳
                            {item.quantity * item.price}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
