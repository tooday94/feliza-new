import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGetList } from '../../services/query/useGetList';
import { endpoints } from '../../configs/endpoints';
import ProductCard from '../../components/ProductCart/ProductCard';
import { Skeleton } from 'antd';

function CategoryDetail() {
    const { id } = useParams();
    const { i18n } = useTranslation();

    const [page, setPage] = useState(0);
    const [products, setProducts] = useState([]);
    const [hasMore, setHasMore] = useState(true);

    const { data, isLoading, isFetching } = useGetList(
        endpoints.products.getProductByCategoryId + id,
        { page, size: 20 }
    );
    // console.log("detail page uchun korgazma", data);

    const { data: categoryList } = useGetList(endpoints.category.categoryBlocks.getCategoryByBlockTypeMenu_1, {});
    const category = categoryList?.find(item => item.category.id == id)?.category;

    useEffect(() => {
        if (data?.content?.length) {
            if (page === 0) {
                setProducts(data.content);
            } else {
                setProducts(prev => [...prev, ...data.content]);
            }
            if (data.content.length < 20) {
                setHasMore(false);
            }
        }
    }, [data]);

    const loadMoreProducts = () => setPage(prev => prev + 1);

    if (isLoading && page === 0) {
        return (
            <div
                style={{ scrollbarWidth: "none" }}
                className="flex justify-between gap-3 overflow-x-scroll overflow-hidden max-w-[1280px] mx-auto"
            >
                {Array.from({ length: 4 }).map((item, index) => (
                    <div key={index} className="space-y-2 w-fit">
                        <Skeleton.Image active className="!w-[284px] !h-[350px]" />
                        <div className="">
                            <Skeleton
                                active
                                round
                                title={false}
                                paragraph={{ rows: 3 }}
                                className="!w-[284px]"
                                rows={2}
                            />
                        </div>
                    </div>
                ))}
            </div>
        );
    }
    const totalProducts = data?.totalElements || products?.length || 0;

    return (
        <div className="max-w-[1280px] mx-auto px-4 py-8 font-tenor">
            <h2 className="text-2xl font-bold text-gray-800 mb-1">
                {i18n.language === 'uz' ? category?.nameUZB : category?.nameRUS}
            </h2>
            <p className="mb-6 text-gray-600">
                {i18n.language === 'uz' ? `Jami mahsulotlar soni: ${totalProducts} ta` :
                    i18n.language === 'ru' ? `Всего товаров: ${totalProducts} шт` :
                        `Total products: ${totalProducts} шт`}
            </p>

            <div className="border-y w-full border-stone-400"></div> <br />

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((item, index) => (
                    <ProductCard key={index} item={item} />
                ))}
            </div>

            {hasMore && (
                <div className="flex justify-center mt-4">
                    {
                        totalProducts > 0 ? <button
                            onClick={() => {
                                loadMoreProducts();
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className='py-2 px-16 border border-[#5B5B5B] cursor-pointer hover:bg-[#5B5B5B] hover:text-white transition-colors duration-500'
                            disabled={isFetching}
                        >
                            {i18n.language === 'uz'
                                ? 'Yana ko‘proq ko‘rish'
                                : i18n.language === 'ru'
                                    ? 'Показать больше'
                                    : 'Show more'}
                        </button> : <button
                            onClick={() => {
                                loadMoreProducts();
                                // window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className='py-2 px-16 border hidden border-[#5B5B5B] cursor-pointer hover:bg-[#5B5B5B] hover:text-white transition-colors duration-500'
                            disabled={isFetching}
                        >
                            {i18n.language === 'uz'
                                ? 'Yana ko‘proq ko‘rish'
                                : i18n.language === 'ru'
                                    ? 'Показать больше'
                                    : 'Show more'}
                        </button>
                    }
                </div>
            )}
        </div>
    );
}

export default CategoryDetail;
