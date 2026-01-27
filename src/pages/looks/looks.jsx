import { useNavigate } from "react-router-dom";
import { useGetList } from "../../services/query/useGetList";
import { PiSquaresFour } from "react-icons/pi";
import { LiaGripVerticalSolid } from "react-icons/lia";
import { Button, Skeleton, Grid } from "antd"; // 1. Добавил Grid
import { useState, useMemo } from "react";
import { CiGrid2H } from "react-icons/ci";
import { useTranslation } from "react-i18next";
// 2. Импорт оптимизатора
import { getOptimizedImageUrl } from "../../utils/imageOptimizer";

const Looks = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  // 3. Хук для проверки размера экрана (md - это планшет/пк)
  const screens = Grid.useBreakpoint();

  const { data, isLoading } = useGetList("/api/lookCollection/getLookCollection");

  const [grid, setGrid] = useState(4);
  const [gridMobile, setGridMobile] = useState(2);

  // SAFE data
  const safeData = data || [];

  // SORT ONLY ONCE (performance optimized)
  const sortedData = useMemo(() => {
    return [...safeData].sort((a, b) => {
      const lastA =
        a.images?.length > 0
          ? Math.max(...a.images.map(img => new Date(img.createdAt)))
          : 0;

      const lastB =
        b.images?.length > 0
          ? Math.max(...b.images.map(img => new Date(img.createdAt)))
          : 0;

      return lastB - lastA;
    });
  }, [safeData]);

  return (
    <div className="p-1 bg-background">
      {/* Header */}
      <div className="py-5 lg:py-10 space-y-4 bg-white">
        <div className="flex justify-between lg:justify-center">
          <h1 className="font-tenor text-2xl text-primary text-center">Look</h1>

          {/* Mobile grid switch */}
          <div className="flex lg:hidden items-center gap-5">
            <Button
              className="!border-none !shadow-none !bg-transparent"
              icon={
                <CiGrid2H
                  size={24}
                  color={gridMobile === 1 ? "#0d0d0d" : "#bbb"}
                  onClick={() => setGridMobile(1)}
                />
              }
            />
            <Button
              className="!border-none !shadow-none !bg-transparent"
              icon={
                <LiaGripVerticalSolid
                  size={24}
                  color={gridMobile === 2 ? "#0d0d0d" : "#bbb"}
                  onClick={() => setGridMobile(2)}
                />
              }
              onClick={() => setGridMobile(2)}
            />
          </div>
        </div>

        <div className="flex justify-between items-center px-28">
          <p className="font-tenor text-base text-primary hidden lg:block">
            {t("looks.desc")}
          </p>

          {/* Desktop grid switch */}
          <div className="hidden lg:flex gap-2.5 items-center">
            <p className="font-tenor text-sm text-secondary">{t("looks.see")}</p>
            <div className="flex items-center gap-5">
              <Button
                className="!border-none !shadow-none !bg-transparent"
                icon={
                  <PiSquaresFour
                    size={24}
                    color={grid === 4 ? "#0d0d0d" : "#bbb"}
                  />
                }
                onClick={() => setGrid(4)}
              />
              <Button
                className="!border-none !shadow-none !bg-transparent"
                icon={
                  <LiaGripVerticalSolid
                    size={24}
                    color={grid === 6 ? "#0d0d0d" : "#bbb"}
                  />
                }
                onClick={() => setGrid(6)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* LOADING */}
      {isLoading ? (
        <div className={`grid gap-1 lg:grid-cols-${grid}`}>
          {[...Array(grid)].map((_, i) => (
            <Skeleton.Image
              key={i}
              active
              className={`max-w-[357px] w-full ${grid === 4 ? "!min-h-[450px]" : "!min-h-[302px]"
                }`}
            />
          ))}
        </div>
      ) : (
        /* RENDER IMAGES */
        <div
          className={`grid gap-1 w-full ${gridMobile === 1 ? "grid-cols-1" : "grid-cols-2"
            } ${grid === 6 ? "lg:grid-cols-6" : "lg:grid-cols-4"}`}
        >
          {sortedData.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                navigate("/looksDetail/" + item.id);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="cursor-pointer hover:scale-95 duration-300"
            >
              <img
                className="max-w-[357px] w-full"
            
                src={getOptimizedImageUrl(
                  item.images?.[0]?.url,
                  screens.md ? 355 : 210,
                  screens.md ? 530 : 310
                ) || "/no-image.jpg"}
                loading="lazy"
                alt=""
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Looks;
