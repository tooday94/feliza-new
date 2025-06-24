import Cookies from "js-cookie";
import { useGetById } from "../../services/query/useGetById";
import { useTranslation } from "react-i18next";
import { IoIosInformationCircleOutline } from "react-icons/io";
export const StatusCard = () => {
  const userID = Cookies.get("USER-ID");
  const { t } = useTranslation();
  const { data } = useGetById("/api/customers/getCustomerById/", userID);

  console.log(data);

  return (
    <div className="p-5">
      <div className="flex justify-center border-b">
        <div className="">
          <div className="space-y-3 pt-10 pb-20">
            <h1 className="font-tenor font-normal text-4xl text-center">
              {data?.cashback ? data?.cashback : 0}{" "}
              <span className="text-lg">{t("profile.status.ball")}</span>
            </h1>
            <h1 className="font-tenor font-normal text-base text-secondary">
              {t("profile.status.status")}: {data?.status?.statusName}
            </h1>
          </div>
        </div>
      </div>

      <div className="py-6">
        <div className="">
          <p className="font-tenor font-normal text-sm text-secondary">
            {t("profile.status.desc")}
          </p>
        </div>
      </div>

      <div className="">
        <div className="space-y-5">
          <div className="flex gap-3 items-center">
            <IoIosInformationCircleOutline size={18} />
            <h1 className="font-tenor font-normal text-2xl text-primary">
              {t("profile.status.title")}
            </h1>
          </div>

          <div className=" flex flex-col gap-4">
            <div className="">
              <h1 className="font-tenor font-normal text-xl text-primary">
                {t("profile.status.start.title")}
              </h1>
              <p className="font-tenor font-normal text-sm text-secondary">
                {t("profile.status.start.desc")}
              </p>
            </div>

            <div className="">
              <h1 className="font-tenor font-normal text-xl text-primary">
                {t("profile.status.bronze.title")}
              </h1>
              <p className="font-tenor font-normal text-sm text-secondary">
                {t("profile.status.bronze.desc")}
              </p>
            </div>
            <div className="">
              <h1 className="font-tenor font-normal text-xl text-primary">
                {t("profile.status.silver.title")}
              </h1>
              <p className="font-tenor font-normal text-sm text-secondary">
                {t("profile.status.silver.desc")}
              </p>
            </div>
            <div className="">
              <h1 className="font-tenor font-normal text-xl text-primary">
                {t("profile.status.gold.title")}
              </h1>
              <p className="font-tenor font-normal text-sm text-secondary">
                {t("profile.status.gold.desc")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
