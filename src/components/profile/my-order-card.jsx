import { useState } from "react";
import EmptyOrders from "../../assets/icons/empty-orders";
import { useGetById } from "../../services/query/useGetById";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import formatPrice from "../../utils/formatPrice";
import { Skeleton } from "antd";
import OrderStepper from "./order-stepper";
import ProductCard from "../ProductCart/ProductCard";

export const MyOrderCard = () => {
  const userID = Cookies.get("USER-ID");
  const { i18n, t } = useTranslation();
  const { data, isLoading } = useGetById(
    "/api/order/getAllByCustomerId/",
    userID
  );

  const { data: favorites } = useGetById(
    "/api/likedItem/getByCustomerId/",
    userID
  );
  const [isOpenProduct, setIsOpenProduct] = useState({});
  const reachedOrders = data?.filter(
    (item) => item.orderStatusType === "REACHED"
  );

  const rejectedOrders = data?.filter(
    (item) => item.orderStatusType != "REACHED"
  );
  console.log(data);

  const toggle = (id) => {
    setIsOpenProduct((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} active paragraph={{ rows: 4 }} />
        ))}
      </div>
    );
  }
  return (
    <div>
      {data?.length > 0 ? (
        <div className="space-y-8">
          <div className="space-y-6 font-tenor">
            <h1 className="text-center text-xl ">{t("order.my.active")}:</h1>

            {rejectedOrders?.map((item) => (
              <div
                key={item.id}
                className="p-4 border border-accent space-y-2.5 text-accent"
              >
                <div className="flex items-center justify-between border-b-secondary pb-4 text-primary">
                  <h1>{t("order.my.order-number")}:</h1>
                  <p>{item?.orderNumber}</p>
                </div>

                <div className="">
                  <OrderStepper status={item?.orderStatusType} />
                </div>

                <div className="flex items-center justify-between">
                  <h1>{t("order.my.status")}</h1>
                  <p>
                    {item?.orderStatusType == "REACHED" &&
                      t("order.my.reached")}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <h1>{t("order.my.time")}:</h1>
                  <p>{item?.deliveryDate}</p>
                </div>
                <div className="flex items-center justify-between">
                  <h1>{t("order.my.location")}:</h1>
                  <p>
                    {i18n.language == "uz"
                      ? item?.address.region.nameUZB
                      : item?.address.region.nameRUS}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <h1>{t("order.my.products")}:</h1>

                  <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => toggle(item.orderId)}
                  >
                    {isOpenProduct[item.orderId] ? (
                      <IoIosArrowUp
                        size={24}
                        // onClick={() => setIsOpenProduct(false)}
                      />
                    ) : (
                      <IoIosArrowDown
                        size={24}
                        // onClick={() => setIsOpenProduct(true)}
                      />
                    )}
                  </div>
                </div>

                {isOpenProduct[item?.orderId] && (
                  <div className="">
                    {item?.orderDetailDtos.map((product) => (
                      <div className="flex gap-4 border-t py-4 font-tenor text-xs lg:text-sm">
                        <div className="">
                          <img
                            className="w-16"
                            src={product?.productImages[0]?.url}
                          />
                        </div>
                        <div className="space-y-2">
                          <div className="flex gap-3 flex-wrap">
                            <h1>{t("order.my.name")}:</h1>

                            <h1 className="text-primary">
                              {product?.productName}
                            </h1>
                          </div>
                          <div className="flex gap-3">
                            <h1>{t("cart.quantity")}:</h1>
                            <h1 className="text-primary">
                              {product?.quantity}
                            </h1>
                          </div>
                          <div className="flex gap-3">
                            <h1>{t("cart.size")}:</h1>
                            <h1 className="text-primary">
                              {product.productSizeVariant?.size}
                            </h1>
                          </div>
                          <div className="flex gap-3">
                            <h1>{t("order.total-price")}</h1>

                            <h1 className="text-primary">
                              {`${formatPrice(item?.orderCost)} ${t(
                                "cart.sum"
                              )}`}
                            </h1>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="space-y-6 font-tenor">
            <h1 className="text-center text-xl ">{t("order.my.history")}:</h1>
            {reachedOrders?.map((item) => (
              <div key={item.id} className="p-4 border space-y-2.5 text-accent">
                <div className="flex items-center justify-between border-b border-b-secondary pb-4 text-primary">
                  <h1>{t("order.my.order-number")}:</h1>
                  <p>{item?.orderNumber}</p>
                </div>
                <div className="flex items-center justify-between">
                  <h1>{t("order.my.status")}</h1>
                  <p>
                    {item?.orderStatusType == "REACHED" &&
                      t("order.my.reached")}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <h1>{t("order.my.time")}:</h1>
                  <p>{item?.deliveryDate}</p>
                </div>
                <div className="flex items-center justify-between">
                  <h1>{t("order.my.location")}:</h1>
                  <p>
                    {i18n.language == "uz"
                      ? item?.address.region.nameUZB
                      : item?.address.region.nameRUS}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <h1>{t("order.my.products")}:</h1>

                  <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => toggle(item.orderId)}
                  >
                    {isOpenProduct[item.orderId] ? (
                      <IoIosArrowUp
                        size={24}
                        // onClick={() => setIsOpenProduct(false)}
                      />
                    ) : (
                      <IoIosArrowDown
                        size={24}
                        // onClick={() => setIsOpenProduct(true)}
                      />
                    )}
                  </div>
                </div>

                {isOpenProduct[item?.orderId] && (
                  <div className="">
                    {item?.orderDetailDtos.map((product) => (
                      <div className="flex gap-4 border-t py-4 font-tenor text-xs lg:text-sm">
                        <div className="">
                          <img
                            className="w-16"
                            src={product?.productImages[0]?.url}
                          />
                        </div>
                        <div className="space-y-2">
                          <div className="flex gap-3 flex-wrap">
                            <h1>{t("order.my.name")}:</h1>

                            <h1 className="text-primary">
                              {product?.productName}
                            </h1>
                          </div>
                          <div className="flex gap-3">
                            <h1>{t("cart.quantity")}:</h1>
                            <h1 className="text-primary">
                              {product?.quantity}
                            </h1>
                          </div>
                          <div className="flex gap-3">
                            <h1>{t("cart.size")}:</h1>
                            <h1 className="text-primary">
                              {product.productSizeVariant?.size}
                            </h1>
                          </div>
                          <div className="flex gap-3">
                            <h1>{t("order.total-price")}</h1>

                            <h1 className="text-primary">
                              {`${formatPrice(item?.orderCost)} ${t(
                                "cart.sum"
                              )}`}
                            </h1>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="h-full">
          <div className="flex flex-col justify-center items-center gap-5 mt-24">
            <EmptyOrders />
            <h1 className="font-tenor font-normal text-primary">
              {i18n.language == "uz"
                ? "Hozircha buyurtmalar yo’q"
                : "Заказов пока нет."}
            </h1>
          </div>
          {favorites?.length > 0 && (
            <div className="mt-28">
              <div className="pt-5 lg:pt-10 pb-[30px]">
                <h1 className="font-tenor font-normal text-2xl text-primary uppercase">
                  {t("favorites.title")}
                  <span className="text-secondary">
                    {favorites?.length == 0 ? "" : `(${favorites?.length})`}
                  </span>
                </h1>
              </div>

              <div
                style={{ scrollbarWidth: "none" }}
                className="flex justify-between gap-4 overflow-x-scroll"
              >
                {favorites?.map((item) => (
                  <div className="min-w-[296px]">
                    <ProductCard item={item?.product} key={item?.id} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
