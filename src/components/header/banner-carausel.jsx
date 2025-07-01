import { useGetList } from "../../services/query/useGetList";
import { Carousel, Grid, Skeleton } from "antd";
import { useNavigate } from "react-router-dom";

const BannerCarausel = () => {
  const { data, isLoading } = useGetList("/api/karusel/getAllKarusels");
  const navigate = useNavigate();
  const width = Grid.useBreakpoint();

  return (
    <div>
      {isLoading ? (
        <Skeleton.Image active className="!w-full min-h-[610px]" />
      ) : (
        <Carousel
          autoplay={{ dotDuration: true }}
          autoplaySpeed={4000}
          pauseOnHover={false}
          lazyLoad="progressive"
          draggable
          style={{ height: 610 }}
          // easing="linear"
          // effect="fade"
        >
          {data?.map((item) => (
            <div
              className="max-h-[610px]"
              onClick={() =>
                navigate(
                  item.karuselType === "category_id"
                    ? `/categoryDetail/${item.parameterId}`
                    : item.karuselType === "look_id"
                    ? `/looksDetail/${item.parameterId}`
                    : item.karuselType === "product_id"
                    ? `/productDetail/${item.parameterId}`
                    : "/"
                )
              }
              key={item.id}
            >
              <img
                loading="lazy"
                className="w-full object-cover h-full min-h-[610px] max-h-[610px]"
                src={
                  width.md ? item?.desktopImage.url : item?.productImages.url
                }
                alt=""
              />
            </div>
          ))}
        </Carousel>
      )}
    </div>
  );
};

export default BannerCarausel;
