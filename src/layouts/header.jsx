import { useTranslation } from "react-i18next";
import Logo from "../assets/images/feliza-logo.png";
import LogoWhite from "../assets/images/white-logo.png";
import LanguageSelector from "../components/header/language-selector";
import { CiSearch } from "react-icons/ci";
import { Button, Input } from "antd";
import { useEffect, useState } from "react";
import UserAuth from "../components/header/user-auth";
import { HeaderBoard } from "../components/header/header-board";
import { HeaderSearch } from "../components/header/header-search";
import { useLocation, useNavigate } from "react-router-dom";
import FavoritesIcon from "../components/header/favorites-icon";
import CartIcon from "../components/header/cart-icon";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [showBoard, setShowBoard] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [brandName, setBrandName] = useState("");
  const [scrolled, setScrolled] = useState(false);

  const handleBoard = (name) => {
    setShowSearch(false);
    setBrandName(name);
    setShowBoard(true);

    if (name == brandName) {
      setShowBoard(false);
      setBrandName("");
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        !e.target.closest(".brand-name") &&
        !e.target.closest(".header-board")
      ) {
        setShowBoard(false);
        setBrandName("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div>
      <div className="hidden lg:flex items-center justify-between  max-w-[1280px] px-3 mx-auto py-5">
        <div className="hidden md:flex items-center justify-between gap-12">
          <p
            className="brand-name font-tenor font-normal text-xl pb-2 cursor-pointer"
            style={{
              borderBottom: brandName == "Kiyimlar" && "1px solid black",
            }}
            onClick={() => handleBoard("Kiyimlar")}
          >
            {t("header.catalog")}
          </p>
          <p
            className="brand-name font-tenor font-normal text-xl pb-2 cursor-pointer"
            style={{ borderBottom: brandName == "Nessa" && "1px solid black" }}
            onClick={() => handleBoard("Nessa")}
          >
            {t("header.nessa")}
          </p>

          <p
            className="flex items-center gap-2 text-secondary font-normal text-xs leading-[100%] cursor-pointer"
            onClick={() => (
              setShowSearch(true), setShowBoard(false), setBrandName("")
            )}
          >
            <CiSearch size={18} /> {t("search")}
          </p>
        </div>
        <div
          className="cursor-pointer"
          onClick={() => (
            navigate("/"),
            setShowBoard(false),
            setBrandName(""),
            window.scrollTo({ top: 0, behavior: "smooth" })
          )}
        >
          <img src={Logo} />
        </div>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center justify-between gap-[53px]">
            <FavoritesIcon />
            <CartIcon />
            <UserAuth />
            <LanguageSelector />
          </div>
        </div>
      </div>

      <div
        style={{ display: location.pathname == "/" ? "" : "none" }}
        className="relative lg:hidden"
      >
        <div
          className={`${scrolled ? "bg-black/10" : ""
            } flex flex-col justify-center absolute text-center w-full align-middle transition-all duration-700 gap-3`}
        >
          <div className="w-full flex justify-center text-white px-2">
            <img
              loading="lazy"
              className={scrolled ? "scale-75" : ""}
              src={LogoWhite}
            />
          </div>

          {scrolled ? (
            <Button
              type="text"
              icon={<CiSearch color="white" size={26} />}
              className="!absolute !left-4 !bottom-0 text-white"
              onClick={() => (
                setShowSearch(true), setShowBoard(false), setBrandName("")
              )}
            />
          ) : (
            <Input
              onClick={() => (
                setShowSearch(true), setShowBoard(false), setBrandName("")
              )}
              placeholder={t("search")}
              className="!bg-transparent !placeholder-white !mx-auto !w-10/12"
            />
          )}
        </div>
      </div>

      {showBoard && (
        <div className="header-board">
          <HeaderBoard
            setShowBoard={setShowBoard}
            setBrandName={setBrandName}
            brand={brandName}
          />
        </div>
      )}
      {showSearch && (
        <HeaderSearch setShowSearch={setShowSearch} brand={brandName} />
      )}
    </div>
  );
};

export default Header;
