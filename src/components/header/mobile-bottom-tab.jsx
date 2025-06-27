import { Button } from "antd";
import { BiCategory, BiSolidCategory } from "react-icons/bi";
import FeIcon from "./fe-icon";
import { useLocation, useNavigate } from "react-router-dom";
import FavoritesIcon from "./favorites-icon";
import CartIcon from "./cart-icon";
import ProfileIcon from "./profile-icon";
import UserAuth from "./user-auth";

export const MobileBottomTab = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const menuList = [
    {
      path: "/",
      icon: <FeIcon color={location.pathname == "/" ? "#0d0d0d" : "#5b5b5b"} />,
    },
    {
      path: "/catalogs",
      icon:
        location.pathname == "/catalogs" ? (
          <BiSolidCategory size={24} />
        ) : (
          <BiCategory size={24} />
        ),
    },
    {
      path: "/favorites",
      icon: <FavoritesIcon />,
    },
    {
      path: "/cart",
      icon: <CartIcon />,
    },
    {
      path: "/profile",
      // icon: <UserAuth />,
      icon: <ProfileIcon />,
    },
  ];
  return (
    <div className="bg-white overflow-hidden !z-50 p-2 py-6 lg:hidden">
      <div className="flex justify-between items-center px-3">
        {menuList.map((item) => (
          <button
            onClick={() => (
              navigate(item.path),
              window.scrollTo({ top: 0, behavior: "smooth" })
            )}
            key={item.path}
            className={`size-7 !pb-0 ${
              location.pathname == item.path
                ? "!text-primary"
                : "!text-secondary"
            }`}
            // icon={item.icon}
          >
            {item.icon}
          </button>
        ))}
      </div>
    </div>
  );
};
