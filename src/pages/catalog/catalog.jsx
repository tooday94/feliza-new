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
  console.log("Feliza data", feliza);

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

  // const handleTouchEnd = () => {
  //   const distance = touchStartX.current - touchEndX.current;
  //   const threshold = 50;

  //   if (distance > threshold && activeTab < tabData.length - 1) {
  //     // swipe left
  //     setActiveTab((prev) => prev + 1);
  //   } else if (distance < -threshold && activeTab > 0) {
  //     // swipe right
  //     setActiveTab((prev) => prev - 1);
  //   }
  // };

  const handleTouchEnd = () => {
    const distance = touchStartX.current - touchEndX.current;
    const threshold = 50;

    // oddiy bosish bo'lsa hech narsa qilinmaydi
    if (Math.abs(distance) < threshold) return;

    if (distance > threshold && activeTab < tabData.length - 1) {
      setActiveTab((prev) => prev + 1);
    } else if (distance < -threshold && activeTab > 0) {
      setActiveTab((prev) => prev - 1);
    }
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
            <div
              // onClick={() => navigate(`/catalog/${item.id}/${i18n.language === "uz" ? item.nameUZB.replace(/\s+/g, "-") : item.nameRUS.replace(/\s+/g, "-")}`)}
              onClick={() => navigate(`/catalog/${i18n.language === "uz" ? item.nameUZB.replace(/\s+/g, "-") : item.nameRUS.replace(/\s+/g, "-")}`)}
              className="shadow-md flex gap-5 items-center font-tenor font-normal text-primary"
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
              <h1 key={idx} className="">
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
