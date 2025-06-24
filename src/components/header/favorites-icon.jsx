import { Badge } from "antd";
import Cookies from "js-cookie";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useGetById } from "../../services/query/useGetById";
import { useLocation, useNavigate } from "react-router-dom";

const FavoritesIcon = () => {
  const userID = Cookies.get("USER-ID");
  const location = useLocation();
  const navigate = useNavigate();
  const { data: favorites } = useGetById(
    "/api/likedItem/getByCustomerId/",
    userID
  );
  return (
    <Badge
      size="default"
      styles={{
        indicator: { color: "black" },
      }}
      style={{ border: "1px solid black" }}
      color="white"
      className="!font-tenor !text-xs cursor-pointer"
      count={favorites?.length}
      onClick={() => navigate("/favorites")}
    >
      {location.pathname == "/favorites" ? (
        <FaHeart size={21} />
      ) : (
        <FaRegHeart size={21} />
      )}
    </Badge>
  );
};

export default FavoritesIcon;
