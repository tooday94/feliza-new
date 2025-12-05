import { useState, useEffect } from "react";
import { useGetList } from "../../services/query/useGetList";
import { useTranslation } from "react-i18next";
import { MdOutlineImageNotSupported } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useSwipeable } from "react-swipeable";

const Catalog = () => {
    const { i18n } = useTranslation();
    const navigate = useNavigate();

    const { data: parentCategories } = useGetList("/api/categories/getParentCategories");
    const filteredParents = parentCategories?.filter((item) => item.id !== 9);

    const [activeParent, setActiveParent] = useState(filteredParents?.[0]);
    const [subCategories, setSubCategories] = useState([]);

    // Fetch subCategories when activeParent changes
    const { data: nessa } = useGetList(
        activeParent
            ? `/api/categories/getSubCategoriesByParent/${i18n.language === "uz" ? activeParent.nameUZB : activeParent.nameRUS}`
            : null
    );

    useEffect(() => {
        if (nessa) setSubCategories(nessa);
    }, [nessa]);

    const [activeTabIndex, setActiveTabIndex] = useState(0);

    const handlers = useSwipeable({
        onSwipedLeft: () => setActiveTabIndex((prev) => Math.min(prev + 1, filteredParents.length - 1)),
        onSwipedRight: () => setActiveTabIndex((prev) => Math.max(prev - 1, 0)),
        preventDefaultTouchmoveEvent: true,
        trackMouse: false,
    });

    useEffect(() => {
        if (filteredParents?.[activeTabIndex]) setActiveParent(filteredParents[activeTabIndex]);
    }, [activeTabIndex, filteredParents]);

    return (
        <div className="max-w-5xl mx-auto mt-5 font-tenor font-normal text-primary">
            <h1 className="text-center text-2xl mb-5">{i18n.language === "uz" ? "Katalog" : "Каталог"}</h1>

            {/* Tabs */}
            <div className="flex px-3 gap-2 sticky top-0 bg-white z-10">
                {filteredParents?.map((parent, idx) => (
                    <button
                        key={parent.id}
                        onClick={() => setActiveTabIndex(idx)}
                        className={`flex-1 py-2 text-center font-medium ${activeTabIndex === idx ? "border-b-2 border-primary" : "text-secondary"}`}
                    >
                        {i18n.language === "uz" ? parent.nameUZB : parent.nameRUS}
                    </button>
                ))}
            </div>

            {/* Tab Content (swipeable) */}
            <div {...handlers} className="p-4 transition-all duration-700 bg-background">
                <div className="space-y-4">
                    {subCategories?.map((item) => (
                        <div
                            key={item.id}
                            onClick={() =>
                                navigate(`/catalog/${i18n.language === "uz" ? item.nameUZB.replace(/\s+/g, "-") : item.nameRUS.replace(/\s+/g, "-")}`)
                            }
                            className="shadow-md flex gap-5 items-center font-tenor font-normal text-primary p-2 rounded-md cursor-pointer hover:bg-gray-50"
                        >
                            {item?.horizontalImage?.url ? (
                                <img className="w-36 h-24 object-cover" src={item.horizontalImage.url} alt="" />
                            ) : (
                                <div className="w-36 h-24 flex justify-center items-center border border-background">
                                    <MdOutlineImageNotSupported size={24} />
                                </div>
                            )}
                            <h1>{i18n.language === "uz" ? item.nameUZB : item.nameRUS}</h1>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Catalog;
