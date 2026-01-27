import { useGetList } from "./../../services/query/useGetList";
import { endpoints } from "./../../configs/endpoints";
import { useTranslation } from "react-i18next";
import { IoArrowForwardOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import ProductCard from "../ProductCart/ProductCard";
import { Carousel, Grid } from "antd"; // 1. Добавляем Grid
import { transliterate as tr } from 'transliteration';
// 2. Импортируем оптимизатор
import { getOptimizedImageUrl } from "../../utils/imageOptimizer"; 

function NessaHome() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  // 3. Хук для проверки размера экрана
  const screens = Grid.useBreakpoint();

  const { data, isLoading } = useGetList(
    endpoints.products.getProductByCategoryId + 9,
    { page: 0, size: 10 }
  );
  const { data: categoryData, isLoading: isLoadingCategory } = useGetList(
    "/api/categories/getCategoryById/9"
  );

  if (isLoading || isLoadingCategory || !data || !categoryData) {
    return <div className="text-center py-10">Loading...</div>;
  }

  // 4. Логика размеров для Большой Карусели (слева)
  // ПК: 680x690
  // Моб: 415x490
  const carouselWidth = screens.md ? 680 : 415;
  const carouselHeight = screens.md ? 690 : 490;

  return (
    <div className="flex flex-col md:flex-row gap-4 md:gap-10 items-start font-tenor p-2 md:p-10">
      <h2 className="text-xl font-normal text-[#0D0D0D] md:hidden">NESSA</h2>
      
      {/* Left image div (Большая карусель) */}
      <div className="md:w-1/2 w-full">
        <Carousel autoplay autoplaySpeed={4000} draggable>
          {/* Первая картинка */}
          <img
            
            src={getOptimizedImageUrl(
              categoryData?.object?.verticalImage?.url, 
              carouselWidth, 
              carouselHeight
            )}
            
            loading="lazy"
            alt={categoryData?.object?.nameUZB || "NESSA"}
            className="w-full object-cover h-[488px] md:h-[690px]"
          />
          
          {/* Вторая картинка */}
          <img
            // 🔥 ОПТИМИЗАЦИЯ
            src={getOptimizedImageUrl(
              categoryData?.object?.horizontalImage?.url, 
              carouselWidth, 
              carouselHeight
            )}
            
            loading="lazy"
            alt={categoryData?.object?.nameUZB || "NESSA"}
            className="w-full object-cover h-[488px] md:h-[690px]"
          />
        </Carousel>
      </div>

      {/* Right content div */}
      <div className="md:w-1/2 w-full space-y-6">
        <h2 className="text-3xl font-normal text-primary hidden md:block">
          NESSA
        </h2>
        <p className="text-primary text-base md:pt-3">
          {i18n.language === "uz"
            ? " Nessadan yangi mahsulotlarni birinchilardan bo’lib ko’ring."
            : "Сначала посмотрите на новинки от Nessa."}
        </p>
        <button
          onClick={() => {
            const name = i18n.language === "uz" ? categoryData?.object?.nameUZB : categoryData?.object?.nameRUS;
            const slug = i18n.language === "uz"
              ? name.replace(/\s+/g, "-")
              : tr(name).toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

            navigate(`/categoryDetail/9/${slug}`);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="flex md:mt-20 mt-5 cursor-pointer items-center gap-2 py-2 px-6 border border-primary hover:bg-primary hover:text-white transition duration-300"
        >
          {i18n.language === "uz" ? "Nessa katalog" : "Каталог Nessa"}{" "}
          <IoArrowForwardOutline />
        </button>

        {/* Product list uchun */}
        <div
          className="flex gap-4 overflow-x-auto pb-2"
          style={{
            scrollbarWidth: "none",
          }}
        >
          {data?.content?.map((item) => (
            <div key={item.id} className="">
              {/* ProductCard уже оптимизирован внутри (400px), этого достаточно */}
              <ProductCard item={item} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default NessaHome;
