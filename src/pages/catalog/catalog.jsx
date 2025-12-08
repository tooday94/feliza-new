import { useState, useRef } from "react";
import { useGetList } from "../../services/query/useGetList";
import { useTranslation } from "react-i18next";
import { MdOutlineImageNotSupported } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const Catalog = () => {
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const { data: nessa } = useGetList(
    "/api/categories/getSubCategoriesByParent/Nessa"
  );
  const { data: feliza } = useGetList("/api/categories/getParentCategories");
  const filterFeliza = feliza?.filter((item) => item.id !== 9);

  const tabData = [
    {
      label: "Feliza",
      catalogs: filterFeliza,
    },
    {
      label: "Nessa",
      catalogs: nessa,
    },
  ];
  const [activeTab, setActiveTab] = useState(0);
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;

    const distance = touchStartX.current - touchEndX.current;
    const threshold = 50; // swipe bo‘lishi uchun minimal masofa

    // Masofa 50px dan kichik bo‘lsa — bu SWIPE EMAS → hech narsa qilmaymiz
    if (Math.abs(distance) < threshold) {
      touchStartX.current = null;
      touchEndX.current = null;
      return;
    }

    // Swipe left
    if (distance > threshold && activeTab < tabData.length - 1) {
      setActiveTab(prev => prev + 1);
    }

    // Swipe right
    if (distance < -threshold && activeTab > 0) {
      setActiveTab(prev => prev - 1);
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };


  return (
    <div className="max-w-5xl mx-auto mt-5 font-tenor font-normal text-primary">
      <h1 className="text-center text-2xl mb-5">
        {i18n.language == "uz" ? "Katalog" : "Каталог"}
      </h1>
      {/* Tabs */}
      <div className="flex px-3 gap-2 duration-500 sticky top-0 bg-white">
        {tabData?.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`flex-1 py-2 text-center font-medium ${activeTab === index ? "border-b-2 " : "text-secondary"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content with swipe */}
      <div
        className="p-4 transition-all duration-700 bg-background"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="space-y-4">
          {tabData[activeTab]?.catalogs?.map((item, idx) => (
            // <div
            //   onClick={() => navigate(`/catalog/${item.nameUZB}`)}
            //   className="shadow-md flex gap-5 items-center font-tenor font-normal text-primary"
            // >
            <div
              className="shadow-md flex gap-5 items-center font-tenor font-normal text-primary"
              onClick={(e) => {
                e.stopPropagation();

                if (item.id === 6) {
                  navigate(`/looks`);
                  setShowBoard(false);
                } else if (item.id === 7) {
                  navigate(`/categoryDetail/7/Sale`);
                  setShowBoard(false);
                } else {
                  navigate(`/catalog/${item.nameUZB}`);
                }
              }}
            >

              {item?.horizontalImage?.url ? (
                <img
                  className="w-36 h-24 object-cover"
                  src={item?.horizontalImage?.url}
                  alt=""
                />
              ) : (
                <div className="w-36 h-24 flex justify-center items-center border border-background">
                  <MdOutlineImageNotSupported size={24} />
                </div>
              )}
              <h1
                key={idx}
              >
                {i18n.language == "uz" ? item?.nameUZB : item.nameRUS}
              </h1>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Catalog;