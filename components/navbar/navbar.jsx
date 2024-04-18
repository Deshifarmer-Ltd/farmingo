"use client";

import React, { useState, useEffect } from "react";
import { FaSearch, FaMapMarkerAlt } from "react-icons/fa";
import { CiShoppingCart } from "react-icons/ci";
import Container from "@/app/container";
import LocationModal from "../modals/location-modal";
import LoginModal from "../modals/login-modal";
import CartSidebar from "../sidebar/cart-sidebar";
import { Button, Badge } from "@nextui-org/react";
import { useCart } from "@/contexts/cart/cart-context";
import Link from "next/link";

export default function NavbarWithSearch() {
  const [selectedZone, setSelectedZone] = useState(null);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isCartSidebarOpen, setIsCartSidebarOpen] = useState(false);
  const { cart } = useCart();

  useEffect(() => {
    const savedZone = localStorage.getItem("selectedZone");
    if (!savedZone) {
      setIsLocationModalOpen(true);
    } else {
      setSelectedZone(savedZone);
    }
  }, []);

  const handleZoneSelection = (zone) => {
    setSelectedZone(zone);
    setIsLocationModalOpen(false);
    localStorage.setItem("selectedZone", zone);
  };

  const closeLocationModal = () => {
    setIsLocationModalOpen(false);
  };

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const toggleCartSidebar = () => {
    setIsCartSidebarOpen(!isCartSidebarOpen);
  };

  const handleZoneButtonClick = () => {
    setIsLocationModalOpen(true);
  };

  return (
    <nav className="bg-[#152721]">
      <Container>
        <div className="md:flex lg:flex justify-between items-center px-4 py-4">
          <div className="flex items-center md:gap-10 lg:gap-10 gap-2">
            <Link href={"/"} className="font-bold text-white">
              LOGO
            </Link>
            <div className="relative">
              <input
                className="w-full md:w-[300px] lg:w-[600px] xl:w-[800px] h-10 px-3 pr-10 rounded-md focus:outline-none"
                type="search"
                placeholder="Search your fresh vegetables..."
              />
              <FaSearch className="absolute right-3 top-2/4 transform -translate-y-2/4 text-gray-400" />
            </div>
          </div>
          <div className="flex mt-5 md:mt-0 lg:mt-0 space-x-4 items-center">
            <button
              onClick={handleZoneButtonClick}
              className="flex items-center gap-2 cursor-pointer font-bold"
            >
              <FaMapMarkerAlt className="text-white cursor-pointer" />
              {selectedZone && (
                <div className="text-white mr-2">{`${selectedZone}`}</div>
              )}
            </button>

            <div className="flex items-center gap-5">
              <div>
                <Button
                  color="#FFFFFF"
                  variant="bordered"
                  className="text-white font-bold"
                  onClick={openLoginModal}
                >
                  Login
                </Button>
              </div>

              <div className="cursor-pointer" onClick={toggleCartSidebar}>
                <Badge
                  content={cart
                    .reduce((total, item) => total + item.quantity, 0)
                    .toString()}
                  color="warning"
                >
                  <CiShoppingCart className="text-white" size={30} />
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </Container>
      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={closeLocationModal}
        onZoneSelect={handleZoneSelection}
      />
      <CartSidebar isOpen={isCartSidebarOpen} toggle={toggleCartSidebar} />
    </nav>
  );
}