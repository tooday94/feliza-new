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
          {/* Добавляем index, чтобы определить первый слайд */}
          {data?.map((item, index) => {
             // 1. Определяем, какую картинку брать (десктоп или мобилка)
             const rawUrl = width.md ? item?.desktopImage?.url : item?.productImages?.url;
             
             // 2. Задаем ширину для оптимизации: 1500px для ПК, 800px для телефона
             const targetWidth = width.md ? 1500 : 800;

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
                  // 3. ПРИМЕНЯЕМ ОПТИМИЗАЦИЮ
                  src={getOptimizedImageUrl(rawUrl, targetWidth)}
                  
                  // 4. УСКОРЕНИЕ LCP (Первый экран)
                  // Если это первая картинка (index 0) - грузим сразу и с высоким приоритетом
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
