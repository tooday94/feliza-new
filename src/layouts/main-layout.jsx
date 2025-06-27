import Header from "./header";
import { Outlet } from "react-router-dom";
import Footer from "./footer";
import { MobileBottomTab } from "../components/header/mobile-bottom-tab";
import OrderStatusModal from "../components/order/order-status-modal";

const MainLayout = () => {
  return (
    <div className="max-w-[1440px] mx-auto">
      <header className="sticky top-0 z-50 bg-white">
        <Header />
      </header>
      <main>
        <Outlet />
      </main>
      <footer>
        <Footer />
        <div className="w-full fixed bottom-0 z-30">
          <MobileBottomTab />
        </div>
      </footer>
      <OrderStatusModal/>
    </div>
  );
};

export default MainLayout;
