import AuthForm from "../../components/header/auth-form";
import { DesktopProfileCard } from "../../components/profile/desktop-profile-card";
import { MobileProfileCard } from "../../components/profile/mobile-profile-card";
import Cookies from "js-cookie";

const Profile = () => {
  const userID = Cookies.get("USER-ID");

  return (
    <div className="">
      <div className="block lg:hidden font-tenor">
        {userID ? (
          <MobileProfileCard />
        ) : (
          <div className="px-5 flex flex-col mt-20 mb-48">
            <AuthForm onClose={() => window.location.reload()} />
          </div>
        )}
      </div>
      <div className="hidden lg:block font-tenor">
        <DesktopProfileCard />
      </div>
    </div>
  );
};

export default Profile;
