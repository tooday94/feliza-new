import { useGetList } from "../../services/query/useGetList";
import { Button, Carousel, Skeleton } from "antd";
import { FaArrowRightLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const HomeLooks = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data, isLoading } = useGetList(
    "/api/lookCollection/getLookCollection"
  );

  const random6 = data?.sort(() => 0.5 - Math?.random())?.slice(0, 6);

  return (
    <div className="max-w-[1280px] mx-auto py-4 lg:py-16">
      <div className="hidden lg:flex">
        <div className="w-fit lg:pr-14 min-w-56 lg:min-w-[360px] flex flex-col justify-between">
          <div className="">
            <h1 className="text-xl lg:text-3xl font-normal font-tenor text-primary pb-5 uppercase">
              {t("looks.home.title")}
            </h1>
            <p className="max-w-[312px] font-normal text-base font-tenor leading-[180%] text-primary pb-[314px]">
              {t("looks.desc")}
            </p>
          </div>
          <Button
            onClick={() => (
              navigate("/looks"),
              window.scrollTo({ top: 0, behavior: "smooth" })
            )}
            iconPosition="end"
            icon={<FaArrowRightLong className="!mt-2" size={21} />}
            className="!font-tenor !text-lg !font-normal !px-7 !h-12 max-w-56"
            type="primary"
            children={t("looks.home.btn")}
          />
        </div>

        <div
          style={{ scrollbarWidth: "none" }}
          className="overflow-x-scroll flex gap-5 scroll-smooth cursor-pointer"
        >
          {random6?.map((item) => (
            <div
              className=""
              onClick={() => (
                navigate("/looksDetail/" + item.id),
                window.scrollTo({ top: 0, behavior: "smooth" })
              )}
            >
              <img
                loading="eager"
                className="max-w-sm"
                src={item.images[0].url}
                alt=""
              />
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col lg:hidden">
        <h1 className="text-xl lg:text-3xl font-normal font-tenor text-primary pb-5 uppercase">
          {t("looks.home.title")}
        </h1>

        <Carousel
          autoplay={{ dotDuration: true }}
          autoplaySpeed={4000}
          infinite
          draggable
          dotPosition="bottom"
        >
          {isLoading ? (
            <Skeleton.Image />
          ) : (
            random6?.map((item) => (
              <div
                className=""
                onClick={() => (
                  navigate("/looksDetail/" + item.id),
                  window.scrollTo({ top: 0, behavior: "smooth" })
                )}
              >
                <img
                  loading="eager"
                  className="w-full object-cover"
                  src={item.images[0].url}
                  alt=""
                />
              </div>
            ))
          )}
        </Carousel>

        <p className="font-normal text-sm font-tenor leading-[180%] text-primary p-[2px]">
          {t("looks.desc")}
        </p>
      </div>
    </div>
  );
};

export default HomeLooks;
