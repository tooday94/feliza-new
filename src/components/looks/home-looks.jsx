import { useGetList } from "../../services/query/useGetList";
import { Button, Carousel, Skeleton } from "antd";
import { FaArrowRightLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
// Импортируем оптимизатор
import { getOptimizedImageUrl } from "../../utils/imageOptimizer";

const HomeLooks = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data, isLoading } = useGetList(
    "/api/lookCollection/getLookCollection"
  );

  // Сортировка по дате (сначала новые)
  const random6 = data?.sort((a, b) => {
    return new Date(b.images?.[0]?.createdAt) - new Date(a.images?.[0]?.createdAt);
  })?.slice(0, 7);

  return (
    <div className="max-w-[1280px] mx-auto py-4 lg:py-16">
      {/* ----------------- DESKTOP VERSION ----------------- */}
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
            onClick={() => {
              navigate("/looks");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
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
              key={item.id}
              onClick={() => {
                navigate("/looksDetail/" + item.id);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              <img
                // 🔥 ОПТИМИЗАЦИЯ ДЛЯ ПК: 384x576
                src={getOptimizedImageUrl(item.images[0].url, 384, 576)}
                
                // Ленивая загрузка (так как блок не в самом верху)
                loading="lazy"
                
                className="max-w-sm w-[384px] h-[576px] object-cover"
                alt="Look"
              />
            </div>
          ))}
        </div>
      </div>

      {/* ----------------- MOBILE VERSION ----------------- */}
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
            <Skeleton.Image className="!w-full !h-[645px]" />
          ) : (
            random6?.map((item) => (
              <div
                className=""
                key={item.id}
                onClick={() => {
                  navigate("/looksDetail/" + item.id);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                <img
                  // 🔥 ОПТИМИЗАЦИЯ ДЛЯ МОБИЛОК: 430x645
                  src={getOptimizedImageUrl(item.images[0].url, 430, 645)}
                  
                  loading="lazy"
                  
                  className="w-full h-[645px] object-cover"
                  alt="Look"
                />
              </div>
            ))
          )}
        </Carousel>

        <p className="font-normal text-sm font-tenor leading-[180%] text-primary p-[2px] mt-4">
          {t("looks.desc")}
        </p>
      </div>
    </div>
  );
};

export default HomeLooks;
