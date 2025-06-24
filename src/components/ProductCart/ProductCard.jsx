import React, { useEffect, useState } from 'react';
import { IoIosHeart, IoIosHeartEmpty } from "react-icons/io";
import { useTranslation } from 'react-i18next';
import { RiShoppingBag4Line } from "react-icons/ri";
import { Button, Modal, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useCreate } from '../../services/mutations/useCreate';
import { endpoints } from '../../configs/endpoints';
import { toast } from 'react-toastify';
import { useDeleteById } from '../../services/mutations/useDeleteById';
import { useGetById } from './../../services/query/useGetById';
import { useGetList } from '../../services/query/useGetList';
import { OrderCard } from '../cart/order-card';
import { Drawer } from 'antd'; // Antd Drawer



const ProductCard = ({ item, onLike }) => {
    const { i18n } = useTranslation();
    const hasDiscount = item.sale > 0;
    const navigate = useNavigate();
    const userID = Cookies.get("USER-ID");

    const [messageApi, contextHolder] = message.useMessage();
    const { mutate } = useCreate(endpoints.favorites.addFavoriteItem)
    const { mutate: addCart } = useCreate(endpoints.cart.addCartItem)
    const { mutate: addOrder } = useCreate(endpoints.cart.addCartItem)
    const { mutate: deleteItem } = useDeleteById(endpoints.favorites.deleteFavriteItem)
    const { data, isLoading } = useGetById(endpoints.favorites.getFavorites, userID)
    const { data: productVariants, isLoading: loadvar } = useGetList(endpoints.products.searchProduct + item?.referenceNumber)
    const [isLiked, setIsLiked] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedColorIndex, setSelectedColorIndex] = useState(0);
    const [selectedSize, setSelectedSize] = useState("");
    const [cartItemId, setcartItemId] = useState("")
    const [drawerOpen, setDrawerOpen] = useState(false); // yon panel



    console.log(" productVariants", productVariants);


    // Foydalanuvchi sevimlilari orasida item mavjudligini tekshirish uchun
    useEffect(() => {
        if (data && item) {
            const liked = data.some(fav => fav.product?.id === item.id);
            setIsLiked(liked);
        }
    }, [data, item]);


    // karzina qoshish
    const addToCart = () => {

        if (!userID) {
            toast.error(i18n.language === 'uz' ? "Iltimos,ro'yxatdan o'ting" : "Пожалуйста, войдите в систему", {
                autoClose: 1000
            });
            return;
        }
        const selectedColorVariant = productVariants[selectedColorIndex];
        const selectedSizeVariant = selectedColorVariant?.productSizeVariantList.find(
            (item) => item.size === selectedSize
        );

        if (!selectedColorVariant || !selectedSizeVariant) {
            toast.error(i18n.language === 'uz' ? "Rang yoki razmer tanlanmagan" : "Не выбран цвет или размер");
            return;
        }

        console.log({
            customerId: userID,
            productSizeVariantId: selectedSizeVariant.id,
            quantity: 1,
        },);
        addCart(
            {
                customerId: userID,
                productSizeVariantId: selectedSizeVariant.id,
                quantity: 1,
            },
            {
                onSuccess: () => {
                    toast.success(i18n.language === 'uz' ? "Savatga qo‘shildi" : "Добавлено в корзину", {
                        onClose: () => {
                            setIsOpen(false);
                        },
                        autoClose: 1000
                    });
                },
            },
            {
                onError: () => {
                    toast.error(i18n.language === 'uz' ? "Iltimos,ro'yxatdan o'ting" : "Пожалуйста, войдите в систему");
                },
            }
        );
    };

    // sotib olish uchun funksiya
    const addOrders = () => {
        const selectedColorVariant = productVariants?.[selectedColorIndex];

        if (!selectedColorVariant) {
            toast.error(i18n.language === 'uz' ? "Iltimos, rang tanlang" : "Пожалуйста, выберите цвет");
            return;
        }

        const selectedSizeVariant = selectedColorVariant.productSizeVariantList?.find(
            (variant) => variant.size === selectedSize
        );

        if (!selectedSizeVariant) {
            toast.error(i18n.language === 'uz' ? "Iltimos, razmer tanlang" : "Пожалуйста, выберите размер");
            return;
        }

        addOrder(
            {
                customerId: userID,
                productSizeVariantId: selectedSizeVariant.id,
                quantity: 1,
            },
            {
                onSuccess: (data) => {
                    setcartItemId(data.cartItemId);
                    setDrawerOpen(true); // ✅ Drawer ochiladi
                },
                onError: () => {
                    toast.error(i18n.language === 'uz' ? "Iltimos,ro'yxatdan o'ting" : "Пожалуйста, войдите в систему", {
                        autoClose: 1000
                    });
                },
            }
        );
    };


    // sevimlilarga qoshish
    const addToFavorites = () => {
        // agar foydalanuvchi ro`yhatdan o`tmagan bo`lsa
        if (!userID) {
            toast.error(i18n.language === 'uz' ? "Iltimos,ro'yxatdan o'ting" : "Пожалуйста, войдите в систему", {
                autoClose: 1000
            });
            return;
        }
        mutate({
            customerId: userID,
            productId: item.id,
        },
            {
                onSuccess: () => {
                    toast.success(
                        i18n.language === 'uz'
                            ? 'Mahsulot sevimlilarga qo`shildi'
                            : 'Товар добавлен в избранное',
                        {
                            onClose: () => {
                                setIsLiked(true);
                            },
                            autoClose: 1000
                        }
                    );
                }
            }

        )
    }

    // delete sevimlilardan olish funksiyasi
    const deleteFavoritesItem = () => {
        const filteredData = data?.filter(items => items?.product?.id == item.id);
        console.log(item.id);
        console.log(filteredData);
        deleteItem(
            filteredData[0]?.id,
            {
                onSuccess: () => {
                    toast.success(i18n.language === 'uz' ? 'Mahsulot sevimlilardan o`chirildi' : "Товар удален из избранного", {
                        onClose: () => {
                            setIsLiked(false);
                        },
                        autoClose: 1000
                    })

                }
            },
            {
                onError: () => {
                    toast.error(i18n.language === 'uz' ? "Iltimos,ro'yxatdan o'ting" : "Пожалуйста, войдите в систему");
                }
            }
        )
    }

    const handleLikeClick = () => {
        if (isLiked) {
            deleteFavoritesItem();
        } else {
            addToFavorites();
        }
    };


    const handleAddToCart = () => {
        const openModal = () => {
            setIsOpen(true);
        };
        openModal();
    };
    return (
        <div className="bg-white shadow-md overflow-hidden relative hover:shadow-sm transition-shadow duration-300">
            <div>
                {contextHolder}
                <button
                    className="absolute top-3 right-3 bg-white rounded-full p-1 hover:shadow-lg disabled:opacity-50"
                    onClick={() => {
                        const quantity = productVariants[0]?.productSizeVariantList[0]?.quantity;
                        if (quantity > 0) {
                            handleLikeClick();
                        } else {
                            toast.warning(i18n.language === 'uz'
                                ? "Mahsulot qolmagan, sevimlilarga qo‘shib bo‘lmaydi"
                                : "Товар закончился, нельзя добавить в избранное", {
                                autoClose: 1000
                            });
                        }
                    }}
                >
                    {isLiked ? (
                        <IoIosHeart className="text-[#0D0D0D] w-6 h-6 cursor-pointer" />
                    ) : (
                        <IoIosHeartEmpty className="text-black hover:text-black w-6 h-6 cursor-pointer" />
                    )}
                </button>

                {hasDiscount && (
                    <div className="absolute top-4 left-3 bg-[#EEB415] text-white text-xs font-bold px-2 py-1 rounded">
                        {item.sale}%
                    </div>
                )}

                <img
                    onClick={() => navigate(`/productDetail/${item.id}`,
                        window.scrollTo({ top: 0, behavior: 'smooth' })
                    )}
                    src={item?.productImages?.[0]?.url}
                    alt={i18n.language === 'uz' ? item.nameUZB : item.nameRUS}
                    className="w-full md:h-[365px] h-auto object-cover cursor-pointer"
                />
                <div className='flex items-center justify-between'>
                    <div className="p-4 space-y-1">
                        <h2 className="text-md font-semibold text-gray-800 line-clamp-1">
                            {i18n.language === 'uz' ? item.nameUZB : item.nameRUS}
                        </h2>
                        <div className="text-gray-900 font-semibold space-x-2">
                            {hasDiscount ? (
                                <>
                                    <span className="text-gray-600">{item.salePrice} {i18n.language === 'uz' ? 'so\'m' : 'со\'м'}</span><br />
                                    <span className="text-sm text-gray-500 line-through">{item.sellPrice} {i18n.language === 'uz' ? 'so\'m' : 'со\'м'}</span>
                                </>
                            ) : (
                                <span>{item.sellPrice} {i18n.language === 'uz' ? 'so\'m' : 'со\'м'}</span>
                            )}
                        </div>
                    </div>
                    <button className='px-3 group'
                        onClick={handleAddToCart}
                    >
                        <RiShoppingBag4Line className='text-2xl cursor-pointer transition duration-300 group-hover:scale-110 group-hover:text-black' />
                    </button>
                </div>
            </div>
            {/* handleAddToCart bosganida modal paydo bolish uchun bolim */}
            {
                isOpen && (
                    <Drawer
                        open={isOpen}
                        onClose={() => setIsOpen(false)}
                        footer={false}
                        maskClosable={false}
                        width={464}
                        className="custom-modal"
                        bodyStyle={{
                            padding: "10px",
                            backgroundColor: "#fff",
                            borderRadius: "1rem",
                        }}
                    >
                        {productVariants.length > 0 && (
                            <div className="space-y-4 font-tenor text-[#0D0D0D]">
                                {/* Umumiy ma'lumotlar */}
                                <div className="space-y-3">
                                    {/* Nomi va narxi */}
                                    <div className="text-center space-y-2">
                                        <h2 className="md:text-[20px] text-base font-light uppercase tracking-wide">
                                            {i18n.language === "uz"
                                                ? productVariants[0].nameUZB
                                                : productVariants[0].nameRUS}
                                        </h2>
                                        {productVariants[0]?.sale > 0 ? (
                                            <div className="space-y-1">
                                                <p className="md:text-[28px] text-base font-semibold">
                                                    {productVariants[0].salePrice} {i18n.language === 'uz' ? 'so\'m' : 'со\'м'}
                                                </p>
                                                <p className="text-gray-400 line-through text-[18px]">
                                                    {productVariants[0].sellPrice} {i18n.language === 'uz' ? 'so\'m' : 'со\'м'}
                                                </p>
                                            </div>
                                        ) : (
                                            <p className="md:text-[24px] text-[18px] font-semibold">
                                                {productVariants[0].sellPrice} {i18n.language === 'uz' ? 'so\'m' : 'со\'м'}
                                            </p>
                                        )}
                                    </div>

                                    {/* Rang */}
                                    <p className="text-[16px] font-medium" onClick={() => setShowColor(true)}>
                                        {i18n.language === 'uz' ? 'Rang' : 'цвет'}: {
                                            i18n.language === 'uz' ? productVariants[selectedColorIndex].color.nameUZB : productVariants[selectedColorIndex].color.nameRUS
                                        }
                                    </p>

                                    {/* Rasmlar */}
                                    <div className="flex gap-2 overflow-x-auto" style={{
                                        scrollBehavior: 'smooth',
                                        scrollbarWidth: 'none',
                                        msOverflowStyle: 'none',
                                    }}>
                                        {productVariants.map((item, index) => (
                                            <img
                                                key={index}
                                                onClick={() => {
                                                    setSelectedColorIndex(index);
                                                    setSelectedSize(""); // Rang o‘zgarsa razmerni tozalaymiz
                                                }}
                                                className={`md:w-[90px] w-[60px] h-[90px] md:h-[120px] object-cover cursor-pointer transition 
        ${selectedColorIndex === index ? "border-2 border-black shadow-md" : "border-gray-300"}`}
                                                src={item.productImages[0]?.url}
                                                alt={`Rasm ${index + 1}`}
                                            />
                                        ))}
                                    </div>
                                    {/* O‘lcham tanlash tugmalari */}
                                    <div className="flex gap-2 mt-2 flex-wrap">
                                        {productVariants[selectedColorIndex].productSizeVariantList.map((variant, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setSelectedSize(variant.size)}
                                                className={`px-4 py-2 border uppercase text-sm cursor-pointer
        ${selectedSize === variant.size
                                                        ? "bg-black text-white"
                                                        : "bg-white text-black hover:bg-gray-200"}`}
                                            >
                                                {variant.size}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Tanlangan o‘lcham ko‘rsatish */}
                                    {selectedSize && (
                                        <div className="mt-2">
                                            <span className="text-[15px] font-medium">
                                                {i18n.language === 'uz' ? "o‘lcham:" : "размер:"}
                                            </span>
                                            <button
                                                className="ml-2 text-sm uppercase"
                                                onClick={() => setShowSize(true)}
                                            >
                                                {selectedSize}
                                            </button>
                                        </div>
                                    )}

                                    {/* Xato ogohlantirish (faqat kerak bo‘lganda) */}
                                    {!selectedSize && (
                                        <p className="text-red-500 md:mt-2 mt-1 text-base">
                                            ⚠️ {i18n.language === 'uz' ? 'Iltimos, o‘lchamni tanlang!' : 'Пожалуйста, выберите размер!'}
                                        </p>
                                    )}

                                    {/* Qoldiq */}
                                    {selectedSize && (
                                        <p className="text-[16px]">
                                            {
                                                i18n.language === 'uz' ? ' Sotuvda bor' : 'В наличии'
                                            }           :{" "}
                                            <span className="text-base">
                                                {productVariants[0].productSizeVariantList[0].quantity}
                                                {i18n.language === 'uz' ? ' dona' : ' шт.'}
                                            </span>
                                        </p>
                                    )}
                                </div>

                                {/* Tugmalar */}
                                <div className="flex gap-2">

                                    {
                                        productVariants[0].productSizeVariantList[0].quantity === 0 ? (
                                            <button
                                                disabled
                                                className="flex-1 cursor-not-allowed md:h-12 h-10 border border-gray-300 bg-gray-300 text-gray-500 uppercase">
                                                {i18n.language === 'uz' ? 'Mahsulot qolmagan' : 'Товар закончился'}
                                            </button>
                                        ) : (
                                            <button
                                                className="flex-1 cursor-pointer md:h-12 h-10 border border-black hover:bg-black hover:text-white transition uppercase"
                                                onClick={addToCart}
                                            >
                                                {i18n.language === 'uz' ? 'Savatga qo‘shish' : 'Добавить в корзину'}
                                            </button>
                                        )
                                    }
                                    {
                                        productVariants[0].productSizeVariantList[0].quantity === 0 ? (
                                            <button
                                                disabled
                                                className="flex-1 cursor-not-allowed md:h-12 h-10 border border-gray-300 bg-gray-300 text-gray-500 uppercase">
                                                {i18n.language === 'uz' ? 'Mahsulot qolmagan' : 'Товар закончился'}
                                            </button>
                                        ) : (
                                            <button
                                                onClick={addOrders} className="flex-1 cursor-pointer md:h-12 h-10 bg-black text-white hover:bg-gray-800 transition uppercase">
                                                {i18n.language === 'uz' ? ' Sotib olish' : 'Купить'}
                                            </button>

                                        )
                                    }
                                </div>
                            </div>
                        )}
                        <Drawer
                            open={drawerOpen}
                            onClose={() => setDrawerOpen(false)}
                            placement="right"
                            width={464}
                            title={i18n.language === 'uz' ? "Buyurtma" : "Заказ"}
                        >
                            <OrderCard
                                cart={[cartItemId]}
                                sum={
                                    productVariants[0]?.sale > 0
                                        ? productVariants[0]?.salePrice
                                        : productVariants[0]?.sellPrice
                                }
                            />
                        </Drawer>

                    </Drawer>


                )
            }
        </div>
    );
};

export default ProductCard;