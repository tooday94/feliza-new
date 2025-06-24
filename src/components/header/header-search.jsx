import { Button, Input, Skeleton, Spin } from "antd";
import { useTranslation } from "react-i18next";
import { IoMdClose } from "react-icons/io";
import { useState } from "react";
import { useGetById } from "../../services/query/useGetById";
import { useNavigate } from "react-router-dom";

export const HeaderSearch = ({ setShowSearch }) => {
  const { i18n, t } = useTranslation();
  const [search, setSearch] = useState("");
  const { data, isLoading } = useGetById("/api/product/searchProduct/", search);
  const navigate = useNavigate();
  console.log(search);

  const handleNavigate = () => {
    if ((search && data.length > 0) || value.trim()) {
      navigate(`/searchResult?search=${search}`), setShowSearch(false);
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
          onSearch={() => handleNavigate()}
        />
        <Button
          className="!absolute right-3 lg:right-20 top-3 lg:top-14 !font-tenor !font-normal !text-sm"
          icon={<IoMdClose size={21} />}
          onClick={() => setShowSearch(false)}
          children={t("header.close")}
        />
      </div>

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
              onClick={() => (
                navigate("/productDetail/" + item.id), setShowSearch(false)
              )}
              className="p-1 duration-300 cursor-pointer flex items-center gap-3 border-b"
            >
              <img
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
                {i18n.language == "uz" ? item.nameUZB : item.nameRUS}
              </h1>
            </div>
          ))
        )}

        {search && data?.length == 0 && (
          <h1 className="text-center font-tenor font-normal text-xl text-red-500">
            {t("product-not-found")}
          </h1>
        )}
      </div>
    </div>
  );
};
