import { useTranslation } from "react-i18next";
import { useGetById } from "../../services/query/useGetById";
import Cookies from "js-cookie";
import { Grid, Skeleton } from "antd";
import OrderStepper from "./order-stepper";
import { PiArrowRight } from "react-icons/pi";
import { useNavigate } from "react-router-dom";

export const OrderShortShower = () => {
  const userID = Cookies.get("USER-ID");
  const width = Grid.useBreakpoint();
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const { data, isLoading } = useGetById(
    "/api/order/getAllByCustomerId/",
    userID
  );

  const rejectedOrders = data?.filter(
    (item) => !["REACHED", "REJECTED"].includes(item.orderStatusType)
  );

  if (isLoading) {
    return (
      <div className="p-3">
        <Skeleton title={true} active paragraph={{ rows: 0 }} />
        <div className="space-y-5">
          <Skeleton title={false} active paragraph={{ rows: 2 }} />
          <Skeleton title={false} active paragraph={{ rows: 2 }} />
        </div>
      </div>
    );
  }

  return (
    <>
      {!isLoading && rejectedOrders?.length > 0 && (
        <div className="border border-[#bbb] p-4 my-5 lg:my-10  mx-2 duration-500">
          <div className="flex justify-between items-center border-b border-accent pb-2.5">
            <h1 className="font-tenor text-xl text-primary">
              {t("order.my.active")}
            </h1>
            <div className="">
              <button
                onClick={() => (
                  navigate(width.lg ? "/profile?tab=orders" : "/my-orders"),
                  window.scrollTo({ top: 0, behavior: "smooth" })
                )}
              >
                <div className="text-primary flex items-center justify-between gap-2.5">
                  <h1>{i18n.language == "uz" ? "Ko'rish" : "Посмотреть"}</h1>
                  <PiArrowRight size={24} />
                </div>
              </button>
            </div>
          </div>
          <div className="">
            {
              // faqat 2 ta buyurtma ko'rsatish
              rejectedOrders?.slice(0, 2).map((item) => (
                <div
                  key={item.id}
                  className="font-tenor flex flex-col border-b border-accent w-full pt-2.5 pb-6"
                >
                  <div className="flex items-center justify-between border-b-secondary pb-4 text-primary">
                    <h1>{t("order.my.order-number")}:</h1>
                    <p>{item?.orderNumber}</p>
                  </div>
                  <div className="">
                    <OrderStepper status={item.orderStatusType} />
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      )}
    </>
  );
};
