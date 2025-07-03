import { Link } from "react-router-dom";
import { useGetList } from "../../services/query/useGetList";
import ProductCard from "../ProductCart/ProductCard";
import { Button, Carousel, Skeleton } from "antd";
import { IoArrowBackSharp, IoArrowForwardSharp } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";

export const SmallSlider = ({ palcement }) => {
  const { i18n, t } = useTranslation();
  const { data, isLoading } = useGetList("/api/homePage/getHomePage");
  const FilteredSlider = data?.smallSliderResponseDtos?.filter(
    (item) => item.placeNumber === palcement
  );

  const carouselRef = useRef();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [visibleSlides, setVisibleSlides] = useState(4);

  useEffect(() => {
    const updateVisibleSlides = () => {
      const width = window.innerWidth;
      if (width < 480) setVisibleSlides(1);
      else if (width < 768) setVisibleSlides(2);
      else if (width < 1024) setVisibleSlides(2);
      else setVisibleSlides(4);
    };
    updateVisibleSlides();
    window.addEventListener("resize", updateVisibleSlides);
    return () => window.removeEventListener("resize", updateVisibleSlides);
  }, []);

  const next = () => carouselRef.current.next();
  const prev = () => carouselRef.current.prev();
  return (
    <div>
      <div className="p-2 max-w-[1280px] mx-auto">
        {isLoading ? (
          <div
            style={{ scrollbarWidth: "none" }}
            className="flex justify-between gap-3 overflow-x-scroll overflow-hidden"
          >
            {Array.from({ length: 4 }).map((item, index) => (
              <div key={index} className="space-y-2 w-fit">
                <Skeleton.Image active className="!w-[284px] !h-[350px]" />
                <div className="">
                  <Skeleton
                    active
                    round
                    title={false}
                    paragraph={{ rows: 3 }}
                    className="!w-[284px]"
                    rows={2}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          FilteredSlider?.map((item) => {
            const isAtStart = currentSlide == 0;
            const isAtEnd =
              currentSlide >= item?.productList?.length - visibleSlides;
            return (
              <div className="" key={item?.placeNumber}>
                <div className="flex justify-between items-center pb-8 ">
                  <h1 className="font-tenor font-normal text-2xl">
                    {i18n.language == "uz"
                      ? item.categoryNameUZB
                      : item.categoryNameRUS}
                  </h1>

                  <Link to={`categoryDetail/${item.categoryId}`}>
                    <Button
                      className="!font-tenor !font-normal !text-base !border-none !shadow-none"
                      children={t("see-all")}
                      icon={<IoArrowForwardSharp />}
                      iconPosition="end"
                    />
                  </Link>
                </div>

                <div
                  style={{ scrollbarWidth: "none" }}
                  className="flex gap-7 overflow-x-scroll md:hidden"
                >
                  {item?.productList.map((item) => (
                    <div className="w-full" key={item.id}>
                      <div className="min-w-[284px]">
                        <ProductCard key={item.id} item={item} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="relative hidden md:block w-full max-w-[1280px] mx-auto overflow-hidden">
                  <button
                    className={`cursor-pointer absolute left-3 top-1/2 z-50 bg-white p-2.5 shadow-lg transition-all duration-300 ease-in-out 
    ${
      isAtStart ? "opacity-0  pointer-events-none" : "opacity-100 translate-x-0"
    }`}
                    onClick={prev}
                  >
                    <IoArrowBackSharp size={20} />
                  </button>

                  <button
                    className={`cursor-pointer absolute right-3 top-1/2 z-50 bg-white p-2.5 shadow-lg transition-all duration-300 ease-in-out 
    ${
      isAtEnd
        ? "opacity-0 translate-x-8 pointer-events-none"
        : "opacity-100 translate-x-0"
    }`}
                    onClick={next}
                  >
                    <IoArrowForwardSharp size={20} />
                  </button>

                  <Carousel
                    className="!m-0 !p-0 !w-full"
                    ref={carouselRef}
                    dots={false}
                    infinite={false}
                    speed={500}
                    draggable
                    swipeToSlide
                    slidesToShow={visibleSlides}
                    slidesToScroll={visibleSlides}
                    afterChange={(current) => setCurrentSlide(current)}
                  >
                    {item?.productList.map((item) => (
                      <div className="w-full" key={item.id}>
                        <div className="min-w-[284px] mr-6">
                          <ProductCard key={item.id} item={item} />
                        </div>
                      </div>
                    ))}
                  </Carousel>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};