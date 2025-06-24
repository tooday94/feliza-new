import Cookies from "js-cookie";
import Logo from "../../assets/images/feliza-logo.png";
import { useGetById } from "../../services/query/useGetById";
import { formatDate } from "../../utils/formatDate";
import { useUpdateById } from "../../services/mutations/useUpdateById";
import { useNavigate } from "react-router-dom";
export const NotificationsCard = () => {
  const userID = Cookies.get("USER-ID");
  const navigate = useNavigate();

  const { data: notifications } = useGetById(
    "/api/notification/getNotificationsForCustomer/",
    userID
  );

  const { mutate } = useUpdateById(
    "/api/notification/readNotification/",
    "/api/notification/getNotificationsForCustomer/"
  );

  return (
    <div>
      <div className="flex gap-4 flex-col">
        {notifications?.map((item) => (
          <div
            className=""
            onClick={() => {
              mutate(
                { id: item.id, data: {} },
                {
                  onSuccess: () => {
                    if ((item.type == "sale") & item.reserveId) {
                      navigate(`/categoryDetail/${item?.reserveId}`);
                    }
                    if (item.type == "LookCollection") {
                      navigate(`/looksDetail/${item?.reserveId}`);
                    }
                  },
                }
              );
            }}
          >
            <div
              className={`flex gap-1 mb-6 cursor-pointer ${
                item?.read ? "border-transparent" : "border-primary"
              } border-l-2 pl-3`}
            >
              <img
                className="size-24 object-contain"
                src={item?.image?.url || Logo}
                alt=""
              />
              <div className="flex flex-col w-full p-1">
                <div className="w-full text-end">
                  <h1 className="font-tenor font-normal text-accent">
                    {formatDate(item?.createdAt)}
                  </h1>
                </div>
                <div className="">
                  <h1 className="font-tenor font-bold text-base text-primary ">
                    {item?.title}
                  </h1>
                  <p className="font-tenor font-normal text-sm text-secondary">
                    {item?.message}
                  </p>
                </div>
              </div>
            </div>
            <div className="border border-secondary max-w-11/12 mx-auto"></div>
          </div>
        ))}
      </div>
    </div>
  );
};
