import React from 'react';
import { useGetList } from './../../services/query/useGetList';
import { endpoints } from './../../configs/endpoints';
import { useTranslation } from 'react-i18next';
import { IoArrowForwardOutline } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import ProductCard from '../ProductCart/ProductCard';
import { Carousel } from 'antd';

function NessaHome() {
    const { i18n } = useTranslation();
    const navigate = useNavigate();

    const { data, isLoading } = useGetList(endpoints.products.getProductByCategoryId + 9, { page: 0, size: 10 });
    const { data: categoryData, isLoading: isLoadingCategory } = useGetList("/api/categories/getCategoryById/9");
    console.log("Nessa rasim", categoryData);

    if (isLoading || isLoadingCategory || !data || !categoryData) {
        return <div className="text-center py-10">Loading...</div>;
    }

    return (
        <div className='flex flex-col md:flex-row gap-8 items-start font-tenor p-2 md:p-10 '>
            <h2 className='text-xl font-semibold text-[#0D0D0D] md:hidden'>NESSA</h2>
            {/* Left image div */}
            <div className="md:w-1/2 w-full">
                {/* Carousel component */}
                <Carousel autoplay autoplaySpeed={2000}>
                    <img
                        src={categoryData?.object?.verticalImage?.url}
                        alt={categoryData?.object?.nameUZB || 'NESSA'}
                        className='w-full object-cover h-[700px]'
                    />
                    <img
                        src={categoryData?.object?.horizontalImage?.url}
                        alt={categoryData?.object?.nameUZB || 'NESSA'}
                        className='w-full object-cover h-[690px]'
                    />
                </Carousel>
            </div>

            {/* Right content div */}
            <div className="md:w-1/2 w-full space-y-6">
                <h2 className='text-2xl font-semibold text-[#0D0D0D] hidden md:block'>NESSA</h2>
                <p className='text-[#0D0D0D] text-base md:pt-3 '>
                    {
                        i18n.language === 'uz' ? ' Nessadan yangi mahsulotlarni birinchilardan bo’lib ko’ring.' : 'Сначала посмотрите на новинки от Nessa.'
                    }
                </p>
                <button
                    onClick={() => navigate(`/categoryDetail/9`,
                        window.scrollTo({ top: 0, behavior: 'smooth' })
                    )}
                    className='flex md:mt-20 mt-10 cursor-pointer items-center gap-2 py-2 px-6 border border-[#5B5B5B] hover:bg-[#5B5B5B] hover:text-white transition duration-300 rounded'>
                    {
                        i18n.language === 'uz' ? 'Barchasini ko’rish' : 'Посмотреть все'
                    } <IoArrowForwardOutline />
                </button>

                {/* Product list uchun  */}
                <div className="flex gap-4 overflow-x-auto pb-2" style={{
                    scrollbarWidth: 'none',
                }}>
                    {data?.content?.map((item) => (
                        <div key={item.id} className="min-w-[280px]">
                            <ProductCard item={item} />
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}

export default NessaHome;
