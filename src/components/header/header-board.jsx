import { useNavigate } from "react-router-dom";
import { useGetList } from "../../services/query/useGetList";
import { useTranslation } from "react-i18next";
import { Skeleton } from "antd";
import { endpoints } from "../../configs/endpoints";

export const HeaderBoard = ({ brand, setShowBoard, setBrandName }) => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const { data, isLoading } = useGetList(
    endpoints.category.getSubCategoriesByParent + brand
  );

  const handleNavigate = (id) => {
    setShowBoard(false);
    setBrandName("");
    navigate(`categoryDetail/${id}`);
  };

  return (
    <div className="min-h-[430px] h-fit absolute bg-white w-full">
      {isLoading ? (
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-1 h-full overflow-x-auto">
          {[...Array(8)].map((_, colIndex) => (
            <div
              key={colIndex}
              className="break-inside-avoid p-2 h-full border-r px-10 space-y-3"
            >
              {[...Array(5)].map((_, itemIndex) => (
                <div key={itemIndex} className="">
                  <Skeleton.Input active size="small" className="!w-full" />
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-1 h-full overflow-x-auto">
          {data?.map((item, index) => (
            <div
              key={index}
              className="break-inside-avoid p-2 h-full border-r pl-10"
            >
              <button onClick={() => handleNavigate(item.id)}>
                <p className="font-tenor font-normal text-base text-secondary hover:text-primary cursor-pointer">
                  {i18n.language == "uz" ? item.nameUZB : item.nameRUS}
                </p>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
