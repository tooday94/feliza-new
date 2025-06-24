import { useTranslation } from "react-i18next";
import { FaCheck, FaX } from "react-icons/fa6";

const steps = [
  {
    id: 1,
    defaultLabel: "order.status.new",
    rejectLabel: "order.status.rejected",
    status: "REJECTED",
  },
  { id: 2, defaultLabel: "order.status.pack", status: "PACK" },
  { id: 3, defaultLabel: "order.status.send", status: "SEND" },
  { id: 4, defaultLabel: "order.status.reached", status: "REACHED" },
];

// Status tartibi — bu muhim!
const statusPriority = {
  REJECTED: -1,
  PACK: 1,
  SEND: 2,
  REACHED: 3,
};

const OrderStepper = ({ status }) => {
  const currentIndex = statusPriority[status] ?? -2;
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-between max-w-full mx-auto">
      {steps.map((step, index) => {
        const stepIndex = statusPriority[step.status] ?? -2;

        const isRejected = status === "REJECTED" && step.id === 1;
        const isCompleted = !isRejected && index <= currentIndex;

        const label =
          step.id === 1
            ? isRejected
              ? step.rejectLabel
              : step.defaultLabel
            : step.defaultLabel;

        return (
          <div
            className="flex-1 flex flex-col items-center relative"
            key={step.id}
          >
            {/* Connecting line */}
            {index !== 0 && (
              <div
                className={`absolute top-2.5 left-[-50%] w-full h-0.5 z-10
                  ${isCompleted ? "bg-black" : "bg-gray-300"}`}
              />
            )}

            {/* Circle */}
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center z-20
                ${
                  isRejected
                    ? "bg-red-500 text-white"
                    : isCompleted
                    ? "bg-black text-white"
                    : "bg-gray-300 text-gray-500"
                }`}
            >
              {isRejected ? (
                <FaX size={10} />
              ) : isCompleted ? (
                <FaCheck size={10} />
              ) : null}
            </div>

            {/* Label */}
            <div
              className={`mt-2 text-xs text-center
                ${
                  isRejected
                    ? "text-red-500 font-medium"
                    : isCompleted
                    ? "text-black font-medium"
                    : "text-gray-400"
                }`}
            >
              {t(label)}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OrderStepper;
