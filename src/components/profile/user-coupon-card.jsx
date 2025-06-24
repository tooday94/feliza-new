import Cookies from "js-cookie";
import { useGetById } from "../../services/query/useGetById";
import { useTranslation } from "react-i18next";
import CouponCard from "../cart/coupon-card";
import { Spin } from "antd";
import { RiCoupon2Line } from "react-icons/ri";

const UserCouponCard = () => {
  const userID = Cookies.get("USER-ID");
  const { t } = useTranslation();
  const { data, isLoading } = useGetById(
    "/api/couponCustomer/getCouponsByCustomerId/",
    userID
  );

  if (isLoading) {
    return <Spin />;
  }
  return (
    <div>
      {data ? (
        <div className="grid lg:grid-cols-2 gap-5 w-full justify-items-center">
          {data.map((item) => (
            <CouponCard
              credit={item?.coupon?.credit}
              name={item?.coupon?.name}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-between min-h-[500px]">
          <div className=""></div>
          <div className="flex flex-col justify-center items-center gap-4">
            <RiCoupon2Line size={56} />
            <h1>{t("profile.coupons.empty")}</h1>
          </div>
          <div className="pt-6 border-t border-secondary text-center lg:w-4/6">
            <p className="font-tenor font-normal text-sm text-secondary">
              {t("profile.coupons.desc")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserCouponCard;
