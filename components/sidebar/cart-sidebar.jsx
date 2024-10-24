"use client";

import React, { useEffect, useRef, useState } from "react";
import { RiCloseLine } from "react-icons/ri";
import { IoMdRemove, IoMdAdd } from "react-icons/io";
import { AiOutlineDelete } from "react-icons/ai";
import { useCart } from "@/contexts/cart/cart-context";
import toast from "react-hot-toast";
import Link from "next/link";

const CartSidebar = ({ isOpen, toggle }) => {
  const sidebarRef = useRef(null);
  const { cart, removeItemFromCart, decreaseQuantity, addItemToCart } =
    useCart();

  useEffect(() => {
    const handleOutsideClick = (event) => {
      // Close the sidebar if clicking outside of it
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        toggle(); // Call the toggle function to close the sidebar
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen, toggle]);

  const handleAddQuantity = (item) => {
    const updatedItem = { ...item, quantity: item.quantity + 1 };
    addItemToCart(updatedItem);
  };

  const handleRemoveQuantity = (item) => {
    if (item.quantity === 1) {
      removeItemFromCart(item);
    } else {
      const updatedItem = { ...item, quantity: item.quantity - 1 };
      decreaseQuantity(updatedItem);
    }
  };

  const handleDeleteItem = (item) => {
    removeItemFromCart(item);
    toast.error("Removed From Cart");
  };

  return (
    <div
      ref={sidebarRef}
      className={`fixed inset-y-0 right-0 z-50 w-full md:w-80 bg-gray-300 shadow-lg overflow-y-auto transition-transform duration-300 ease-in-out transform ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex justify-between items-center px-4 py-2 border-b border-gray-200">
        <button
          aria-label="Close cart"
          className="text-red-600 focus:outline-none"
          onClick={toggle} // Ensure this function closes the sidebar
        >
          <RiCloseLine size={25} />
        </button>
      </div>
      <div className="px-4 py-6">
        {cart.length === 0 ? (
          <p className="text-gray-800">Your cart is empty.</p>
        ) : (
          <div>
            <ul>
              {cart.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between mb-4"
                >
                  <div className="flex items-center">
                    <img
                      src={`${process.env.NEXT_PUBLIC_IMG_URL}${item.image}`}
                      alt={item.name}
                      className="w-12 h-12 mr-4 rounded-md"
                    />
                    <div>
                      <p className="text-gray-800">{item.name}</p>
                      <p className="text-gray-600">৳{item.price}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <button
                      aria-label="Decrease quantity"
                      className="text-gray-600 focus:outline-none"
                      onClick={() => handleRemoveQuantity(item)}
                    >
                      <IoMdRemove className="w-6 h-6" />
                    </button>
                    <span className="mx-2">{item.quantity}</span>
                    <button
                      aria-label="Increase quantity"
                      className="text-gray-600 focus:outline-none"
                      onClick={() => handleAddQuantity(item)}
                    >
                      <IoMdAdd className="w-6 h-6" />
                    </button>
                    <button
                      aria-label="Remove item"
                      className="text-gray-600 focus:outline-none ml-4"
                      onClick={() => handleDeleteItem(item)}
                    >
                      <AiOutlineDelete className="w-6 h-6" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <Link href={"/checkout"}>
              <button
                onClick={toggle}
                className="bg-green-600 text-white px-4 py-2 rounded-md mt-4 w-full"
              >
                Proceed to Payment
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartSidebar;
