import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { useGetList } from '../../services/query/useGetList'
import { endpoints } from '../../configs/endpoints'
import { FaArrowDown, FaMinus, FaStar } from "react-icons/fa";
import { FaArrowUp } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { useState } from 'react';
import ProductCard from './../../components/ProductCart/ProductCard';
import { Button, Carousel, Drawer, Image, Modal, message, Grid } from 'antd'; // 1. Добавил Grid
import Cookies from 'js-cookie';
import { useCreate } from './../../services/mutations/useCreate';
import { toast } from 'react-toastify';
import { FaPlus } from "react-icons/fa";
import { OrderCard } from '../../components/cart/order-card';
import AuthForm from '../../components/header/auth-form';
import { getOptimizedImageUrl } from '../../utils/imageOptimizer';
// 🔥 1. Импортируем Helmet для SEO
import { Helmet } from 'react-helmet-async';

function ProductDetail() {
    const { id } = useParams()
    const { i18n } = useTranslation()
    const userID = Cookies.get("USER-ID");
    // 3. Хук для определения размера экрана
    const screens = Grid.useBreakpoint();

    const { data, isLoading, isFetching } = useGetList(endpoints.products.getProductById + id, {})
    const { data: productVariants, isLoading: loadvar } = useGetList(endpoints.products.searchProduct + data?.referenceNumber)
    const { data: similarProducts, isLoading: loadingSimilar } = useGetList(endpoints.products.getProductByCategoryId + data?.category[0]?.id, {
        page: 0,
        size: 15,
    })
    const { mutate, isPending } = useCreate(endpoints.cart.addCartItem, endpoints.cart.getCart)
    const { mutate: addtofavorites } = useCreate(endpoints.favorites.addFavoriteItem)
    const [open, setOpen] = useState(true)
    const [isOpen, setIsOpen] = useState(true)
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedColorIndex, setSelectedColorIndex] = useState(0);
    const [count, setCount] = useState(1);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [cartItemId, setcartItemId] = useState("")
    const [authOpen, setAuthOpen] = useState(false)
    const [openReviewModal, setOpenReviewModal] = useState(false);

    // console.log("Cartitemi", cartItemId);
    // console.log(" Data Comment", data);

    // --- 🔥 НАЧАЛО SEO ЛОГИКИ ---
    const isUz = i18n.language === 'uz';
    
    // Формируем заголовок (Название товара | Feliza)
    const productName = isUz ? data?.nameUZB : data?.nameRUS;
    const seoTitle = productName ? `${productName} — Feliza.uz` : 'Feliza — Ayollar kiyimlari';

    // Формируем описание (Обрезаем до 160 символов для Google)
    const rawDescription = isUz ? data?.descriptionUZB : data?.descriptionRUS;
    const seoDescription = rawDescription 
        ? rawDescription.replace(/<\/?[^>]+(>|$)/g, "").slice(0, 160) + "..." 
        : "Feliza — zamonaviy ayollar kiyimlari online do'koni.";

    // Картинка для соцсетей
    const seoImage = productVariants?.[0]?.productImages?.[0]?.url || "https://feliza.uz/logo.png";
    const currentUrl = window.location.href;
    // --- 🔥 КОНЕЦ SEO ЛОГИКИ ---

    // Savatga qo'shish funksiyasi
    const addToCart = () => {
        // 1. Foydalanuvchi tizimga kirmagan bo'lsa, auth modal ochiladi
        if (!userID) {
            setAuthOpen(true);
            return;
        }

        // 2. Tanlangan rang variantini olish
        const selectedColorVariant = productVariants?.[selectedColorIndex];
        if (!selectedColorVariant) {
            toast.error(
                i18n.language === "uz" ? "Iltimos, rang tanlang" : "Пожалуйста, выберите цвет",
                { autoClose: 1000 }
            );
            return;
        }

        // 3. Tanlangan razmer variantini olish
        const selectedSizeVariant = selectedColorVariant.productSizeVariantList?.find(
            (variant) => variant.size === selectedSize
        );
        if (!selectedSizeVariant) {
            toast.error(
                i18n.language === "uz" ? "Iltimos, razmer tanlang" : "Пожалуйста, выберите размер",
                { autoClose: 1000 }
            );
            return;
        }

        // 4. LocalStorage orqali savatda mavjudligini tekshirish
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const existingItemIndex = cart.findIndex(
            (item) =>
                item.id === data?.id &&
                item.colorIndex === selectedColorIndex &&
                item.size === selectedSize
        );

        if (existingItemIndex !== -1) {
            // Mahsulot allaqachon savatda
            toast.info(
                i18n.language === "uz" ? "Mahsulot savatda mavjud" : "Товар уже в корзине",
                { autoClose: 1000 }
            );
            return;
        }

        // 5. Mahsulotni localStorage ga qo'shish
        cart.push({
            id: data?.id,
            colorIndex: selectedColorIndex,
            size: selectedSize,
            quantity: count,
        });
        localStorage.setItem("cart", JSON.stringify(cart));

        // 6. Backendga savatga qo'shish
        mutate(
            {
                customerId: userID,
                productSizeVariantId: selectedSizeVariant.id,
                quantity: count,
            },
            {
                onSuccess: (res) => {
                    console.log("Savatga qo'shildi:", res);
                    toast.success(
                        i18n.language === "uz"
                            ? "Mahsulot savatga qo‘shildi"
                            : "Товар добавлен в корзину",
                        { autoClose: 1000 }
                    );
                    setCount(1); // count ni reset qilish
                },
                onError: (err) => {
                    console.error("Xatolik:", err);
                    // Agar foydalanuvchi tizimga kirmagan bo'lsa auth modal ochiladi
                    if (!userID) {
                        setAuthOpen(true);
                        return;
                    }
                    toast.error(
                        i18n.language === "uz" ? "Xatolik yuz berdi" : "Произошла ошибка",
                        { autoClose: 1000 }
                    );
                },
            }
        );
    };

    // sotib olish funksiyasi
    const addOrder = () => {
        // Foydalanuvchi tizimga kirmagan bo'lsa auth modal ochiladi
        if (!userID) {
            setAuthOpen(true);
            return;
        }

        // Tanlangan rang variantini olish
        const selectedColorVariant = productVariants?.[selectedColorIndex];
        if (!selectedColorVariant) {
            toast.error(
                i18n.language === 'uz' ? "Iltimos, rang tanlang" : "Пожалуйста, выберите цвет",
                { autoClose: 1000 }
            );
            return;
        }

        // Tanlangan razmer variantini olish
        const selectedSizeVariant = selectedColorVariant.productSizeVariantList?.find(
            (variant) => variant.size === selectedSize
        );
        if (!selectedSizeVariant) {
            toast.error(
                i18n.language === 'uz' ? "Iltimos, razmer tanlang" : "Пожалуйста, выберите размер",
                { autoClose: 1000 }
            );
            return;
        }

        // Buyurtma qo‘shish mutate chaqirish
        mutate(
            {
                customerId: userID,
                productSizeVariantId: selectedSizeVariant.id,
                quantity: count,
            },
            {
                onSuccess: (data) => {
                    console.log("Buyurtma qo'shildi:", data);
                    setcartItemId(data.cartItemId); // drawer yoki boshqa UI uchun
                    toast.success(
                        i18n.language === 'uz' ? "Buyurtma muvaffaqiyatli qo‘shildi" : "Заказ успешно добавлен",
                        { autoClose: 1000 }
                    );
                },
                onError: (error) => {
                    console.error("Xatolik:", error);
                    toast.error(
                        i18n.language === 'uz' ? "Xatolik yuz berdi" : "Произошла ошибка",
                        { autoClose: 1000 }
                    );
                },
            }
        );
    };

    //  sevimlilar qoshish funksiyasi
    const addToFavorites = () => {
        // Foydalanuvchi tizimga kirmagan bo'lsa auth modal ochiladi
        if (!userID) {
            setAuthOpen(true);
            return;
        }

        // Tanlangan rang variantini olish
        const selectedColorVariant = productVariants?.[selectedColorIndex];
        if (!selectedColorVariant) {
            toast.error(
                i18n.language === 'uz' ? "Iltimos, rang tanlang" : "Пожалуйста, выберите цвет",
                { autoClose: 1000 }
            );
            return;
        }

        // Tanlangan razmer variantini olish
        const selectedSizeVariant = selectedColorVariant.productSizeVariantList?.find(
            (variant) => variant.size === selectedSize
        );
        if (!selectedSizeVariant) {
            toast.error(
                i18n.language === 'uz' ? "Iltimos, razmer tanlang" : "Пожалуйста, выберите размер",
                { autoClose: 1000 }
            );
            return;
        }

        // Mahsulot ID sini olish (har bir rang variant alohida product)
        const productId = selectedColorVariant?.id;
        if (!productId) {
            toast.error(
                i18n.language === 'uz' ? "Mahsulot topilmadi" : "Товар не найден",
                { autoClose: 1000 }
            );
            return;
        }

        // Sevimlilarga qo‘shish
        addtofavorites(
            {
                customerId: userID,
                productId: productId,
            },
            {
                onSuccess: (data) => {
                    console.log("Sevimlilarga qo'shildi:", data);
                    toast.success(
                        i18n.language === 'uz' ? "Mahsulot sevimlilarga qo‘shildi" : "Товар добавлен в избранное",
                        { autoClose: 1000 }
                    );
                },
                onError: (error) => {
                    console.error("Xatolik:", error);
                    // Xatolik bo'lsa, foydalanuvchi tizimga kirmagan bo'lishi mumkin
                    setAuthOpen(true);
                },
            }
        );
    };

    const showDrawer = () => {
        setDrawerOpen(true);
    };

    const onClose = () => {
        setDrawerOpen(false);
    };


    if (loadvar) {
        return (
            <div className="text-center py-10 text-gray-500 text-lg font-medium">
                {i18n.language === 'uz' ? 'Yuklanmoqda...' :
                    i18n.language === 'ru' ? 'Загрузка...' : ""}
            </div>
        );
    }
    return (
        <div className='font-tenor md:px-6 '>
            {/* 🔥 2. ВСТАВЛЯЕМ SEO БЛОК ЗДЕСЬ (ДИНАМИЧЕСКИЕ МЕТА-ТЕГИ) */}
            <Helmet>
                {/* Заголовок вкладки */}
                <title>{seoTitle}</title>
                
                {/* Описание для Google */}
                <meta name="description" content={seoDescription} />
                
                {/* Open Graph (Instagram, Telegram, Facebook) */}
                <meta property="og:type" content="product" />
                <meta property="og:title" content={seoTitle} />
                <meta property="og:description" content={seoDescription} />
                <meta property="og:image" content={seoImage} />
                <meta property="og:url" content={currentUrl} />
                <meta property="og:site_name" content="Feliza.uz" />
                <meta property="og:price:amount" content={data?.sale > 0 ? data?.salePrice : data?.sellPrice} />
                <meta property="og:price:currency" content="UZS" />

                {/* Twitter Cards */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={seoTitle} />
                <meta name="twitter:description" content={seoDescription} />
                <meta name="twitter:image" content={seoImage} />
            </Helmet>

            <div className='font-tenor'>
                {/* Auth uchun driver */}
                <Drawer
                    open={authOpen}
                    onClose={() => setAuthOpen(false)}
                    width={500}
                    title="Kirish / Ro'yxatdan o'tish"
                >
                    <AuthForm onClose={() => setAuthOpen(false)} />
                </Drawer>
                {/* Product Images */}
                <div className='flex flex-col md:flex-row justify-between gap-8 mt-10 md:px-0'>

                    {/* mobile uchun yarilgan bolim */}
                    <div className="md:hidden mb-1">
                        <Carousel
                            autoplay
                            dots={true}
                            autoplaySpeed={3000}
                            draggable={true}
                        >
                            {productVariants[selectedColorIndex]?.productImages?.map((item, index) => (
                                <img
                                    key={item?.id || index}
                                    
                                    src={getOptimizedImageUrl(item?.url, 450, 600)}
                                    loading={index === 0 ? "eager" : "lazy"} // Первая картинка грузится сразу
                                    alt={i18n.language === 'uz' ? data?.nameUZB : data?.nameRUS}
                                    className="w-full h-auto object-cover"
                                />
                            ))}
                        </Carousel>
                    </div>
                    {/* Rasmlar bloki (DESKTOP) */}
                    <div className='hidden md:grid md:grid-cols-2 gap-1'>
                        {productVariants[selectedColorIndex]?.productImages?.map((item, index) => (
                            <img
                                key={item?.id || index}
                                // 🔥 ОПТИМИЗАЦИЯ Desktop: Ширина 466px, Высота 645px
                                src={getOptimizedImageUrl(item?.url, 466, 645)}
                                loading={index === 0 ? "eager" : "lazy"} // LCP Оптимизация
                                alt={i18n.language === 'uz' ? data?.nameUZB : data?.nameRUS}
                                className="w-full max-w-[466px] h-auto sm:h-[645px] object-cover shadow-md hover:scale-105 transition-transform duration-300"
                            />
                        ))}
                    </div>

                    {/* Matn va sozlamalar bloki */}
                    <div className="flex flex-col flex-1 max-w-full sm:max-w-[460px] px-4">
                        {/* Mahsulot nomi */}
                        <h1 className='md:pt-10 pt-1 text-lg md:text-2xl font-light leading-relaxed tracking-tight'>
                            {i18n.language === 'uz' ? data?.nameUZB : data?.nameRUS}
                        </h1>

                        {/* Narx va reyting */}
                        <div className='flex flex-row items-center justify-between md:pt-5 pt-2 gap-1 md:gap-4'>
                            {/* Narx */}
                            <div>
                                {data?.sale > 0 ? (
                                    <div className="flex items-center md:gap-3 gap-1 flex-col">
                                        <p className="text-[#0D0D0D] text-[17px] md:text-xl font-normal">
                                            {data?.salePrice} {i18n.language === 'uz' ? 'so\'m' : 'со\'м'}
                                        </p>
                                        <p className="text-gray-400 line-through text-[17px] md:text-xl">
                                            {data?.sellPrice} {i18n.language === 'uz' ? 'so\'m' : 'со\'м'}
                                        </p>
                                    </div>
                                ) : (
                                    <span className="text-[#0D0D0D] text-[17px] md:text-xl font-semibold">
                                        {data?.sellPrice} {i18n.language === 'uz' ? 'so\'m' : 'со\'м'}
                                    </span>
                                )}
                            </div>

                            {/* Reyting */}
                            <div>
                                <p className='flex items-center gap-1 pr-5 mb-1'>
                                    {data?.averageRating} <FaStar className='text-[#0D0D0D] mb-1' />
                                </p>
                            </div>
                        </div>

                        {/* Rang tanlash */}
                        <div className="flex flex-col gap-3 md:pt-12 pt-5">
                            <h2 className="text-lg font-normal">
                                {i18n.language === 'uz' ? 'Rang:' : 'Цвет:'}{' '}
                                <span className="font-normal">
                                    {i18n.language === 'uz'
                                        ? productVariants[selectedColorIndex]?.color?.nameUZB
                                        : productVariants[selectedColorIndex]?.color?.nameRUS}
                                </span>
                            </h2>

                            <div className="flex flex-wrap gap-2">
                                {productVariants?.map((item, index) => {
                                    const isSelected = selectedColorIndex === index;
                                    const isActive = item?.active;

                                    return (
                                        <div
                                            key={index}
                                            onClick={() => isActive && setSelectedColorIndex(index,
                                                window.scrollTo({ top: 0, behavior: 'smooth' })
                                            )}
                                            className={`
                                                relative w-[78px] overflow-hidden cursor-pointer border 
                                                ${isSelected ? 'border-black' : 'border-gray-300'} 
                                                ${!isActive ? 'opacity-50 cursor-not-allowed' : 'hover:border-black'}
                                            `}
                                        >
                                            <img
                                                // 🔥 ОПТИМИЗАЦИЯ Миниатюры: 80x110
                                                src={getOptimizedImageUrl(item?.productImages?.[0]?.url, 80, 110)}
                                                loading="lazy"
                                                alt="Product"
                                                className="w-[78px] md:h-[108px] h-auto object-cover"
                                            />

                                            {!isActive && (
                                                <div className="absolute inset-0 pointer-events-none bg-white/20 flex items-center justify-center">
                                                    <svg viewBox="0 0 100 100" className="w-full h-full">
                                                        <line
                                                            x1="0"
                                                            y1="100"
                                                            x2="100"
                                                            y2="0"
                                                            stroke="gray"
                                                            strokeWidth="5"
                                                        />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>


                        {/* O‘lcham tanlash */}
                        <div className=" mt-7 md:mt-12">
                            <h2 className='mb-2 font-medium'>
                                {i18n.language === 'uz' ? 'O’lcham:' : 'Размер:'} <span className='font-normal'>{selectedSize}</span>
                            </h2>

                            <div className='flex gap-3 flex-wrap'>
                                {productVariants[selectedColorIndex]?.productSizeVariantList?.map((item, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedSize(item.size)}
                                        className={`border md:px-5 md:py-3 px-2 py-1 cursor-pointer
                hover:bg-black hover:text-white transition-colors duration-300
                ${selectedSize === item.size ? 'bg-black text-white' : 'bg-white text-black'}
            `}
                                    >
                                        {item.size}
                                    </button>
                                ))}

                            </div>

                            {/* Togrilnagan versiyasi */}
                            {selectedSize && (
                                <p className="mt-2">
                                    {i18n.language === 'uz' ? 'Sotuvda bor' : 'В наличии'} : {
                                        productVariants[selectedColorIndex]?.productSizeVariantList?.find(item => item.size === selectedSize)?.quantity ?? 0
                                    } {i18n.language === 'uz' ? 'ta' : 'шт'}
                                </p>
                            )}

                            {/* Ogohlantirish matni o‘lcham tanlanmagan bo‘lsa */}
                            {!selectedSize && (
                                <p className="text-red-500 md:mt-3 mt-1 text-base">
                                    ⚠️ {i18n.language === 'uz' ? 'Iltimos, o‘lchamni tanlang!' : 'Пожалуйста, выберите размер!'}
                                </p>
                            )}
                        </div>

                        <hr className='border-gray-300 md:my-7 my-2' />

                        {/* Qo’shimcha ma’lumotlar */}
                        <div onClick={() => setIsOpen(!isOpen)} className='cursor-pointer select-none'>
                            <div className='flex items-center gap-2 justify-between'>
                                <button className='text-lg font-medium'>
                                    {i18n.language === 'uz' ? "Qo’shimcha ma’lumotlar" : "Дополнительная информация"}
                                </button>
                                {!isOpen ? <FaArrowDown /> : <FaArrowUp />}
                            </div>
                            {isOpen && (
                                <p className='md:mt-6 mt-2 text-gray-700 whitespace-pre-line break-words'>
                                    {(i18n.language === 'uz' ? data?.descriptionUZB : data?.descriptionRUS)?.split('/')}
                                </p>
                            )}
                        </div>

                        <hr className='border-gray-300 md:my-7 my-2' />

                        {/* To'lov haqida */}
                        <div>
                            <div onClick={() => setOpen(!open)} className='flex items-center gap-2 cursor-pointer select-none justify-between'>
                                <button className='text-lg font-medium'>
                                    {i18n.language === 'uz' ? "To'lov haqida" : "Оплата"}
                                </button>
                                {!open ? <FaArrowDown /> : <FaArrowUp />}
                            </div>
                            {open && (
                                <p className='md:mt-6 mt-2 text-gray-700'>
                                    {i18n.language === 'uz'
                                        ? "To’lov online tarzda PayMe, Uzumbank yoki Click orqali amalga oshiriladi"
                                        : "Оплата онлайн через PayMe, Uzumbank или Click"}
                                </p>
                            )}
                        </div>

                        {/* savatcha Tugmalar */}
                        <div className="w-full space-y-4 md:mt-10 mt-5 hidden md:block">
                            <div className="flex gap-4">
                                {/* sevimlilar qoshish */}
                                <button
                                    onClick={() => {
                                        const quantity = productVariants[0]?.productSizeVariantList[0]?.quantity;
                                        if (quantity > 0) {
                                            addToFavorites();
                                        } else {
                                            toast.warning(i18n.language === 'uz'
                                                ? "Mahsulot qolmagan, sevimlilarga qo‘shib bo‘lmaydi"
                                                : "Товар закончился, нельзя добавить в избранное", {
                                                autoClose: 1000
                                            });
                                        }
                                    }}
                                    className="p-2 border border-gray-300 text-gray-700 cursor-pointer hover:bg-red-500 hover:text-white transition duration-300 flex items-center justify-center"
                                    title="Sevimlilar"
                                >
                                    <FaRegHeart className="text-2xl" />
                                </button>



                                {/* Count boshqaruvi bolim */}
                                <div className="flex items-center gap-3 mt-2">
                                    <FaMinus
                                        onClick={() => count > 0 && setCount(count - 1)}
                                        className={`cursor-pointer ${count === 0 ? 'opacity-30 pointer-events-none' : ''}`}
                                    />
                                    <p>{count}</p>

                                    <FaPlus
                                        onClick={() => {
                                            const maxQty = productVariants[selectedColorIndex]?.productSizeVariantList?.find(item => item.size === selectedSize)?.quantity ?? 0;

                                            if (count < maxQty) setCount(count + 1);
                                        }}
                                        className={`cursor-pointer ${count >= (data?.productSizeVariantList?.find(item => item.size === selectedSize)?.quantity ?? 0)
                                            ? 'opacity-30 pointer-events-none'
                                            : ''
                                            }`}
                                    />
                                </div>

                                {/* savatga qoshish tugmasi */}
                                {data?.productSizeVariantList?.find(item => item.size === selectedSize)?.quantity === 0 ? (
                                    <button
                                        disabled
                                        className="w-full h-12 border border-black bg-gray-200 text-gray-500 cursor-not-allowed"
                                    >
                                        {i18n.language === 'uz' ? "Mahsulot qolmagan" : "Нет в наличии"}
                                    </button>
                                ) : (
                                    <button
                                        onClick={addToCart}
                                        className="w-full cursor-pointer h-12 border border-black hover:bg-black hover:text-white flex items-center justify-center gap-2 transition duration-300"
                                    >
                                        <HiOutlineShoppingBag className="text-xl" />
                                        <span>
                                            {i18n.language === 'uz' ? "Savatchaga qo’shish" : "В корзину"}
                                        </span>
                                    </button>
                                )}



                            </div>
                            {/* sotib olish */}
                            {
                                !selectedSize || selectedColorIndex === -1 ? (
                                    <button
                                        onClick={() => {
                                            toast.error(
                                                i18n.language === 'uz'
                                                    ? "Iltimos, rang yoki razmer tanlang"
                                                    : "Пожалуйста, выберите цвет и размер"
                                            );
                                        }}
                                        className="w-full h-12 b       border-black bg-gray-200 text-gray-500 cursor-not-allowed"
                                    >
                                        {i18n.language === 'uz' ? "Rang yoki razmer tanlang" : "Выберите цвет и размер"}
                                    </button>
                                ) : data?.productSizeVariantList?.find(item => item.size === selectedSize)?.quantity === 0 ? (
                                    <button
                                        disabled
                                        className="w-full h-12 border border-black bg-gray-200 text-gray-500 cursor-not-allowed"
                                    >
                                        {i18n.language === 'uz' ? "Mahsulot qolmagan" : "Нет в наличии"}
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => {
                                            if (!userID) {
                                                toast.error(
                                                    i18n.language === 'uz'
                                                        ? "Iltimos, avval ro‘yxatdan o‘ting"
                                                        : "Пожалуйста, сначала войдите в систему",
                                                    { autoClose: 1000 }
                                                );
                                                setAuthOpen(true);
                                                return;
                                            }

                                            setDrawerOpen(true);
                                            addOrder();
                                        }}
                                        className="w-full h-12 border border-black hover:bg-black cursor-pointer hover:text-white flex items-center justify-center gap-2 transition duration-300"
                                    >
                                        <span>
                                            {i18n.language === 'uz' ? "Sotib olish" : "Купить"}
                                        </span>
                                    </button>


                                )
                            }
                        </div>

                        {/* Drawer */}
                        <Drawer
                            width={464}
                            open={drawerOpen}
                            onClose={onClose}
                            placement="right"
                        >
                            <OrderCard
                                cart={[cartItemId]}
                                sum={
                                    data
                                        ? data.sale > 0
                                            ? data.salePrice
                                            : data.sellPrice
                                        : 0
                                }
                            />

                        </Drawer>
                    </div>

                </div>
            </div>
        </div>

            {/* Comnetariya bolimi uchun  */}
            <div className="md:mt-12 mt-5 px-4">
                {/* Header */}
                <div className="flex justify-between items-center mb-3">
                    <h2 className="text-lg font-semibold">
                        {i18n.language === "uz" ? "Foydalanuvchi izohlari" : "Отзывы пользователей"}
                    </h2>

                    {data?.reviewList?.length > 1 && (
                        <button
                            onClick={() => setOpenReviewModal(true)}
                            className="text-[#5B5B5B] hover:text-black md:text-lg text-sm font-semibold transition cursor-pointer"
                        >
                            {i18n.language === "uz" ? "Barchasini ko‘rish" : "Посмотреть все"} ({data?.reviewList.length})
                        </button>
                    )}
                </div>

                {/* Show first 2 reviews */}
                {data?.reviewList?.length > 0 ? (
                    <div className="space-y-4">
                        {data.reviewList.slice(0, 2).map((review, index) => (
                            <div
                                key={index}
                                className=" rounded-lg p-4 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.05)] hover:shadow-md transition"
                            >
                                <div className="flex items-center gap-10 mb-1">
                                    <p className="font-medium text-gray-900">{review.customerName}</p>
                                    <div className="flex gap-1 text-yellow-500">
                                        {[...Array(review.rating)].map((_, i) => <FaStar key={i} />)}
                                    </div>
                                </div>

                                <p className="text-xs text-gray-500 mb-2">{review.createdAt?.slice(0, 10)}</p>

                                {/* Images Preview */}
                                {review.images?.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {review.images.map((img, i) => (
                                            <Image
                                                key={i}
                                                // 🔥 ОПТИМИЗАЦИЯ Отзывы: 70x90 (чуть с запасом для зума)
                                                src={getOptimizedImageUrl(img.url, 100, 100)}
                                                width={60}
                                                height={80}
                                                className="rounded-md object-cover border cursor-pointer"
                                                preview={true}
                                            />
                                        ))}
                                    </div>
                                )}

                                <p className="text-sm text-gray-700">{review.content}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-sm">
                        {i18n.language === "uz" ? "Hozircha izohlar mavjud emas." : "Пока отзывов нет."}
                    </p>
                )}

                {/* Modal */}
                <Modal
                    title={i18n.language === "uz" ? "Barcha izohlar" : "Все отзывы"}
                    open={openReviewModal}
                    onCancel={() => setOpenReviewModal(false)}
                    footer={null}
                    className='!w-full'
                >
                    <div className="max-h-[420px] overflow-y-auto pr-2 space-y-4">
                        {data?.reviewList?.map((review, index) => (
                            <div key={index} className="border rounded-lg p-4 bg-gray-50">
                                <div className="flex justify-between mb-1">
                                    <p className="font-medium">{review.customerName}</p>
                                    <div className="flex gap-1 text-yellow-500">
                                        {[...Array(review.rating)].map((_, i) => <FaStar key={i} />)}
                                    </div>
                                </div>

                                <p className="text-xs text-gray-500 mb-2">{review.createdAt?.slice(0, 10)}</p>

                                {review.images?.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {review.images.map((img, i) => (
                                            <Image
                                                key={i}
                                                src={getOptimizedImageUrl(img.url, 150, 200)} // Чуть больше для модалки
                                                width={70}
                                                height={90}
                                                className="rounded-lg border object-cover cursor-pointer"
                                                preview={true}
                                            />
                                        ))}
                                    </div>
                                )}

                                <p className="text-sm text-gray-700">{review.content}</p>
                            </div>
                        ))}
                    </div>
                </Modal>
            </div>

            {/* O’XSHASH MAHSULOTLAR */}
            <div className="md:mt-20 mt-7">
                <h2
                    className="md:text-xl text-base font-semibold px-4"
                    style={{
                        fontWeight: 400,
                        fontSize: '24px',
                        lineHeight: '100%',
                        letterSpacing: '0px',
                    }}
                >
                    {i18n.language === 'uz' ? 'O’xshash mahsulotlar' : 'Сопутствующие товары'}
                </h2>

                <div
                    className="overflow-x-auto scrollbar-hide px-4"
                    style={{
                        scrollBehavior: 'smooth',
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                    }}
                >
                    <div className="grid grid-flow-col auto-cols-[189px] md:auto-cols-[296px] gap-4 pt-10">
                        {similarProducts?.content?.length > 0 ? (
                            similarProducts.content.map(item => (
                                // ProductCard уже оптимизирован, ничего менять не нужно
                                <ProductCard key={item.id} item={item} />
                            ))
                        ) : (
                            <p className="text-gray-500">
                                {i18n.language === 'uz'
                                    ? 'O’xshash mahsulotlar topilmadi.'
                                    : 'Сопутствующие товары не найдены.'}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* buttolar mobile uchun tolov btn */}
            <div className="w-full space-y-4 md:mt-10 mt-7 block md:hidden px-2 fixed bottom-20 left-0 bg-white ">
                {/* Yuqori actionlar: Sevimli, Count, Savat */}
                <div className="flex gap-3 items-center">
                    {/* Sevimlilar tugmasi */}
                    <button
                        onClick={() => {
                            const quantity = productVariants[0]?.productSizeVariantList[0]?.quantity;
                            if (quantity > 0) {
                                addToFavorites();
                            } else {
                                toast.warning(i18n.language === 'uz'
                                    ? "Mahsulot qolmagan, sevimlilarga qo‘shib bo‘lmaydi"
                                    : "Товар закончился, нельзя добавить в избранное", {
                                    autoClose: 1000
                                });
                            }
                        }}
                        className="p-2 border border-gray-300 text-gray-700 hover:bg-red-500 hover:text-white transition duration-300 flex items-center justify-center"
                        title="Sevimlilar"
                    >
                        <FaRegHeart className="text-2xl" />
                    </button>

                    {/* Count boshqaruvi */}
                    {selectedSize && (
                        <div className="flex items-center gap-2 border border-gray-300 rounded px-3 py-1">
                            <button
                                onClick={() => count > 0 && setCount(count - 1)}
                                disabled={count === 0}
                                className={`text-lg ${count === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:text-red-500'}`}
                            >
                                <FaMinus />
                            </button>
                            <span className="font-medium w-6 text-center">{count}</span>
                            <button
                                onClick={() => {
                                    const maxQty = productVariants[selectedColorIndex]?.productSizeVariantList?.find(item => item.size === selectedSize)?.quantity ?? 0;
                                    if (count < maxQty) setCount(count + 1);
                                }}
                                disabled={count >= (data?.productSizeVariantList?.find(item => item.size === selectedSize)?.quantity ?? 0)}
                                className={`text-lg ${count >= (data?.productSizeVariantList?.find(item => item.size === selectedSize)?.quantity ?? 0)
                                    ? 'opacity-30 cursor-not-allowed'
                                    : 'hover:text-black'}`}
                            >
                                <FaPlus />
                            </button>
                        </div>
                    )}

                    {/* Savatcha tugmasi (icon only) */}
                    {data?.productSizeVariantList?.find(item => item.size === selectedSize)?.quantity === 0 ? (
                        <button
                            disabled
                            className="w-full h-12 border border-black bg-gray-200 text-gray-500 cursor-not-allowed"
                        >
                            {i18n.language === 'uz' ? "Mahsulot qolmagan" : "Нет в наличии"}
                        </button>
                    ) : (
                        <button
                            onClick={addToCart}
                            className="w-full h-12  border border-black hover:bg-black hover:text-white flex items-center justify-center gap-2 transition duration-300"
                        >
                            <HiOutlineShoppingBag className="text-xl" />
                            <span>
                                {i18n.language === 'uz' ? "Savatchaga qo’shish" : "В корзину"}
                            </span>
                        </button>
                    )}

                </div>

                {/* Sotib olish tugmasi */}

                {
                    !selectedSize || selectedColorIndex === -1 ? (
                        <button
                            onClick={() => {
                                toast.error(
                                    i18n.language === 'uz'
                                        ? "Iltimos, rang yoki razmer tanlang"
                                        : "Пожалуйста, выберите цвет и размер"
                                );
                            }}
                            className="w-full h-12 b       border-black bg-gray-200 text-gray-500 cursor-not-allowed"
                        >
                            {i18n.language === 'uz' ? "Rang yoki razmer tanlang" : "Выберите цвет и размер"}
                        </button>
                    ) : data?.productSizeVariantList?.find(item => item.size === selectedSize)?.quantity === 0 ? (
                        <button
                            disabled
                            className="w-full h-12 border border-black bg-gray-200 text-gray-500 cursor-not-allowed"
                        >
                            {i18n.language === 'uz' ? "Mahsulot qolmagan" : "Нет в наличии"}
                        </button>
                    ) : (
                        <button
                            onClick={() => {
                                if (!userID) {
                                    toast.error(
                                        i18n.language === 'uz'
                                            ? "Iltimos, avval ro‘yxatdan o‘ting"
                                            : "Пожалуйста, сначала войдите в систему",
                                        { autoClose: 1000 }
                                    );
                                    setAuthOpen(true);
                                    return;
                                }

                                setDrawerOpen(true);
                                addOrder();
                            }}
                            className="w-full h-12 border border-black hover:bg-black cursor-pointer hover:text-white flex items-center justify-center gap-2 transition duration-300"
                        >
                            <span>
                                {i18n.language === 'uz' ? "Sotib olish" : "Купить"}
                            </span>
                        </button>
                    )
                }
            </div>

        </div>
    )
}

export default ProductDetail
