import { Button } from "antd";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  return (
    <div className="w-full h-screen flex flex-col gap-10 items-center justify-center bg-background text-2xl text-gray-700">
      <div className="text-center font-tenor">
        <h1 className="text-7xl font-bold text-primary">404</h1>
        <p className="font-medium text-accent">Page Not Found</p>
      </div>
      <Button
        size="large"
        type="primary"
        onClick={() => navigate("/")}
        children={
          i18n.language == "uz"
            ? "Bosh Sahifaga qaytish"
            : "Вернуться на главную страницу"
        }
      />
    </div>
  );
};

export default NotFound;
