import Cookies from "js-cookie";
import { useGetById } from "../../services/query/useGetById";
import { Button, Grid, Modal } from "antd";
import { FaSignOutAlt } from "react-icons/fa";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { BiUserCircle } from "react-icons/bi";
import {
  PiChatCenteredDotsLight,
  PiEnvelopeSimpleOpen,
  PiMapPinLine,
  PiPackage,
  PiShootingStar,
  PiUser,
} from "react-icons/pi";
import { RiCoupon2Line } from "react-icons/ri";
import { ProfileInfoCard } from "./profile-info-card";
import { NotificationsCard } from "./notifications-card";
import AddressCard from "./address-card";
import UserCouponCard from "./user-coupon-card";
import { StatusCard } from "./status-card";
import { useTranslation } from "react-i18next";
import { CommentsCard } from "./comments-card";
import { MyOrderCard } from "./my-order-card";
import { OrderShortShower } from "./order-short-shower";

export const DesktopProfileCard = () => {
  const { i18n, t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab");
  const userID = Cookies.get("USER-ID");
  const width = Grid.useBreakpoint();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { data: userData } = useGetById(
    "/api/customers/getCustomerById/",
    userID
  );

  const showModal = () => {
    setOpen(true);
  };
  const handleOk = () => {
    Cookies.remove("FELIZA-TOKEN");
    Cookies.remove("USER-ID");
    navigate("/");
    setOpen(false);
  };
  const handleCancel = () => {
    setOpen(false);
  };

  const profileItems = [
    {
      label: "profile.tabs.profile",
      icon: <BiUserCircle size={24} />,
      children: <ProfileInfoCard />,
      key: "my-profile",
    },
    {
      label: "profile.tabs.orders",
      icon: <PiPackage size={24} />,
      children: <MyOrderCard />,
      key: "orders",
    },
    {
      label: "profile.tabs.comments",
      icon: <PiChatCenteredDotsLight size={24} />,
      children: <CommentsCard />,
      key: "comments",
    },
    {
      label: "profile.tabs.address",
      icon: <PiMapPinLine size={24} />,
      children: <AddressCard />,
      key: "addr",
    },
    {
      label: "profile.tabs.notifications",
      icon: <PiEnvelopeSimpleOpen size={24} />,
      children: <NotificationsCard />,
      key: "notifications",
    },
    {
      label: "profile.tabs.status",
      icon: <PiShootingStar size={24} />,
      children: <StatusCard />,
      key: "status",
    },
    {
      label: "profile.tabs.coupons",
      icon: <RiCoupon2Line size={24} />,
      children: <UserCouponCard />,
      key: "coupons",
    },
  ];

  const currentTab = useMemo(
    () => profileItems.find((item) => item.key === activeTab),
    [activeTab, profileItems]
  );

  useEffect(() => {
    if (width.lg && !userID) {
      navigate("/");
    }
  }, [userID, width.lg]);

  return (
    <div className="max-w-[1280px] mx-auto relative">
      <div className="hidden lg:block">
        <div className="flex bg-background">
          {/* Left Sidebar */}
          <div
            className={`w-[390px] bg-[url(${userData?.image?.url})]  text-white flex flex-col gap-20 justify-between`}
          >
            {/* Profile Info */}
            <div className="border">
              <div className="relative w-full">
                <div
                  className="w-full h-full max-w-[390px] max-h-[200px] min-w-[390px] min-h-[200px]"
                  style={{
                    background: "#444",
                    backgroundImage:
                      userData?.image?.url && `url(${userData?.image?.url})`,
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    filter: "blur(3px)",
                  }}
                ></div>
                <div className="absolute top-0 h-full flex flex-col items-center justify-center gap-2 mx-auto w-full z-30 text-center">
                  {userData?.image?.url ? (
                    <img
                      src={userData?.image?.url}
                      alt="Profile"
                      className="w-20 h-20 rounded-full object-cover border-4 border-white"
                    />
                  ) : (
                    <div className="border-2 size-20 rounded-full flex justify-center items-center">
                      <PiUser size={36} />
                    </div>
                  )}
                  <div className="text-lg font-semibold">
                    <h1>{userData?.fullName}</h1>
                    <p>{userData?.status?.statusName}</p>
                  </div>
                </div>
              </div>
              <OrderShortShower />

              {/* Tabs */}
              <div className="mt-2 space-y-1">
                {profileItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => setSearchParams({ tab: item.key })}
                    className={`cursor-pointer duration-300 w-full flex items-center gap-3 px-4 py-2 transition-all
                ${
                  activeTab === item.key
                    ? "bg-white text-primary border-l-2 border-primary font-semibold"
                    : "text-secondary hover:bg-white/10 border-l-2 border-transparent"
                }`}
                  >
                    {item.icon}
                    <span className="text-sm font-tenor">{t(item.label)}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Optional Footer */}
            <div className="text-xs text-gray-300 p-3">
              <div className="">
                <Button
                  className="!border-none !bg-transparent !shadow-none"
                  danger
                  icon={<FaSignOutAlt size={18} />}
                  onClick={() => showModal()}
                  children={t("profile.modal.log-out")}
                />
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="flex-1 p-6 bg-white overflow-auto h-full max-h-screen">
            {currentTab ? (
              currentTab.children
            ) : (
              <div className="text-gray-500">
                <h1>
                  {i18n.language == "uz"
                    ? "Iltimos, bo‘lim tanlang!"
                    : "Пожалуйста, выберите раздел."}
                </h1>
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal
        open={open}
        title={<IoMdInformationCircleOutline size={24} color="#FED800" />}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={t("profile.modal.yes")}
        cancelText={t("profile.modal.no")}
      >
        <p>{t("profile.modal.title")}</p>
      </Modal>
    </div>
  );
};
