import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetList } from "../../services/query/useGetList";
import { useTranslation } from "react-i18next";
import { Skeleton } from "antd";
import { FiAlertCircle } from "react-icons/fi"; // yoki istalgan icon


export const HeaderBoard = ({ setShowBoard, setBrandName, brand }) => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  const [activeParent, setActiveParent] = useState(8);
  const [parentName, setParentName] = useState(null);

  // Parent categories
  const { data: parents, isLoading } = useGetList("/api/categories/getParentCategories");
  const filteredParents = parents?.filter((item) => item.id !== 9);

  // Sub categories by selected parent name
  const { data: subCategories } = useGetList(
    parentName ? `/api/categories/getSubCategoriesByParent/${parentName}` : null, {}, !!parentName
  );

  // console.log("Sub categories:", parents);
  // Set initial parent name when brand prop changes
  useEffect(() => {
    setParentName(brand);
    // // setActiveParent(null);
    // if (!brand) {
    //   setActiveParent(8)
    // }
  }, [brand]);

  const handleParentClick = (item) => {
    setActiveParent(item.id);
    setParentName(i18n.language === "uz" ? item.nameUZB : item.nameRUS);
  };

  const handleNavigate = (id, name) => {
    setShowBoard(false);
    setBrandName("");
    navigate(`/categoryDetail/${id}/${name.replace(/\s+/g, "-")}`);
  };

  return (
    <div className="absolute bg-white w-full min-h-[400px] shadow-sm p-6 flex">

      {/* Parent Categories Column */}
      <div className="w-1/4 border-r pr-4" hidden={parentName === `Nessa` ? true : false}>
        {isLoading
          ? [...Array(6)].map((_, i) => (
            <Skeleton.Input key={i} active size="small" className="!w-full my-2" />
          ))
          : filteredParents?.map((item) => (
            <button
              key={item.id}
              // onClick={() => handleParentClick(item)}
              onClick={() => {
                if (item.id === 6) {
                  navigate(`/looks`)
                  setShowBoard(false)
                } else if (item.id === 7) {
                  navigate(`/categoryDetail/7/Sale`)
                  setShowBoard(false)
                } else {
                  handleParentClick(item)
                }
              }}
              className={`w-full text-left font-tenor text-base cursor-pointer transition-all my-1 py-2 px-3 rounded-md ${activeParent === item.id
                ? "text-white bg-primary shadow"
                : "text-gray-600 hover:text-primary hover:bg-gray-100"
                }`}
            >
              {i18n.language === "uz" ? item.nameUZB : item.nameRUS}
            </button>
          ))}
      </div>

      {/* Sub Categories Table */}
      <div className="w-3/3 pl-10">
        {!parentName ? (
          <p className="text-gray-400 text-center py-10">
            {i18n.language === "uz" ? "Kategoriya tanlang" : "Выберите категорию"}
          </p>
        ) : subCategories?.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {subCategories.map((sub) => (
              <div
                key={sub.id}
                onClick={() =>
                  handleNavigate(
                    sub.id,
                    i18n.language === "uz" ? sub.nameUZB : sub.nameRUS
                  )
                }
                className="cursor-pointer text-gray-700 hover:text-primary hover:underline transition-all p-2 rounded-md"
              >
                {i18n.language === "uz" ? sub.nameUZB : sub.nameRUS}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            {/* Pulsating circle */}
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-primary"></div>

            {/* Optional: subtle dots animation */}
            <div className="flex space-x-2">
              <span className="animate-bounce inline-block h-2 w-2 bg-primary rounded-full"></span>
              <span className="animate-bounce animation-delay-150 inline-block h-2 w-2 bg-primary rounded-full"></span>
              <span className="animate-bounce animation-delay-300 inline-block h-2 w-2 bg-primary rounded-full"></span>
            </div>
          </div>


        )}
      </div>

    </div>
  );
};
