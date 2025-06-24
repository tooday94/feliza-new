import { Link } from "react-router-dom";
import { useGetList } from "../../services/query/useGetList";
import ProductCard from "../ProductCart/ProductCard";
import { Button, Carousel, Skeleton } from "antd";
import { IoArrowForwardSharp } from "react-icons/io5";
import { useTranslation } from "react-i18next";

export const SmallSlider = ({ palcement }) => {
  const { i18n, t } = useTranslation();
  const { data, isLoading } = useGetList("/api/homePage/getHomePage");
  const FilteredSlider = data?.smallSliderResponseDtos?.filter(
    (item) => item.placeNumber === palcement
  );
  return (
    <div>
      <div className="p-2 max-w-[1280px] mx-auto">
        {isLoading ? (
          <div className="flex justify-between gap-3 overflow-x-scroll overflow-hidden">
            {Array.from({ length: 4 }).map((item, index) => (
              <div key={index} className="space-y-2 w-fit">
                <Skeleton.Image active className="!w-[284px] !h-[350px]" />
                <div className="">
                  <Skeleton
                    active
                    round
                    title={false}
                    paragraph={{ rows: 3 }}
                    className="!w-[284px]"
                    rows={2}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          FilteredSlider?.map((item) => (
            <div className="" key={item?.placeNumber}>
              <div className="flex justify-between items-center pb-8">
                <h1 className="font-tenor font-normal text-2xl">
                  {i18n.language == "uz"
                    ? item.categoryNameUZB
                    : item.categoryNameRUS}
                </h1>

                <Link to={`categoryDetail/${item.categoryId}`}>
                  <Button
                    className="!font-tenor !font-normal !text-base !border-none"
                    children={t("see-all")}
                    icon={<IoArrowForwardSharp />}
                    iconPosition="end"
                  />
                </Link>
              </div>
              <div
                style={{ scrollbarWidth: "none" }}
                className="flex gap-7 overflow-x-scroll"
              >
                {item?.productList.map((item) => (
                  <div className="w-full" key={item.id}>
                    <div className="min-w-[284px]">
                      <ProductCard key={item.id} item={item} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
