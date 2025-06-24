import { useTranslation } from "react-i18next";
import AddressCard from "../../components/profile/address-card";

const MyAddress = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col p-3 gap-6 min-h-screen">
      <h1 className="font-tenor font-normal text-2xl text-primary">
        {t("profile.tabs.address")}
      </h1>
      <AddressCard />
    </div>
  );
};

export default MyAddress;
