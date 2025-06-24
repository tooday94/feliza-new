import React from "react";
import { StatusCard } from "../../components/profile/status-card";
import { useTranslation } from "react-i18next";

const MyStatus = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col p-3 gap-6 min-h-screen">
      <h1 className="font-tenor font-normal text-2xl text-primary">
        {t("profile.tabs.status")}
      </h1>
      <div className="">
        <StatusCard />
      </div>
    </div>
  );
};

export default MyStatus;
