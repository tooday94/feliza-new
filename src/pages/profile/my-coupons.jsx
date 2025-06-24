import { useTranslation } from "react-i18next";
import UserCouponCard from "../../components/profile/user-coupon-card";

const MyCoupons = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col p-3 gap-6 min-h-screen">
      <h1 className="font-tenor font-normal text-2xl text-primary">
        {t("profile.tabs.coupons")}
      </h1>
      <UserCouponCard />
    </div>
  );
};

export default MyCoupons;
