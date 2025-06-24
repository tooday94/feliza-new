import { useTranslation } from "react-i18next";
import { NotificationsCard } from "../../components/profile/notifications-card";

const MyNotifications = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col p-3 gap-6 min-h-screen">
      <h1 className="font-tenor font-normal text-2xl text-primary">
        {t("profile.tabs.notifications")}
      </h1>
      <NotificationsCard />
    </div>
  );
};

export default MyNotifications;
