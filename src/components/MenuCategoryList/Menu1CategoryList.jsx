import { useGetList } from "./../../services/query/useGetList";
import { endpoints } from "./../../configs/endpoints";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { transliterate as tr } from 'transliteration';


const handleNavigate = (id, name, lang) => {
  // Agar o'zbekcha nom bo'lsa, faqat bo'sh joyni "-" bilan almashtiramiz
  const slug = lang === "uz"
    ? name.replace(/\s+/g, "-")
    : tr(name).toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

  navigate(`/categoryDetail/${id}/${slug}`);
};

function Menu1CategoryList() {
  const navigate = useNavigate();
  const { data, isLoading } = useGetList(
    endpoints.category.categoryBlocks.getCategoryByBlockTypeMenu_1,
    {}
  );
  console.log("MenuCategory1", data);
  const { i18n } = useTranslation();

  const skeletonItems = Array.from({ length: 5 });

  if (isLoading) {
    return (
      <div
        style={{ scrollbarWidth: "none" }}
        className="max-w-[1280px] mx-auto px-4 py-8 overflow-x-auto scrollbar-hide"
      >
        <div className="flex gap-4 sm:gap-6 w-max">
          {skeletonItems.map((_, index) => (
            <div
              key={index}
              className="min-w-[180px] sm:min-w-[240px] h-[180px] sm:h-[240px] bg-gray-200 rounded-md animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  const sortedData = data?.sort(
    (a, b) => a.placementNumber - b.placementNumber
  );

  return (
    <div className="max-w-[1280px] w-full mx-auto py-8 overflow-x-auto font-tenor scrollbar-hide">
      <div
        className="flex gap-2 sm:gap-4 w-max"
        style={{
          scrollbarWidth: "none",
        }}
      >
        {sortedData?.map((item, index) => (
          <div
            key={index}
            // onClick={() => {
            //   navigate(`/categoryDetail/${item.category.id}/${i18n.language === "uz" ? item.category.nameUZB.replace(/\s+/g, "-") : item.category.nameRUS.replace(/\s+/g, "-")}`);
            //   window.scrollTo({ top: 0, behavior: "smooth" });
            // }}
            onClick={() => {
              // Ruscha nom bo‘lsa transliterate qilish
              const name = i18n.language === "uz" ? item.category.nameUZB : item.category.nameRUS;
              const slug = i18n.language === "uz"
                ? name.replace(/\s+/g, "-")
                : tr(name).toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

              navigate(`/categoryDetail/${item.category.id}/${slug}`);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="w-[45vw] sm:w-[240px] sm:h-[240px] relative group overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer scrollbar-hide"
            style={{
              scrollbarWidth: "none",
            }}
          >
            <img
              src={item.category.verticalImage?.url}
              alt={
                i18n.language === "uz"
                  ? item.category.nameRUS
                  : item.category.nameUZB
              }
              className="w-full h-[190px] sm:h-[240px] object-cover"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent flex items-center group-hover:items-end justify-center transition-all duration-500">
              <h2 className="text-white group-hover:text-[#0D0D0D] text-sm sm:text-base font-bold text-center group-hover:mb-4 mb-0 px-2">
                {i18n.language === "uz"
                  ? item.category.nameUZB
                  : item.category.nameRUS}
              </h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Menu1CategoryList;
