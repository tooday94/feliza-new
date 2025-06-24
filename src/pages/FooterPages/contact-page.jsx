import React from 'react';
import { MdOutlineAddIcCall } from "react-icons/md";
import { CgMail } from "react-icons/cg";
import { FaTelegramPlane } from "react-icons/fa";
import { useTranslation } from 'react-i18next';

function ContactPage() {
    const { i18n } = useTranslation();
    return (
        <div className='max-w-[1280px] mx-auto pt-12 md:pt-24 md:pb-16 px-4 font-tenor text-[#0D0D0D]'>
            <h2 className='text-2xl sm:text-3xl font-semibold md:text-center mb-4 text-start'>
                {i18n.language === 'uz' ? ' Boshqa savollaringiz va murojaatingiz bo‘lsa' : 'Если у вас есть какие-либо вопросы или предложения'}
            </h2>
            <p className='md:text-center text-start text-[#666] md:mb-10 mb-5'>
                {i18n.language === 'uz' ? '  Biz bilan bog‘lanish uchun quyidagi usullardan foydalaning:' : 'Пожалуйста, свяжитесь с нами по следующим контактам:'}
            </p>

            <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-6 '>
                {/* Phone */}
                <div className='flex items-center gap-4 p-2 hover:scale-105 transition duration-300'>
                    <MdOutlineAddIcCall className='md:text-3xl text-2xl text-blue-500' />
                    <a href="tel:+998901211133" className='text-base sm:text-lg hover:underline'>
                        +998 90 121 11 33
                    </a>
                </div>

                {/* Email */}
                <div className='flex items-center gap-4 p-2 hover:scale-105 transition duration-300'>
                    <CgMail className='md:text-3xl text-2xl text-black' />
                    <a href="mailto:feliz.uz@gmail.com" className='text-base sm:text-lg hover:underline'>
                        feliz.uz@gmail.com
                    </a>
                </div>

                {/* Telegram */}
                <div className='flex items-center gap-4 p-2 hover:scale-105 transition duration-300'>
                    <FaTelegramPlane className='md:text-3xl text-2xl text-blue-400' />
                    <a
                        href="https://t.me/felizuz_bot"
                        target="_blank"
                        rel="noopener noreferrer"
                        className='text-base sm:text-lg hover:underline'
                    >
                        @felizuz_bot
                    </a>
                </div>
            </div>
        </div>
    );
}

export default ContactPage;
