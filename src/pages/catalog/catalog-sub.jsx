import { useNavigate, useParams } from "react-router-dom";
import { useGetById } from "../../services/query/useGetById";
import { MdArrowBackIos, MdOutlineImageNotSupported } from "react-icons/md";
import { useTranslation } from "react-i18next";
import { Button } from "antd";

const CatalogSub = () => {
  const { id } = useParams();
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const { data } = useGetById("/api/categories/getSubCategoriesByParent/", id);
  console.log("Sub categories data", data);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="py-2 border-b sticky top-0 bg-white">
        <Button
          onClick={() => navigate("/catalogs")}
          className="!font-tenor !text-xl !shadow-none !border-none"
          icon={<MdArrowBackIos />}
          children={i18n.language == "uz" ? "Katalog" : "Каталог"}
        />
      </div>
      <div className="p-3">
        {data?.length != 0 ? (
          <div className="space-y-4">
            {data?.map((item, idx) => (
              <div
                onClick={() => navigate(`/categoryDetail/${item.id}/${i18n.language === "uz" ? item.nameUZB.replace(/\s+/g, "-") : item.nameRUS.replace(/\s+/g, "-")}`)}
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
        ) : (
          <div className="h-screen">
            <h1 className="font-tenor text-lg text-center">
              {i18n.language == "uz"
                ? "Mahsulotlar qo'shish jarayonida"
                : "В процессе добавления продуктов"}
            </h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default CatalogSub;
