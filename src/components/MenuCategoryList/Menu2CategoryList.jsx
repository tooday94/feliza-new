import React from 'react'
import { useGetList } from '../../services/query/useGetList'
import { endpoints } from '../../configs/endpoints'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

function Menu2CategoryList() {
    const navigate = useNavigate()
    const { data, isLoading } = useGetList(
        endpoints.category.categoryBlocks.getCategoryByBlockTypeMenu_2,
        {}
    )
    const { i18n } = useTranslation()

    const skeletonItems = Array.from({ length: 4 })

    if (isLoading) {
        return (
            <div className="overflow-x-auto scrollbar-hide py-6">
                <div className="flex gap-6 w-max px-4 max-w-[1280px] mx-auto">
                    {skeletonItems.map((_, index) => (
                        <div
                            key={index}
                            className="w-[360px] h-[564px] bg-gray-200 rounded-md animate-pulse flex-shrink-0"
                        />
                    ))}
                </div>
            </div>
        )
    }

    const sortedData = [...data].sort((a, b) => a.placementNumber - b.placementNumber)

    return (
        <div className="flex overflow-x-auto scrollbar-hide py-6 font-tenor max-w-[1280px] mx-auto" style={{
            scrollbarWidth: "none"
        }}>
            {sortedData.map((item, indx) => (
                <div
                    onClick={() => navigate(`/categoryDetail/${item.category.id}`, window.scrollTo({ top: 0, behavior: 'smooth' })
                    )}
                    key={indx}
                    className="flex-shrink-0 md:w-[360px] w-[240px] cursor-pointer group relative mr-2"
                >
                    <img
                        src={item.category.verticalImage?.url}
                        alt={
                            i18n.language === 'uz'
                                ? item.category.nameUZB
                                : item.category.nameRUS
                        }
                        className="w-full h-[400px] md:h-[564px] object-cover"
                    />
                    <div className="absolute inset-0 bg-[#0000004D] group-hover:bg-transparent flex items-center group-hover:items-end justify-center transition-all duration-500">
                        <h2 className="text-white group-hover:text-[#0D0D0D] text-2xl w-[100px] font-bold text-center group-hover:mb-4 mb-0 px-2">
                            {i18n.language === 'uz'
                                ? item.category.nameUZB
                                : item.category.nameRUS}
                        </h2>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Menu2CategoryList
