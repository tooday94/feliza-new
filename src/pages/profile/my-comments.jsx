import React from "react";
import { CommentsCard } from "../../components/profile/comments-card";
import { useTranslation } from "react-i18next";

const MyComments = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col p-3 gap-6 min-h-screen">
      <h1 className="font-tenor font-normal text-2xl text-primary">
        {t("profile.tabs.coupons")}
      </h1>
      <CommentsCard />
    </div>
  );
};

export default MyComments;
