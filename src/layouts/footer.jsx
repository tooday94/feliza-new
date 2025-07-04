import feliza_logo from '../assets/images/feliza-logo.png';
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";
import { RiTelegram2Line } from "react-icons/ri";
import { IoLogoYoutube } from "react-icons/io";
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { TiVendorApple } from "react-icons/ti";

const Footer = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  const socialLinks = [
    {
      href: "https://www.facebook.com/people/Feliza-Dokoni/pfbid0aw6eJ61Ez7pLMinm1WbvMR6UfmKZNJtZcamRA8XB1u5ZcT4HTFJAAbCZDKK1MpKrl/",
      icon: <FaFacebookF />
    },
    { href: "https://www.instagram.com/feliza_uz/reels/", icon: <FaInstagram /> },
    { href: "#", icon: <FaTiktok /> },
    { href: "https://t.me/feliza_uz", icon: <RiTelegram2Line /> },
    { href: "https://www.youtube.com/@feliza_uz6743/featured", icon: <IoLogoYoutube /> },
  ];

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-[1280px] mx-auto pt-8 md:pt-24 pb-10 px-4 font-tenor">
      {/* Logo divider */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
        <span className="border-y w-full lg:w-[562px] border-stone-400"></span>
        <img
          src={feliza_logo}
          alt="Feliza logo"
          className="w-20 cursor-pointer hidden md:block"
          onClick={() => navigate('/')}
        />
        <span className="border-y w-full lg:w-[562px] border-[#858585] hidden md:block"></span>
      </div>

      {/* Social Icons */}
      <div className="flex flex-wrap items-center mt-8 md:mt-10 justify-center gap-6 sm:gap-10">
        {socialLinks.map(({ href, icon }, idx) => (
          <a
            key={idx}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 text-[#5B5B5B] cursor-pointer text-2xl hover:text-black transition"
            aria-label={`Link to social media ${idx + 1}`}
          >
            {icon}
          </a>
        ))}
      </div>

      {/* Footer Links */}
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 md:pt-10 pt-8 md:pb-5 text-center max-w-[1280px] mx-auto">
        <Link to="/about" onClick={handleScrollTop} className="text-[#0D0D0D] hover:underline cursor-pointer">
          {i18n.language === 'uz' ? 'Biz haqimizda' : 'О нас'}
        </Link>
        <Link to="/branches" onClick={handleScrollTop} className="text-[#0D0D0D] hover:underline cursor-pointer">
          {i18n.language === 'uz' ? 'Filiallarimiz' : 'Наши филиалы'}
        </Link>
        <button
          onClick={() => {
            handleScrollTop();
            navigate('/categoryDetail/7');
          }}
          className="text-[#0D0D0D] hover:underline cursor-pointer"
        >
          {i18n.language === 'uz' ? 'Chegirmalar' : 'Скидки'}
        </button>
        <Link to="/terms" onClick={handleScrollTop} className="text-[#0D0D0D] hover:underline cursor-pointer">
          {i18n.language === 'uz' ? 'Foydalanish shartlari' : 'Условия использования'}
        </Link>
        <Link to="/contact" onClick={handleScrollTop} className="text-[#0D0D0D] hover:underline cursor-pointer">
          {i18n.language === 'uz' ? 'Kontakt' : 'Контакты'}
        </Link>
      </div>

      <div className="flex flex-wrap gap-3 md:gap-4 items-center justify-center mb-5 md:pt-7 pt-5">
        {/* Apple Store */}
        <a
          href="https://apps.apple.com/uz/app/feliza/id6742327578"
          className="flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 bg-black text-white rounded-md hover:scale-105 transition-transform shadow-md"
          target="_blank"
          rel="noopener noreferrer"
        >
          <TiVendorApple className="text-white md:size-7 size-5" />
          <div className="text-left leading-tight">
            <p className="text-[10px] md:text-xs">Download on the</p>
            <p className="text-[12px] md:text-sm font-semibold">App Store</p>
          </div>
        </a>

        {/* Google Play (color badge, responsive) */}
        <a
          href="https://play.google.com/store/apps/details?id=uz.feliza.mobile&pcampaignid=web_share"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:scale-105 transition-transform shadow-md rounded-md overflow-hidden"
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
            alt="Get it on Google Play"
            className="md:w-[165px] w-[130px] h-auto"
          />
        </a>
      </div>

      {/* Copyright */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-10 pt-3 pb-12 md:pb-0 text-center text-sm sm:text-base">
        <span>© Feliza 2025</span>
        <span>{i18n.language === 'uz' ? 'Barcha huquqlar himoyalangan.' : 'Все права защищены.'}</span>
      </div>
    </div>
  );
};

export default Footer;
