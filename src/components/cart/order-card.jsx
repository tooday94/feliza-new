import { Button, Flex, Form, Input, Radio } from "antd";
import { useTranslation } from "react-i18next";
import { useGetById } from "../../services/query/useGetById";
import Cookies from "js-cookie";
import { SlLocationPin } from "react-icons/sl";
import { useEffect, useState } from "react";
import { useGetList } from "../../services/query/useGetList";
import CouponCard from "./coupon-card";
import { useCreate } from "../../services/mutations/useCreate";
import { CiCircleInfo } from "react-icons/ci";
import formatPrice from "../../utils/formatPrice";
import { IoAddOutline } from "react-icons/io5";
import AddAddress from "./add-address";

export const OrderCard = ({ sum, cart }) => {
  const userID = Cookies.get("USER-ID");
  const [value, setValue] = useState(null);
  const [valueCoupon, setValueCoupon] = useState(null);
  const [userCouponUsed, setUserCouponUsed] = useState([]);

  const { i18n, t } = useTranslation();

  const { data: userAdresses, isLoading: userAdressesLoading } = useGetById(
    "/api/address/getAddressesByCustomerId/",
    userID
  );
  const { data: userData, isLoading: userDataLoading } = useGetById(
    "/api/customers/getCustomerById/",
    userID
  );
  const { data: userCoupon } = useGetList(
    "/api/couponCustomer/getCouponsByCustomerId/" + userID
  );

  const { mutate } = useCreate("/api/order/addOrder");
  const deliveryDay = 3;
  const todayObj = new Date();
  const today = todayObj.toISOString().split("T")[0];
  const futureDate = new Date(todayObj);
  futureDate.setDate(futureDate.getDate() + deliveryDay);
  const formattedDate = futureDate.toISOString().split("T")[0];

  const onSubmit = (data) => {
    console.log({
      ...data,
      shippingCost: 0,
      deliveryDays: deliveryDay,
      deliveryDate: formattedDate,
      cartItemIds: cart,
      customerId: userID,
      orderCost: sum,
      orderTime: today,
    });
    mutate(
      {
        ...data,
        shippingCost: 0,
        deliveryDays: 3,
        deliveryDate: "2024-03-07",
        cartItemIds: cart,
        customerId: userID,
        orderCost: sum,
        orderTime: today,
      },
      {
        onSuccess: (res) => {
          console.log(res);
          if (res.success) {
            window.location.href = res.object;
          }
        },
        onError: (err) => {
          console.log(err);
        },
      }
    );
  };

  useEffect(() => {
    if (valueCoupon && userCoupon?.length) {
      const selected = userCoupon.find((coupon) => coupon.id === valueCoupon);
      setUserCouponUsed(selected || {});
    } else {
      setUserCouponUsed({});
    }
  }, [valueCoupon, userCoupon]);

  if (userAdressesLoading) {
    return <>loading</>;
  }
  return (
    <div className="w-full lg:p-10">
      {userDataLoading || userAdressesLoading ? (
        <div>
          <h1>loading...</h1>
        </div>
      ) : (
        <Form
          onFinish={onSubmit}
          layout="vertical"
          className="!w-full"
          initialValues={{
            receiverName: userData?.fullName,
            receiverPhoneNumber: userData?.phoneNumber,
            addressId: userAdresses[0].id,
            paymentMethod: "PAYME",
          }}
        >
          <Flex className="!pb-[30px]">
            <h1 className="font-tenor font-normal text-xl text-primary">
              {t("order.customer-info")}
            </h1>
          </Flex>
          <Form.Item className="lg:!pl-4" name={"receiverName"}>
            <Input
              className="h-12 !rounded-none !border-primary"
              placeholder={t("header.register.name")}
            />
          </Form.Item>
          <Form.Item className="lg:!pl-4" name={"receiverPhoneNumber"}>
            <Input
              className="h-12 !rounded-none !border-primary"
              placeholder={t("header.register.phone")}
            />
          </Form.Item>

          <Flex className="!pb-[30px]">
            <h1 className="font-tenor font-normal text-xl text-primary">
              {t("order.shipp-addr")}
            </h1>
          </Flex>

          <Form.Item className="lg:!pl-4" name={"addressId"}>
            <Radio.Group
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
              }}
              className="!space-y-2.5"
              options={userAdresses?.map((addr) => ({
                label: (
                  <div className="flex items-center gap-2">
                    <SlLocationPin size={18} />
                    <span className="font-tenor font-normal text-sm">
                      {i18n.language == "ru"
                        ? `${addr?.subRegion.region.nameRUS}, ${addr.subRegion.nameRUS}`
                        : `${addr?.subRegion.region.nameUZB}, ${addr.subRegion.nameUZB}`}
                    </span>
                  </div>
                ),
                value: addr?.id,
                className: `!space-x-5 !bg-background !w-full !p-5 !border-2 ${
                  value == addr.id
                    ? "!border-primary !text-primary"
                    : "!border-[#d3d3d3] !text-secondary"
                }`,
              }))}
            />
          </Form.Item>

          <Flex>
            <div className="pb-8 text-center w-full">
              <AddAddress />
            </div>
          </Flex>
          <Flex>
            <div className="flex gap-3 pl-4 pb-[30px]">
              <CiCircleInfo size={24} />
              <div className="space-y-2.5 font-tenor font-normal text-sm text-secondary">
                <p>{t("order.shipp-info.1")}</p>
                <p>{t("order.shipp-info.2")}</p>
                <p>{t("order.shipp-info.3")}</p>
                <p>{t("order.shipp-info.4")}</p>
              </div>
            </div>
          </Flex>

          <Flex className="!pb-[30px]">
            <h1 className="font-tenor font-normal text-xl text-primary">
              {t("order.coupons")}
            </h1>
          </Flex>

          <Form.Item className="lg:!pl-4" name={"couponCustomerId"}>
            <Radio.Group
              value={valueCoupon}
              onChange={(e) => {
                const selectedValue = e.target.value;
                setValueCoupon((prev) =>
                  prev === selectedValue ? null : selectedValue
                );
              }}
              className="!space-y-2.5"
              options={userCoupon?.map((item) => ({
                label: (
                  <CouponCard
                    name={item.coupon.name}
                    credit={item.coupon.credit}
                  />
                ),
                value: item?.id,
                className: `!bg-white !w-full !flex !flex-row-reverse ${
                  value == item.id ? "!text-primary" : "!text-secondary"
                }`,
              }))}
            />
          </Form.Item>

          <Flex vertical gap={30}>
            <h1 className="font-tenor font-normal text-xl text-primary">
              {t("order.pay-type")}
            </h1>

            <div className="pl-4 pb-4 flex gap-2 items-start">
              <CiCircleInfo size={18} />
              <p className="font-tenor font-normal text-sm text-secondary leading-[150%]">
                {t("order.pay-info")}
              </p>
            </div>
          </Flex>

          <Form.Item className="lg:!pl-4" name={"paymentMethod"}>
            <Radio.Group
              className="!space-y-2.5"
              options={[
                {
                  label: "Payme",
                  value: "PAYME",
                },
              ]}
            />
          </Form.Item>

          <Flex className="border-t !pt-6 !pb-[30px] !mt-10">
            <div className="w-full flex flex-col gap-4">
              <div className="flex justify-between font-tenor font-normal text-primary">
                <h1>{t("order.products")}</h1>
                <p>
                  {sum} {t("cart.sum")}
                </p>
              </div>
              <div className="flex justify-between">
                <h1>{t("order.delivery")}</h1>
                <p>0 {t("cart.sum")}</p>
              </div>
              <div className="flex justify-between">
                <h1>{t("order.coupons-used")}</h1>
                <p>
                  {userCoupon?.filter((coupon) => coupon?.id == valueCoupon)[0]
                    ?.coupon?.credit || 0}{" "}
                  {t("cart.sum")}
                </p>
              </div>
              <div className="flex justify-between">
                <h1 className="font-tenor font-normal text-xl text-primary">
                  {t("order.total-price")}
                </h1>
                <p>
                  {formatPrice(sum - (userCouponUsed?.coupon?.credit || 0))}{" "}
                  {t("cart.sum")}
                </p>
              </div>
            </div>
          </Flex>

          <Form.Item className="!mb-0">
            <Button
              className="!h-12 !rounded-none !font-tenor"
              block
              type="primary"
              htmlType="submit"
              children={t("cart.buy")}
            />
          </Form.Item>
        </Form>
      )}
    </div>
  );
};
