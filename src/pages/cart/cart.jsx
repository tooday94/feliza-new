import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";
import { Button, Checkbox, Drawer, Modal } from "antd";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { MdOutlineEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useDeleteById } from "../../services/mutations/useDeleteById";
import CartInfoIcon from "../../assets/icons/cart-info-icon";
import { PiMinus, PiPlus } from "react-icons/pi";
import { useGetById } from "../../services/query/useGetById";
import { useUpdateById } from "../../services/mutations/useUpdateById";
import { OrderCard } from "../../components/cart/order-card";
import formatPrice from "../../utils/formatPrice";
import { useDeleteGroup } from "../../services/mutations/useDeleteGroup";
import { toast } from "react-toastify";
const Cart = () => {
  const [deletingId, setdeletingId] = useState(null);
  const [isBuying, setisBuying] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { i18n, t } = useTranslation();
  const userID = Cookies.get("USER-ID");
  const { data, isLoading } = useGetById("/api/cartItem/byCustomerId/", userID);
  const [selectedEditCart, setselectedEditCart] = useState("");
  const [selectedEditProductId, setselectedEditProductId] = useState("");
  const [selectedEditCartId, setselectedEditCartId] = useState("");
  const [selectedEditProductSize, setselectedEditProductSize] = useState("");
  const { data: cartItem } = useGetById(
    "/api/product/searchProduct/",
    selectedEditCart
  );

  const [cart, setCart] = useState([]);
  const [checkAll, setCheckAll] = useState(false);

  useEffect(() => {
    setCheckAll(cart?.length === data?.length);
  }, [cart]);

  const handleCheck = (id, checked) => {
    setCart((prev) => {
      if (checked) {
        return prev.includes(id) ? prev : [...prev, id];
      } else {
        return prev.filter((item) => item !== id);
      }
    });
  };

  const handleCheckAll = (e) => {
    const checked = e.target.checked;

    setCheckAll(checked);
    if (checked) {
      const availableIds = data
        .filter((item) => item.productSizeVariant.quantity > 0)
        .map((item) => item.cartItemId);

      setCart(availableIds);
    } else {
      setCart([]);
    }
  };

  const selectedItems = data?.filter((item) =>
    cart?.includes(item?.cartItemId)
  );

  const sum = selectedItems?.reduce((acc, item) => {
    const price = item.salePrice || item.sellPrice || 0;
    return acc + price * (item.quantity || 1);
  }, 0);

  const { mutate, isPending } = useDeleteById("/api/cartItem/");

  const handleDelete = (id) => {
    setdeletingId(id);
    mutate(id, {
      onSuccess: () => {
        toast.success(
          i18n.language == "uz"
            ? "Mahsulot Savatchadan olib tashlandi!"
            : "Товар удален из корзины!",
          {
            position: "top-center",
          }
        );
      },
    });
  };

  const filteredProduct =
    cartItem?.filter((product) => product.id === selectedEditProductId) || [];

  const [quantityEdit, setquantityEdit] = useState(1);

  const { mutate: updateCart, isPending: updateCartLoading } = useUpdateById(
    "/api/cartItem/",
    "/api/cartItem/byCustomerId/"
  );

  const handleEdit = () => {
    updateCart(
      {
        id: selectedEditCartId,
        data: {
          customerId: userID,
          productSizeVariantId: selectedEditProductSize,
          quantity: quantityEdit,
        },
      },
      {
        onSuccess: () => {
          setIsModalOpen(false);
        },
        onError: (error) => {
          console.log(error);
        },
      }
    );
  };

  const { mutate: deleteCartGroup, isPending: deleteGroupLoading } =
    useDeleteGroup(
      "/api/cartItem/deleteCartItemGroup",
      "/api/cartItem/byCustomerId/"
    );

  return (
    <>
      {!userID || data?.length == 0 || isLoading ? (
        <div className="flex flex-col  items-center h-full min-h-screen gap-40 pt-10">
          <h1 className="font-tenor font-normal  text-2xl">
            {t("cart.title")}
          </h1>

          <div className="flex flex-col justify-center items-center space-y-10">
            <CartInfoIcon />

            <div className="text-center font-tenor font-normal space-y-5">
              <h1 className="text-primary text-xl">
                {t("cart.empty-cart-info.title")}
              </h1>
              <p className="text-sm text-secondary">
                {t("cart.empty-cart-info.desc")}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex relative">
          <div className="bg-background w-full p-3 lg:p-10 lg:pl-28">
            <div className="flex flex-col items-center gap-3 justify-between pb-8">
              <div className=""></div>
              <div className="flex gap-2.5">
                <h1 className="font-tenor font-normal  text-2xl">
                  {t("cart.title")}
                </h1>
                <span className="text-secondary text-xl ">
                  ({data?.length})
                </span>
              </div>
              <div className="w-full flex gap-2.5 items-center justify-between">
                <div className="">
                  {cart.length > 0 && (
                    <div
                      className="flex  items-center gap-2.5 cursor-pointer"
                      onClick={() => deleteCartGroup({ cartIds: cart })}
                    >
                      <RiDeleteBin6Line size={24} />
                      <button
                        className="font-tenor cursor-pointer"
                        children={
                          i18n.language == "uz" ? "o'chirish" : "удалить"
                        }
                        loading={deleteGroupLoading}
                      />
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2.5">
                  <Checkbox
                    style={{
                      width: "24px",
                      height: "24px",
                      transform: "scale(1.5)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    checked={checkAll}
                    onChange={handleCheckAll}
                    className="!font-tenor"
                  />
                  <span className="font-tenor font-normal text-base text-primary">
                    {t("cart.select-all")}
                  </span>
                </div>
              </div>
            </div>
            {data?.map((item) => (
              <div
                key={item?.cartItemId}
                className="flex gap-3 lg:gap-10 border-b border-accent py-5"
              >
                <div className="relative">
                  {item.sale > 0 && (
                    <p className="absolute top-3.5 font-tenor font-normal text-xs text-white bg-gold w-fit px-2 py-1">
                      -{item.sale}%
                    </p>
                  )}

                  <img
                    className="w-[130px] min-w-[100px]"
                    src={item.productImages[0].url}
                    alt=""
                  />
                </div>

                <div className="w-full flex flex-col justify-between">
                  <div className="lg:pb-16">
                    <div className="flex justify-between items-center w-full lg:pb-5 gap-3">
                      <h1 className="font-tenor font-normal text-lg lg:text-xl text-primary leading-[150%]">
                        {i18n.language == "uz" ? item.nameUZB : item.nameRUS}
                      </h1>
                      {item.productSizeVariant.quantity == 0 ? (
                        <p className="font-tenor font-normal text-sm text-red-500">
                          {i18n.language == "uz"
                            ? "Mahsulot qolmagan"
                            : "Товаров не осталось."}
                        </p>
                      ) : (
                        <Checkbox
                          style={{
                            width: "24px",
                            height: "24px",
                            transform: "scale(1.5)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                          checked={cart.includes(item.cartItemId)}
                          onChange={(e) =>
                            handleCheck(item.cartItemId, e.target.checked)
                          }
                        />
                      )}
                    </div>
                    <p className="font-tenor font-normal text-base text-primary">
                      {item.salePrice
                        ? formatPrice(item.salePrice)
                        : formatPrice(item.sellPrice)}{" "}
                      {t("cart.sum")}
                    </p>
                    <p
                      className={`${
                        item.sale > 0 && "line-through"
                      } font-tenor font-normal text-xs text-secondary`}
                    >
                      {item.salePrice && formatPrice(item.sellPrice)}
                    </p>
                  </div>

                  <div className="flex justify-between items-center flex-wrap gap-3">
                    <div className="flex flex-col lg:flex-row gap-0 lg:gap-3">
                      <h1 className="font-tenor font-normal text-sm text-accent leading-[150%]">
                        {t("cart.color")}:{" "}
                        {i18n.language == "uz"
                          ? item.colorNameUZB
                          : item.colorNameRUS}
                      </h1>
                      <h1 className="font-tenor font-normal text-sm text-accent leading-[150%]">
                        {t("cart.size")}: {item.productSizeVariant.size}
                      </h1>
                      {/* <h1 className="font-tenor font-normal text-sm text-accent leading-[150%]">
                        {t("cart.quantity")}: {item?.quantity}
                      </h1> */}
                    </div>

                    <div className="flex gap-10 w-full lg:w-fit justify-end">
                      <div className="flex gap-5 items-center">
                        <Button
                          loading={updateCartLoading}
                          icon={
                            <PiMinus
                              color={
                                item?.quantity <= 1 ? "#5b5b5b" : "#0d0d0d"
                              }
                            />
                          }
                          disabled={item?.quantity <= 1}
                          onClick={() => {
                            const newQuantity = item?.quantity - 1;

                            updateCart(
                              {
                                id: item?.cartItemId,
                                data: {
                                  customerId: userID,
                                  productSizeVariantId:
                                    item?.productSizeVariant?.id,
                                  quantity: newQuantity,
                                },
                              },
                              {
                                onSuccess: () => {
                                  setIsModalOpen(false);
                                },
                                onError: (error) => {
                                  console.log(error);
                                },
                              }
                            );
                          }}
                        />
                        <p className="font-tenor font-normal text-xl text-primary">
                          {item.quantity}
                        </p>
                        <Button
                          loading={updateCartLoading}
                          disabled={
                            item.productSizeVariant.quantity == 0 ||
                            item.quantity >= item.productSizeVariant.quantity
                          }
                          // disabled={
                          //   item.productSizeVariant.quantity == item?.quantity
                          // }
                          icon={<PiPlus color="#0d0d0d" />}
                          onClick={() => {
                            const newQuantity = item?.quantity + 1;

                            updateCart(
                              {
                                id: item?.cartItemId,
                                data: {
                                  customerId: userID,
                                  productSizeVariantId:
                                    item?.productSizeVariant?.id,
                                  quantity: newQuantity,
                                },
                              },
                              {
                                onSuccess: () => {
                                  setIsModalOpen(false);
                                },
                                onError: (error) => {
                                  console.log(error);
                                },
                              }
                            );
                          }}
                        />
                      </div>

                      <MdOutlineEdit
                        className="cursor-pointer"
                        onClick={() => (
                          setIsModalOpen(true),
                          setselectedEditCart(item?.productRefNumber),
                          setselectedEditProductId(item?.productId),
                          setquantityEdit(item.quantity),
                          setselectedEditProductSize(
                            item.productSizeVariant.id
                          ),
                          setselectedEditCartId(item.cartItemId)
                        )}
                        size={24}
                      />
                      <Button
                        className="!border-none !bg-transparent hover:!text-red-500 !duration-300"
                        loading={deletingId == item.cartItemId && isPending}
                        onClick={() => handleDelete(item.cartItemId)}
                        icon={<RiDeleteBin6Line size={24} />}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white max-w-[464px] w-full h-full min-h-[738px] hidden lg:flex">
            {isBuying ? (
              <div className="w-full">
                <OrderCard sum={sum} cart={cart} />
              </div>
            ) : (
              <div className="max-w-[464px] w-full h-full p-10 min-h-[738px] hidden lg:flex flex-col justify-between">
                <div className="">
                  <div className="flex justify-between items-center font-tenor font-normal">
                    <h1 className="text-xl text-primary">{t("cart.buy")}</h1>
                    <p className="text-sm text-secondary">
                      {cart.length > 0 &&
                        cart?.length + " " + t("cart.selected-product")}
                    </p>
                  </div>
                  <div className="">
                    {selectedItems?.map((item) => (
                      <div className="flex justify-between items-center border-b border-dashed py-5">
                        <h1 className="font-tenor font-normal text-sm text-primary">
                          {i18n.language === "uz" ? item.nameUZB : item.nameRUS}
                        </h1>
                        <p className="font-tenor font-normal text-sm text-primary">
                          {item.salePrice
                            ? formatPrice(item.salePrice)
                            : formatPrice(item.sellPrice)}

                          {" " + t("cart.sum")}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {cart?.length == 0 && (
                  <div className="">
                    <h1 className="text-center font-tenor font-normal text-base text-accent">
                      {t("cart.buy-info")}
                    </h1>
                  </div>
                )}
                <div className="space-y-5">
                  <div className="">
                    <div className="flex justify-between items-center font-tenor font-normal text-base text-primary border-b pb-5">
                      {cart?.length > 0 && (
                        <>
                          <h1>{t("cart.all-sum")}:</h1>
                          <h1 className="">
                            {formatPrice(sum)} {t("cart.sum")}
                          </h1>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="">
                    <div className="flex gap-2 items-center font-tenor font-normal text-base text-primary pb-3">
                      <IoIosInformationCircleOutline size={18} />
                      <h1>{t("cart.pay-info.title")}</h1>
                    </div>

                    <p className="font-tenor font-normal text-sm text-secondary lg:pb-10">
                      {t("cart.pay-info.desc")}
                    </p>

                    <Button
                      className="!rounded-none !h-12"
                      type="primary"
                      block
                      children={t("cart.buy")}
                      onClick={() => setisBuying(true)}
                      disabled={cart.length == 0 ? true : false}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="fixed lg:hidden bottom-20 p-2  w-full bg-white border-y">
            <div className="space-y-2">
              <div className="">
                <div className="flex justify-between items-center font-tenor font-normal text-base text-primary border-b pb-5">
                  {cart?.length > 0 ? (
                    <>
                      <h1>{t("cart.all-sum")}:</h1>
                      <h1 className="">
                        {formatPrice(sum)} {t("cart.sum")}
                      </h1>
                    </>
                  ) : (
                    <>
                      <h1>{t("cart.all-sum")}:</h1>
                      <h1 className="">0 {t("cart.sum")}</h1>
                    </>
                  )}
                </div>
              </div>

              <Button
                className="!rounded-none"
                type="primary"
                block
                children={t("cart.buy")}
                onClick={() => setIsDrawerOpen(true)}
                disabled={cart.length == 0 ? true : false}
              />
            </div>
          </div>
        </div>
      )}

      <Modal
        closable={{ "aria-label": "Custom Close Button" }}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={false}
        maskClosable={false}
        loading={updateCartLoading}
      >
        <div className="">
          {filteredProduct?.map((item) => (
            <div className="flex gap-8 pb-7">
              <div className="relative">
                {item.sale > 0 && (
                  <p className="absolute top-3.5 font-tenor font-normal text-xs text-white bg-gold w-fit px-2 py-1">
                    -{item.sale}%
                  </p>
                )}

                <img
                  className="w-[100px]"
                  src={item.productImages[0].url}
                  alt=""
                />
              </div>

              <div className="w-full flex flex-col justify-between">
                <div className="">
                  <div className="flex justify-between items-center w-full lg:pb-5">
                    <h1 className="font-tenor font-normal text-xl text-primary leading-[150%]">
                      {i18n.language == "uz" ? item.nameUZB : item.nameRUS}
                    </h1>
                  </div>
                  <p className="font-tenor font-normal text-base text-primary">
                    {item.salePrice
                      ? item.salePrice
                      : formatPrice(item.sellPrice)}{" "}
                    {t("cart.sum")}
                  </p>
                  <p
                    className={`${
                      item.sale > 0 && "line-through"
                    } font-tenor font-normal text-xs text-secondary`}
                  >
                    {item.salePrice && formatPrice(item.sellPrice)}
                  </p>
                </div>
              </div>
            </div>
          ))}

          <div className="my-7 space-y-4">
            <h1 className="font-tenor font-normal text-sm text-secondary">
              {t("cart.color")}:{" "}
              {i18n.language == "uz"
                ? filteredProduct[0]?.color?.nameUZB
                : filteredProduct[0]?.color?.nameRUS}
            </h1>
            <div className="flex gap-4">
              {cartItem?.map((item) => (
                <div className="">
                  <img
                    className={`w-12 ${
                      selectedEditProductId == item.id ? "border-2" : ""
                    } ${item?.active ? "opacity-100" : "opacity-50"}`}
                    src={item.productImages[0]?.url}
                    alt=""
                    onClick={() => setselectedEditProductId(item.id)}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="font-tenor font-normal text-sm text-secondary">
              {t("cart.size")}:{" "}
              {filteredProduct[0]?.productSizeVariantList?.map(
                (item) =>
                  item?.id === selectedEditProductSize && <>{item.size}</>
              )}
            </h1>
            <div className="flex gap-4">
              {filteredProduct[0]?.productSizeVariantList?.map((item) => (
                <div>
                  <Button
                    className={`w-fit !rounded-none !border !border-primary !font-tenor !font-normal !text-sm ${
                      item.id == selectedEditProductSize
                        ? "!bg-primary !text-white"
                        : "!bg-white !text-primary"
                    } ${item.quantity == 0 ? "opacity-50" : "opacity-100"}`}
                    disabled={item.quantity == 0 ? true : false}
                    onClick={() => setselectedEditProductSize(item.id)}
                  >
                    {item?.size}
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-7 pb-16 pt-7">
            <h1 className="font-tenor font-normal text-sm text-secondary">
              {t("cart.quantity")}:
            </h1>

            <div className="flex gap-7 items-center">
              <Button
                icon={
                  <PiMinus color={quantityEdit == 1 ? "#5b5b5b" : "0d0d0d"} />
                }
                onClick={() =>
                  setquantityEdit(
                    quantityEdit != 1 ? quantityEdit - 1 : quantityEdit
                  )
                }
              />
              <p className="font-tenor font-normal text-xl text-primary">
                {quantityEdit}
              </p>
              <Button
                disabled={
                  filteredProduct[0]?.productSizeVariantList?.find(
                    (item) => item.id === selectedEditProductSize
                  )?.quantity <= quantityEdit
                    ? true
                    : false
                }
                icon={<PiPlus color="#0d0d0d" />}
                onClick={() => setquantityEdit(quantityEdit + 1)}
              />
            </div>
          </div>

          <div className="">
            <Button
              onClick={() => handleEdit()}
              block
              className="!rounded-none !h-12"
              type="primary"
              children={t("cart.save")}
            />
          </div>
        </div>
      </Modal>

      <Drawer
        closable={{ "aria-label": "Close Button" }}
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
        maskClosable={false}
      >
        <OrderCard sum={sum} cart={cart} />
      </Drawer>
    </>
  );
};

export default Cart;
