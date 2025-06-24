import { useTranslation } from "react-i18next";
import { ProfileInfoCard } from "../../components/profile/profile-info-card";

const MyProfile = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col p-3 gap-6 min-h-screen">
      <h1 className="font-tenor font-normal text-2xl text-primary">
        {t("profile.tabs.profile")}
      </h1>
      <ProfileInfoCard />
    </div>
  );
};

export default MyProfile;
