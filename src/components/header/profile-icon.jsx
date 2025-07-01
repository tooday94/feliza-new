import { FaRegUser, FaUser } from "react-icons/fa6";
import { useLocation } from "react-router-dom";
const ProfileIcon = () => {
  const location = useLocation();

  return (
    <>
      {location.pathname == "/profile" ? (
        <FaUser cursor={"pointer"} size={24} />
      ) : (
        <FaRegUser cursor={"pointer"} size={24} />
      )}
    </>
  );
};

export default ProfileIcon;
