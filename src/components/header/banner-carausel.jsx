import { useGetList } from "../../services/query/useGetList";
import { Carousel, Skeleton } from "antd";
import { useNavigate } from "react-router-dom";

const BannerCarausel = () => {
  const { data, isLoading } = useGetList("/api/karusel/getAllKarusels");
  const navigate = useNavigate();

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
        // easing="linear"
        // effect="fade"
        >
          {data?.map((item) => (
            <div
              className="max-h-[610px]"
              onClick={() =>
                navigate(
                  item.karuselType == "category_id" &&
                  `/categoryDetail/${item.parameterId}`
                )
              }
              key={item.id}
            >
              <img
                className="object-center w-full h-full"
                src={item.productImages.url}
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
