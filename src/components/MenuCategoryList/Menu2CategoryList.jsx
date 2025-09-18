import { useGetList } from "../../services/query/useGetList";
import { endpoints } from "../../configs/endpoints";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { useRef } from "react";

function Menu2CategoryList() {
  const navigate = useNavigate();
  const { data, isLoading } = useGetList(
    endpoints.category.categoryBlocks.getCategoryByBlockTypeMenu_2,
    {}
  );
  const { i18n } = useTranslation();
  const containerRef = useRef(null);

  const skeletonItems = Array.from({ length: 4 });

  if (isLoading) {
    return (
      <div
        style={{ scrollbarWidth: "none" }}
        className="overflow-x-auto scrollbar-hide py-6"
      >
        <div className="flex gap-6 w-max px-4 max-w-[1280px] mx-auto">
          {skeletonItems.map((_, index) => (
            <div
              key={index}
              className="w-[360px] h-[564px] bg-gray-200 animate-pulse flex-shrink-0"
            />
          ))}
        </div>
      </div>
    );
  }

  const sortedData = data?.sort((a, b) => a.placementNumber - b.placementNumber);

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -360, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: 360, behavior: "smooth" });
    }
  };

  return (
    <div className="relative max-w-[1280px] mx-auto">
      {/* Chap tugma (faqat desktopda ko‘rinadi) */}
      <button
        onClick={scrollLeft}
        className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 
                   bg-white/80 hover:bg-white text-black px-3 py-2 shadow-md z-10"
      >
        <AiOutlineLeft size={20} />
      </button>

      {/* Scrollable container */}
      <div
        ref={containerRef}
        className="flex overflow-x-auto scrollbar-hide py-6 font-tenor scroll-smooth"
        style={{ scrollbarWidth: "none" }}
      >
        {sortedData?.map((item, indx) => (
          <div
            onClick={() =>
              navigate(
                `/categoryDetail/${item.category.id}`,
                window.scrollTo({ top: 0, behavior: "smooth" })
              )
            }
            key={indx}
            className="flex-shrink-0 md:w-[360px] w-[240px] cursor-pointer group relative mr-2"
          >
            <img
              src={item.category.verticalImage?.url}
              alt={
                i18n.language === "uz"
                  ? item.category.nameUZB
                  : item.category.nameRUS
              }
              className="w-full h-[400px] md:h-[564px] object-cover"
            />
            <div className="absolute inset-0 bg-[#0000004D] group-hover:bg-transparent flex items-center group-hover:items-end justify-center transition-all duration-500">
              <h2 className="text-white group-hover:text-[#0D0D0D] text-2xl w-[100px] font-bold text-center group-hover:mb-4 mb-0 px-2">
                {i18n.language === "uz"
                  ? item.category.nameUZB
                  : item.category.nameRUS}
              </h2>
            </div>
          </div>
        ))}
      </div>

      {/* O‘ng tugma (faqat desktopda ko‘rinadi) */}
      <button
        onClick={scrollRight}
        className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 
                   bg-white/80 hover:bg-white text-black px-3 py-2 shadow-md z-10"
      >
        <AiOutlineRight size={20} />
      </button>
    </div>
  );
}

export default Menu2CategoryList;
