import { Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/main-layout";
import { Suspense } from "react";
import { routes } from "./routes/routes";
import Loader from "./components/loaders/loader";
import NotFound from "./components/not-found/not-found";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import { Helmet } from "react-helmet-async";

function App() {
  return (
    <>
      {/* 🔥 2. Глобальный SEO заголовок (Работает на Главной и там, где нет своего заголовка) */}
      <Helmet>
        <title>Feliza — Ayollar kiyimlari online do‘koni</title>
        <meta 
          name="description" 
          content="Feliza — O‘zbekistondagi eng zamonaviy ayollar kiyimlari do‘koni. Liboslar, ko‘ylaklar va aksessuarlar. Tez yetkazib berish xizmati." 
        />
      </Helmet>

      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="*" element={<NotFound />} />
          <Route path="/" element={<MainLayout />}>
            {routes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={<route.element />}
              />
            ))}
          </Route>
        </Routes>
      </Suspense>
      <ToastContainer />
    </>
  );
}

export default App;
