import { Avatar, Drawer } from "antd";
import { useState } from "react";
import { FaRegUser, FaUser } from "react-icons/fa6";
import Cookies from "js-cookie";
import { useGetById } from "../../services/query/useGetById";
import { useNavigate } from "react-router-dom";
import AuthForm from "./auth-form";

const UserAuth = () => {
  const userID = Cookies.get("USER-ID");
  const Token = Cookies.get("FELIZA-TOKEN");
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const { data: userData } = useGetById(
    "/api/customers/getCustomerById/",
    userID
  );
  return (
    <div className="">
      {userID || Token ? (
        <div>
          <Avatar
            onClick={() => (
              navigate("/profile?tab=my-profile"),
              window.scrollTo({ top: 0, behavior: "smooth" })
            )}
            icon={<FaRegUser />}
            className="!bg-secondary cursor-pointer !border-2 !border-primary"
            src={userData?.image?.url || false}
          />
        </div>
      ) : (
        <div>
          {open ? (
            <FaUser cursor={"pointer"} onClick={onClose} size={21} />
          ) : (
            <FaRegUser cursor={"pointer"} onClick={showDrawer} size={21} />
          )}
        </div>
      )}
      <Drawer
        closable={{ "aria-label": "Close Button" }}
        onClose={onClose}
        open={open}
        width={464}
        height={70}
        maskClosable={false}
        mask={false}
        styles={{
          body: { height: "700px", background: "white" },
          wrapper: { height: 700, marginTop: "83px" },
        }}
        placement="right"
      >
        <AuthForm onClose={onClose} />
      </Drawer>
    </div>
  );
};

export default UserAuth;
