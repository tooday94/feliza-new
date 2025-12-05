import { useState } from "react";
import { useGetList } from "../../services/query/useGetList";
import { useTranslation } from "react-i18next";
import { MdOutlineImageNotSupported } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useSwipeable } from "react-swipeable";

const Catalog = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  // Data fetch
  const { data: nessa } = useGetList(
    "/api/categories/getSubCategoriesByParent/Nessa"
  );
  const { data: feliza } = useGetList("/api/categories/getParentCategories");
  const filterFeliza = feliza?.filter((item) => item.id !== 9);

  const tabData = [
    { label: "Feliza", catalogs: filterFeliza },
    { label: "Nessa", catalogs: nessa },
  ];

  const [activeTab, setActiveTab] = useState(0);

  // Swipe handler (mobile only)
  const handlers = useSwipeable({
    onSwipedLeft: () =>
      setActiveTab((prev) => Math.min(prev + 1, tabData.length - 1)),
    onSwipedRight: () => setActiveTab((prev) => Math.max(prev - 1, 0)),
    preventDefaultTouchmoveEvent: true,
    trackMouse: false, // faqat mobil sensor
  });

  return (
    <div className="max-w-5xl mx-auto mt-5 font-tenor font-normal text-primary">
      <h1 className="text-center text-2xl mb-5">
        {i18n.language === "uz" ? "Katalog" : "Каталог"}
      </h1>

      {/* Tabs */}
      <div className="flex px-3 gap-2 sticky top-0 bg-white z-10">
        {tabData.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`flex-1 py-2 text-center font-medium ${activeTab === index
              ? "border-b-2 border-primary"
              : "text-secondary"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content with mobile swipe */}
      <div {...handlers} className="p-4 transition-all duration-700 bg-background">
        <div className="space-y-4">
          {tabData[activeTab]?.catalogs?.map((item, idx) => (
            <div
              key={idx}
              onClick={() =>
                navigate(
                  `/catalog/${i18n.language === "uz"
                    ? item.nameUZB.replace(/\s+/g, "-")
                    : item.nameRUS.replace(/\s+/g, "-")
                  }`
                )
              }
              className="shadow-md flex gap-5 items-center font-tenor font-normal text-primary p-2 rounded-md cursor-pointer hover:bg-gray-50"
            >
              {item?.horizontalImage?.url ? (
                <img
                  className="w-36 h-24 object-cover"
                  src={item.horizontalImage.url}
                  alt=""
                />
              ) : (
                <div className="w-36 h-24 flex justify-center items-center border border-background">
                  <MdOutlineImageNotSupported size={24} />
                </div>
              )}
              <h1>
                {i18n.language === "uz" ? item?.nameUZB : item.nameRUS}
              </h1>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Catalog;
