import { Select } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const handleChange = (e) => {
    const selectedLanguage = e;
    i18n.changeLanguage(selectedLanguage);
  };

  return (
    <div className="w-fit hidden md:block">
      <Select
        open={open}
        onOpenChange={(visible) => setOpen(visible)}
        variant="borderless"
        value={i18n.language}
        onChange={handleChange}
        className="w-[110px] !text-sm !font-tenor !relative"
        suffixIcon={
          open ? (
            <IoIosArrowUp
              color="#0d0d0d"
              width={2}
              style={{
                fontSize: "18px",
              }}
            />
          ) : (
            <IoIosArrowDown
              color="#0d0d0d"
              width={2}
              style={{
                fontSize: "18px",
              }}
            />
          )
        }
        options={[
          {
            value: "ru",
            label: "Русский",
            className:
              "!font-tenor !font-bold !bg-transparent !py-2 border-b border-[#bbb] !rounded-none",
          },
          {
            value: "uz",
            label: "O‘zbek",
            className: "!font-tenor !font-bold !bg-transparent !py-2",
          },
        ]}
        styles={{
          popup: {
            root: {
              background: "white",
              width: "160px",
              padding: "5px 20px",
              scrollbarWidth: "none",
              position: "fixed",
              top: "80px",
              borderRadius: 0,
              border: "2px solid #bbb",
            },
          },
        }}
      />
    </div>
  );
};

export default LanguageSelector;
