import { Button, Input, Spin } from "antd";
import { useTranslation } from "react-i18next";
import { IoMdClose } from "react-icons/io";
import { useEffect, useState } from "react";
import { useGetById } from "../../services/query/useGetById";
import { useNavigate } from "react-router-dom";
import { MdHistory } from "react-icons/md";

const STORAGE_KEY = "search-history";

export const HeaderSearch = ({ setShowSearch }) => {
  const { i18n, t } = useTranslation();
  const [search, setSearch] = useState("");
  const [history, setHistory] = useState([]);
  const { data, isLoading } = useGetById("/api/product/searchProduct/", search);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setHistory(JSON.parse(stored));
  }, []);

  const saveSearchToHistory = (query) => {
    if (!query.trim()) return;
    let updated = [query, ...history.filter((item) => item !== query)];
    if (updated.length > 10) updated = updated.slice(0, 10); // Max 10 ta
    setHistory(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const handleNavigate = () => {
    if (search.trim() && data?.length > 0) {
      saveSearchToHistory(search.trim());
      navigate(`/searchResult?search=${search.trim()}`);
      setShowSearch(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="absolute bg-white w-full min-h-[500px] max-h-[750px] space-y-10 overflow-hidden">
      <div className="flex justify-center items-center h-full pt-14 mx-3">
        <Input.Search
          autoFocus
          value={search}
          allowClear
          style={{ borderBottomColor: "#0d0d0d" }}
          variant="outlined"
          className="lg:max-w-[800px]"
          placeholder={t("search")}
          onChange={(e) => setSearch(e.target.value)}
          enterButton={t("search")}
          onSearch={handleNavigate}
          size="large"
        />
        <Button
          className="!absolute right-3 lg:right-20 top-3 lg:top-14 !font-tenor !font-normal !text-sm"
          icon={<IoMdClose size={21} />}
          onClick={() => setShowSearch(false)}
          children={t("header.close")}
        />
      </div>

      {/*Search History */}
      {search.trim() === "" && history.length > 0 && (
        <div className="lg:max-w-[800px] mx-auto px-4 space-y-1 font-tenor font-normal">
          <div className="flex items-center gap-4 mb-7 md:mb-10">
            <MdHistory size={24} />
            <h2 className="text-primary">
              {i18n == "uz" ? "Yaqinda qidirilgan" : "Недавно искали"}
            </h2>
          </div>
          <div
            style={{ scrollbarWidth: "none" }}
            className="flex flex-col gap-3 md:gap-5 max-h-screen md:max-h-[300px] overflow-y-scroll md:pr-3"
          >
            {history.map((item, idx) => (
              <div className="flex justify-between items-center gap-5">
                <div
                  key={idx}
                  onClick={() => setSearch(item)}
                  className="flex justify-between items-center p-2 gap-5 text-accent hover:text-primary text-xl w-full"
                >
                  <p>{item}</p>
                </div>
                <IoMdClose
                  size={24}
                  className="cursor-pointer"
                  onClick={() => {
                    const updated = history.filter((h) => h !== item);
                    setHistory(updated);
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div
        style={{ scrollbarWidth: "none" }}
        className="space-y-2 overflow-y-scroll overflow-hidden max-h-[400px] pb-3 lg:max-w-[800px] mx-auto"
      >
        {isLoading ? (
          <div className="text-center">
            <Spin />
          </div>
        ) : (
          data?.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                navigate("/productDetail/" + item.id);
                saveSearchToHistory(search);
                setShowSearch(false);
              }}
              className="p-1 duration-300 cursor-pointer flex items-center gap-3 border-b"
            >
              <img
                loading="lazy"
                src={item?.productImages[0]?.url}
                className="size-14 lg:size-20 object-cover rounded-tr-sm"
                alt=""
                style={{ opacity: item.active ? "100%" : "50%" }}
              />
              <h1
                className={`font-tenor font-normal text-base ${
                  item.active ? "text-primary" : "text-secondary"
                }`}
              >
                {i18n.language === "uz" ? item.nameUZB : item.nameRUS}
              </h1>
            </div>
          ))
        )}

        {search && data?.length === 0 && (
          <h1 className="text-center font-tenor font-normal text-xl text-red-500">
            {t("product-not-found")}
          </h1>
        )}
      </div>
    </div>
  );
};
