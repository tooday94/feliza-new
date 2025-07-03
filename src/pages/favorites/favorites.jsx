import Cookies from "js-cookie";
import ProductCard from "../../components/ProductCart/ProductCard";
import { useGetById } from "../../services/query/useGetById";
import EmptyFavorites from "../../assets/icons/empty-favorites";
import { useTranslation } from "react-i18next";
const Favorites = () => {
  const userID = Cookies.get("USER-ID");
  const { t } = useTranslation();
  const { data: favorites } = useGetById(
    "/api/likedItem/getByCustomerId/",
    userID
  );

  return (
    <div className="max-w-[1220px] mx-auto px-3 lg:px-0 min-h-screen">
      <div className="pt-5 lg:pt-10 pb-[30px] text-center">
        <h1 className="font-tenor font-normal text-2xl text-primary uppercase">
          {t("favorites.title")}
          <span className="text-secondary text-xl">
            {favorites?.length == 0 ? "" : `(${favorites?.length || 0})`}
          </span>
        </h1>
      </div>
      <div className="">
        {!userID || favorites?.length == 0 ? (
          <div className="w-full">
            <div className="text-center w-full flex flex-col items-center justify-center gap-10">
              <EmptyFavorites />
              <div className="space-y-4 font-tenor font-normal">
                <h1 className="text-xl text-primary">{t("favorites.empty")}</h1>
                <p className="text-sm text-secondary">{t("favorites.desc")}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {favorites?.map((item) => (
              <ProductCard item={item?.product} key={item.id} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
