import { DesktopProfileCard } from "../../components/profile/desktop-profile-card";
import { MobileProfileCard } from "../../components/profile/mobile-profile-card";

const Profile = () => {
  return (
    <div className="">
      <div className="block lg:hidden font-tenor">
        <MobileProfileCard />
      </div>
      <div className="hidden lg:block font-tenor">
        <DesktopProfileCard />
      </div>
    </div>
  );
};

export default Profile;
