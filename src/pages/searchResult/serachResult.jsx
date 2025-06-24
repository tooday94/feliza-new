import { useLocation } from "react-router-dom";
import { useGetById } from "../../services/query/useGetById";
import ProductCard from "../../components/ProductCart/ProductCard";
import { useTranslation } from "react-i18next";

const serachResult = () => {
  const { search } = useLocation();
  const { t } = useTranslation();
  const query = new URLSearchParams(search).get("search");
  const { data, isLoading } = useGetById("/api/product/searchProduct/", query);

  console.log(search);
  console.log(query);

  return (
    <div className="space-y-5 max-w-[1280px] mx-auto p-1">
      <div className="space-y-2">
        <h1 className="font-tenor font-normal text-xl text-primary">{query}</h1>
        <p className="font-tenor font-normal text-sm text-secondary">
          {data?.length} {t("looks.product")}
        </p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {data?.map((item) => (
          <ProductCard item={item} key={item.id} />
        ))}
      </div>
    </div>
  );
};

export default serachResult;
