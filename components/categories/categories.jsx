"use client";

import Container from "@/app/container";
import React, { useState } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import Link from "next/link";

const CategoriesNavbar = () => {
  const [showMoreOptions, setShowMoreOptions] = useState(false);

  const toggleMoreOptions = () => {
    setShowMoreOptions(!showMoreOptions);
  };

  const closeMoreOptions = () => {
    setShowMoreOptions(false);
  };

  return (
    <div className="bg-gray-100 py-5">
      <Container>
        <ul className="flex flex-wrap justify-between font-semibold cursor-pointer mx-1">
          <Link href={"/vegetables"} className="mb-2 sm:mb-0">
            Vegetables
          </Link>
          <Link href={"/fruits"} className="mb-2 sm:mb-0">
            Fruits
          </Link>
          <Link href={"/packaged-products"} className="mb-2 sm:mb-0">
            Packaged Products
          </Link>
          <li className="mb-2 sm:mb-0">Bakery</li>
          <li className="mb-2 sm:mb-0">Breakfast Items</li>

          <li>
            <Dropdown>
              <DropdownTrigger>
                <p>More</p>
              </DropdownTrigger>
              <DropdownMenu aria-label="More Options">
                <DropdownItem key="staples" onClick={closeMoreOptions}>
                  Staples
                </DropdownItem>
                <DropdownItem key="beverages" onClick={closeMoreOptions}>
                  Beverages
                </DropdownItem>
                <DropdownItem key="flowers" onClick={closeMoreOptions}>
                  Flowers
                </DropdownItem>
                <DropdownItem key="packaged-food" onClick={closeMoreOptions}>
                  Packaged Food
                </DropdownItem>
                <DropdownItem
                  key="home-personal-care"
                  onClick={closeMoreOptions}
                >
                  Home & Personal Care
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </li>
        </ul>
      </Container>
    </div>
  );
};

export default CategoriesNavbar;