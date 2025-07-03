import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useGetById } from "../../services/query/useGetById";
import { IoMdClose } from "react-icons/io";
import { BiCheckCircle, BiError } from "react-icons/bi";
import { useTranslation } from "react-i18next";

const OrderStatusModal = () => {
  const { i18n } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const orderId = Cookies.get("lastOrderId");
  const { data, isSuccess } = useGetById("/api/order/getOrderById/", orderId);
  
  useEffect(() => {
    if (data?.paid == true) {
      setModalContent({
        title:
          i18n.language == "uz"
            ? "To‘lov muvaffaqiyatli"
            : "Платеж прошел успешно",
        message:
          i18n.language == "uz"
            ? "Xaridingiz muvaffaqiyatli amalga oshirildi!"
            : "Ваша покупка прошла успешно!",
      });
      setIsVisible(true);
      Cookies.remove("lastOrderId");
    } else if (orderId) {
      setModalContent({
        title:
          i18n.language == "uz" ? "To‘lov bajarilmagan" : "Платеж не прошёл.",
        message:
          i18n.language == "uz"
            ? "To‘lov amalga oshmagan. Iltimos Buyurtmalar bo'limini tekshiring."
            : "Платеж не прошел. Проверьте раздел «Заказы».",
        link: "asgs",
      });
      setIsVisible(true);
      Cookies.remove("lastOrderId");
    }
  }, [isSuccess, data, orderId]);

  if (!isVisible || !modalContent) return null;

  return (
    <div className="fixed inset-0 bg-black/10 bg-opacity-50 flex items-center justify-center z-50 px-3">
      <div className="relative font-tenor bg-white p-5 md:p-10 pt-16 max-w-[592px] w-full text-center shadow-xl md:h-[326px]">
        <h2 className="md:text-2xl text-xl font-normal mb-3">
          {modalContent.title}
        </h2>
        <div className="flex justify-center mt-5 md:mt-10 mb-5">
          {data?.paid ? (
            <BiCheckCircle color="#444" size={64} />
          ) : (
            <BiError color="#444" size={64} />
          )}
        </div>
        <p className="line-clamp-2 max-w-[290px] mx-auto text-secondary">
          {modalContent.message}
        </p>

        <button
          className="absolute top-5 right-5 md:top-10 md:right-10 cursor-pointer"
          onClick={() => setIsVisible(false)}
        >
          <IoMdClose size={24} />
        </button>
      </div>
    </div>
  );
};

export default OrderStatusModal;
