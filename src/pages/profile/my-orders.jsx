import { MyOrderCard } from "../../components/profile/my-order-card";
import { useTranslation } from "react-i18next";

const MyOrders = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col p-3 gap-6 min-h-screen">
      <h1 className="font-tenor font-normal text-2xl text-primary">
        {t("profile.tabs.orders")}
      </h1>
      <MyOrderCard />
    </div>
  );
};

export default MyOrders;
