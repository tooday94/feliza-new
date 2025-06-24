import { Badge } from "antd";
import Cookies from "js-cookie";
import { LuShoppingBag } from "react-icons/lu";
import { RiShoppingBag3Fill } from "react-icons/ri";
import { useLocation, useNavigate } from "react-router-dom";
import { useGetById } from "../../services/query/useGetById";

const CartIcon = () => {
  const userID = Cookies.get("USER-ID");
  const { data } = useGetById("/api/cartItem/byCustomerId/", userID);
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <Badge
      size="default"
      styles={{
        indicator: { color: "black" },
      }}
      style={{ border: "1px solid black" }}
      color="white"
      className="!font-tenor !text-xs cursor-pointer"
      count={data?.length}
      onClick={() => navigate("/cart")}
    >
      {location.pathname == "/cart" ? (
        <RiShoppingBag3Fill size={21} />
      ) : (
        <LuShoppingBag size={21} />
      )}
    </Badge>
  );
};

export default CartIcon;
