import Cookies from "js-cookie";
import { useGetById } from "../../services/query/useGetById";
import { Button, Modal } from "antd";
import { FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
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
import logo from "../../assets/images/loading-logo.png";
import { OrderShortShower } from "./order-short-shower";
export const MobileProfileCard = () => {
  const { t, i18n } = useTranslation();
  const userID = Cookies.get("USER-ID");
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
      path: "/my-profile",
    },
    {
      label: "profile.tabs.orders",
      icon: <PiPackage size={24} />,
      children: <>child 2</>,
      path: "/my-orders",
    },
    {
      label: "profile.tabs.comments",
      icon: <PiChatCenteredDotsLight size={24} />,
      children: <CommentsCard />,
      path: "/my-comments",
    },
    {
      label: "profile.tabs.address",
      icon: <PiMapPinLine size={24} />,
      children: <AddressCard />,
      path: "/my-address",
    },
    {
      label: "profile.tabs.notifications",
      icon: <PiEnvelopeSimpleOpen size={24} />,
      children: <NotificationsCard />,
      path: "/my-notifications",
    },
    {
      label: "profile.tabs.status",
      icon: <PiShootingStar size={24} />,
      children: <StatusCard />,
      path: "/my-status",
    },
    {
      label: "profile.tabs.coupons",
      icon: <RiCoupon2Line size={24} />,
      children: <UserCouponCard />,
      path: "/my-coupons",
    },
  ];

  return (
    <div>
      <div className="max-w-[1280px] mx-auto relative">
        <div className="">
          <div className="flex bg-background w-full !border-primary">
            {/* Left Sidebar */}
            <div
              className={`bg-[url(${userData?.image?.url})]  text-white flex flex-col gap-10 w-full`}
            >
              {/* Profile Info */}
              <div className="">
                <div className="relative w-full">
                  <div
                    className="w-full h-full max-h-[224px] min-h-[224px]"
                    style={{
                      background: "#444",
                      backgroundImage:
                        userData?.image?.url && `url(${userData?.image?.url})`,
                      backgroundSize: "cover",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center",
                      filter: "blur(5px)",
                    }}
                  ></div>
                  <div className="absolute top-0 w-full p-6 flex justify-between items-center z-50">
                    <img className="w-28" src={logo} alt="logo" />
                    <div className="duration-500 font-tenor font-normal text-base flex gap-3">
                      <button
                        className={`${
                          i18n.language == "uz"
                            ? "text-white"
                            : "text-secondary"
                        }`}
                        onClick={() => i18n.changeLanguage("uz")}
                      >
                        Uz{" "}
                      </button>
                      <span>|</span>
                      <button
                        className={`${
                          i18n.language == "ru"
                            ? "text-white"
                            : "text-secondary"
                        }`}
                        onClick={() => i18n.changeLanguage("ru")}
                      >
                        Рус
                      </button>
                    </div>
                  </div>
                  <div className="absolute top-0 h-full flex items-end justify-start gap-2 mx-auto w-full z-30 text-center p-6">
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
                      onClick={() => (
                        navigate(item.path),
                        window.scrollTo({ top: 0, behavior: "smooth" })
                      )}
                      className={`cursor-pointer duration-300 w-full flex items-center gap-3 px-4 py-2 transition-all
                      ${"text-secondary hover:bg-white/10 border-l-2 border-transparent"}`}
                    >
                      {item.icon}
                      <span className="text-sm">{t(item.label)}</span>
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
    </div>
  );
};
