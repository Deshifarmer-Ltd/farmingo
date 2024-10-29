"use client";

import { useState, useEffect } from "react";
import ProductCard from "@/components/product-card/product-card";
import Container from "./container";
import Link from "next/link";
import { ROUTES } from "@/routes/routes";
import CategoriesNavbar from "@/components/categories/categories";
import Loading from "./loading";
import ImageSlider from "@/components/slider/Slider";
import Footer from "@/components/footer/footer";
import Slider from "react-slick";

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from the API
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}${ROUTES.CATEGORY_PRODUCTS}`
        );
        const data = await response.json();

        // Update state with categories
        setCategories(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <Loading />;
  }

  // Slider settings for desktop screens
  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
    draggable: false,
  };

  // Function to sort products, putting the "Vegetables" category first
  const sortCategories = (categories) => {
    return categories.sort((a, b) => {
      const isAVegetableCategory = a.name.includes("Vegetables");
      const isBVegetableCategory = b.name.includes("Vegetables");

      if (isAVegetableCategory && !isBVegetableCategory) {
        return -1; // a comes first
      }
      if (!isAVegetableCategory && isBVegetableCategory) {
        return 1; // b comes first
      }
      return 0; // keep original order for other categories
    });
  };

  // Sort categories to prioritize vegetables
  const sortedCategories = sortCategories(categories);

  return (
    <main>
      <div className="fixed md:top-16 w-full z-50 bg-white">
        <CategoriesNavbar />
      </div>

      <div className="lg:pt-10 md:pt-5 pt-28">
        <ImageSlider />
      </div>

      <Container>
        <div className="pb-10 space-y-10 mx-auto">
          {sortedCategories.map((category) => (
            <section key={category.id}>
              <div className="flex justify-between items-center p-2 mx-2">
                <h2 className="font-bold text-green-800 text-1xl lg:text-2xl ">
                  {category.name}
                </h2>
                <Link
                  href={`/category/${category.id}?name=${encodeURIComponent(
                    category.name
                  )}`}
                  className="border border-green-400 rounded-lg capitalize font-semibold"
                >
                  See More
                </Link>
              </div>

              {/* Mobile view */}
              <div className="block lg:hidden mx-4 overflow-x-auto">
                <div className="flex space-x-4">
                  {category.products.slice(0, 14).map((product) => (
                    <div key={product.id} className="flex-shrink-0 w-44">
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Desktop view */}
              <div className="hidden lg:block">
                <Slider {...sliderSettings}>
                  {category.products.slice(0, 14).map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </Slider>
              </div>
            </section>
          ))}
        </div>
      </Container>

      <Footer />
    </main>
  );
}
