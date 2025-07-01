import { useLocation } from "react-router-dom";
import { useGetById } from "../../services/query/useGetById";
import ProductCard from "../../components/ProductCart/ProductCard";
import { useTranslation } from "react-i18next";
import { Grid, Skeleton } from "antd";

const serachResult = () => {
  const { search } = useLocation();
  const { t } = useTranslation();
  const query = new URLSearchParams(search).get("search");
  const { data, isLoading } = useGetById("/api/product/searchProduct/", query);
  const width = Grid.useBreakpoint();

  return (
    <div className="space-y-5 max-w-[1280px] mx-auto p-1">
      {isLoading ? (
        <div
          style={{ scrollbarWidth: "none" }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3"
        >
          {Array.from({ length: width.md ? 4 : 2 }).map((item, index) => (
            <div key={index} className="space-y-2 w-full">
              <Skeleton.Image active className="!w-full !h-60 md:!h-[350px]" />
              <div className="">
                <Skeleton
                  active
                  round
                  title={false}
                  paragraph={{ rows: 3 }}
                  className="!w-full"
                  rows={2}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="space-y-2">
            <h1 className="font-tenor font-normal text-xl text-primary">
              {query}
            </h1>
            <p className="font-tenor font-normal text-sm text-secondary">
              {data?.length || 0} {t("looks.product")}
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {data?.map((item) => (
              <ProductCard item={item} key={item.id} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default serachResult;
