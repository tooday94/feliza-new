import CouponBg from "../../assets/images/coupon-bg.png";
import Logo from "../../assets/images/loading-logo.png";
import { useTranslation } from "react-i18next";

const CouponCard = ({ name, credit, date }) => {
  const { t } = useTranslation();
  return (
    <div className="relative">
      <img loading="lazy" src={CouponBg} alt="" />
      <img
        className="w-[42px] absolute bottom-9 left-2 -rotate-90"
        src={Logo}
        alt=""
      />
      <p className="absolute top-3 left-20 font-tenor font-normal text-2xl text-primary">
        {credit} {t("cart.sum")}
      </p>
      <p className="absolute bottom-2 left-20 font-tenor font-normal text-base text-primary">
        {name}
      </p>
    </div>
  );
};

export default CouponCard;
