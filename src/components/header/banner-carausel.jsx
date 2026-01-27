import { useGetList } from "../../services/query/useGetList";
import { Carousel, Grid, Skeleton } from "antd";
import { useNavigate } from "react-router-dom";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { getOptimizedImageUrl } from "../../utils/imageOptimizer";

const BannerCarausel = () => {
  const { data, isLoading } = useGetList("/api/karusel/getAllKarusels");
  const navigate = useNavigate();
  const width = Grid.useBreakpoint();

  const PrevArrow = ({ onClick }) => {
    return (
      <div
        onClick={onClick}
        className="w-14 h-14 hover:text-black cursor-pointer text-white flex items-center justify-center absolute left-2 top-1/2 -translate-y-1/2 z-20"
      >
        <LeftOutlined className="text-white text-xl" />
      </div>
    );
  };

  const NextArrow = ({ onClick }) => {
    return (
      <div
        onClick={onClick}
        className="w-14 h-14 hover:text-black cursor-pointer text-white flex items-center justify-center absolute right-2 top-1/2 -translate-y-1/2 z-20"
      >
        <RightOutlined className="text-white text-xl" />
      </div>
    );
  };

  return (
    <div>
      {isLoading ? (
        <Skeleton.Image active className="!w-full min-h-[610px]" />
      ) : (
        <Carousel
          arrows
          prevArrow={<PrevArrow />}
          nextArrow={<NextArrow />}
          autoplay={{ dotDuration: true }}
          autoplaySpeed={4000}
          pauseOnHover={false}
          draggable
          style={{ height: 610 }}
        >
          {data?.map((item, index) => {
            // 1. Выбираем картинку
            const rawUrl = width.md ? item?.desktopImage?.url : item?.productImages?.url;

            // 2. 🔥 ЗАДАЕМ РАЗМЕРЫ (Ширина и Высота)
            // Если десктоп (md): 1440 x 610
            // Если мобилка: 430 x 610
            const targetWidth = width.md ? 1440 : 430;
            const targetHeight = 610; 

            return (
              <div
                className="max-h-[610px]"
                onClick={() =>
                  navigate(
                    item.karuselType === "category_id"
                      ? `/categoryDetail/${item.parameterId}/banner`
                      : item.karuselType === "look_id"
                      ? `/looksDetail/${item.parameterId}`
                      : item.karuselType === "product_id"
                      ? `/productDetail/${item.parameterId}/banner`
                      : "/"
                  )
                }
                key={item.id}
              >
                <img
                  // Передаем и ширину, и высоту!
                  src={getOptimizedImageUrl(rawUrl, targetWidth, targetHeight)}
                  
                  // Первый слайд грузим сразу (LCP), остальные лениво
                  loading={index === 0 ? "eager" : "lazy"}
                  fetchPriority={index === 0 ? "high" : "auto"}
                  
                  className="w-full object-cover h-full min-h-[610px] max-h-[610px]"
                  alt="Banner"
                />
              </div>
            );
          })}
        </Carousel>
      )}
    </div>
  );
};

export default BannerCarausel;
