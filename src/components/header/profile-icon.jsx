import { Avatar } from "antd";
import { useState } from "react";
import { FaRegUser, FaUser } from "react-icons/fa6";
import Cookies from "js-cookie";
import { useGetById } from "../../services/query/useGetById";
import { useLocation, useNavigate } from "react-router-dom";
const ProfileIcon = () => {
  const userID = Cookies.get("USER-ID");
  const Token = Cookies.get("FELIZA-TOKEN");
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const { data: userData } = useGetById(
    "/api/customers/getCustomerById/",
    userID
  );
  return (
    <div>
      {/* {userID || Token ? (
        <div>
          <Avatar
            // onClick={() => navigate("/profile?tab=my-profile")}
            icon={<FaRegUser />}
            className="!bg-secondary cursor-pointer !border-2 !border-primary"
            src={userData?.image?.url || false}
          />
        </div>
      ) : (
        <div>
          {location.pathname == "/profile" ? (
            <FaUser cursor={"pointer"} size={21} />
          ) : (
            <FaRegUser cursor={"pointer"} size={21} />
          )}
        </div>
      )} */}

      <div>
        {location.pathname == "/profile" ? (
          <FaUser cursor={"pointer"} size={21} />
        ) : (
          <FaRegUser cursor={"pointer"} size={21} />
        )}
      </div>
    </div>
  );
};

export default ProfileIcon;
