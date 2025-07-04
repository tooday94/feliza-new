import React from 'react'
import { useTranslation } from 'react-i18next'

const TermsPage = () => {
    const { i18n } = useTranslation()
    return (
        <div className="max-w-[1280px] mx-auto px-4 py-12 font-sans text-[#0D0D0D] space-y-6">
            <h1 className="text-3xl font-bold text-center mb-8 text-[#0D0D0D]">
                {i18n.language === 'uz' ? 'FOYDALANISH SHARTLARI' : 'УСЛОВИЯ ИСПОЛЬЗОВАНИЯ'}
            </h1>

            <p className='text-[#444444]'>
                {i18n.language === 'uz' ? ` Felizaga xush kelibsiz. Saytimiz va xizmatlarimizdan foydalanish orqali siz ushbu
                Foydalanish shartlariga rozilik bildirasiz. Iltimos, bizning veb-saytimizni (“Sayt”)
                ishlatishdan oldin ularni diqqat bilan o'qing.` : 'Добро пожаловать на Felizaga. Используя наш сайт и наши услуги, вы соглашаетесь с настоящими Условиями использования. Пожалуйста, внимательно ознакомьтесь с ними перед использованием нашего веб-сайта ("Сайт").'}
            </p>

            <section>
                <h2 className="text-2xl font-semibold text-[#444444]">1.{i18n.language === 'uz' ? 'Umumiy qoidalar' : 'Общие правила'} </h2>
                <p className='text-[#444444]'>1.1. {i18n.language === 'uz' ? 'Ushbu Foydalanish shartlari saytdan hamda MyBazar’da taqdim etilgan barcha mahsulot va xizmatlardan foydalanishingizni tartibga soladi.' : 'Настоящие Условия использования регулируют использование вами сайта, а также всех продуктов и услуг, предлагаемых на MyBazar.'} </p>
                <p className='text-[#444444]'>1.2.{
                    i18n.language === 'uz' ? `Saytdan foydalanish orqali siz qonuniy kuchga ega bo'lgan shartnomalar tuzish uchun qonuniy yoshga to'lganligingizni va ushbu Shartlarga muvofiq Saytimizdan foydalanish uchun barcha zarur vakolat va huquqlarga ega ekanligingizni bildirasiz.` : 'Используя наш сайт, вы подтверждаете, что являетесь законносовершеннолетним и имеете все необходимые права и полномочия для использования нашего сайта в соответствии с настоящими Условиями.'
                } </p>
            </section>

            <section>
                <h2 className="text-2xl font-semibold text-[#444444]">2. {
                    i18n.language === 'uz' ? 'Foydalanuvchi hisobi' : 'Пользовательский аккаунт'
                } </h2>
                <p className='text-[#444444]'>2.1. {
                    i18n.language === 'uz' ? `Saytning ayrim funksiyalaridan foydalanish uchun sizdan hisob yaratish talab qilinishi mumkin. Ro'yxatdan o'tish paytida siz aniq va dolzarb ma'lumotlarni taqdim etishga rozilik bildirasiz.` : 'Для доступа к определенным функциям сайта может потребоваться создание учетной записи. При регистрации вы подтверждаете, что предоставляете точную и достоверную информацию.'
                } </p>
                <p className='text-[#444444]'>2.2.{
                    i18n.language === 'uz' ? `Siz hisobingiz ma'lumotlari va parolingizning maxfiyligini saqlash uchun javobgarsiz. Hisobingizdan foydalangan holda qilingan har qanday harakatlar uchun biz javobgar emasmiz.` : 'Вы несете ответственность за сохранение информации о вашем счете и пароле. Мы не несем ответственности за любые действия, выполненные с вашей учетной записью. '
                } </p>
                <p className='text-[#444444]'>2.3.{
                    i18n.language === 'uz' ? `Hisobingiz yoki parolingizdan ruxsatsiz foydalanish haqida darhol bizga xabar berishga rozilik bildirasiz.` : 'Вы соглашаетесь незамедлительно сообщать нам о любом несанкционированном использовании вашей учетной записи или пароля.'
                } </p>
            </section>

            <section>
                <h2 className="text-2xl font-semibold text-[#444444]">3.{
                    i18n.language === 'uz' ? ` Saytdan foydalanish` : `Использование сайта`
                }</h2>
                <p className='text-[#444444]'>3.1. {
                    i18n.language === 'uz' ? `Siz Saytdan faqat qonuniy maqsadlarda va ushbu Foydalanish shartlariga muvofiq foydalanishga rozilik bildirasiz.` : 'Вы соглашаетесь использовать наш сайт только в законных целях и в соответствии с настоящими Условиями использования.'
                } </p>
                <p className='text-[#444444]'>3.2.{
                    i18n.language === 'uz' ? ` Saytdan quyidagi maqsadlarda foydalanish taqiqlanadi:` : 'Использование сайта для следующих целей запрещено:'
                } </p>
                <ul className="list-disc list-inside ml-4 space-y-1 text-[#444444]">
                    <li>{
                        i18n.language === 'uz' ? `Noqonuniy, haqoratli, tahdidli, tuhmatli, odobsiz yoki uchinchi shaxslarning huquqlarini buzuvchi har qanday tarkibni yuklash, nashr qilish yoki uzatish.` : 'Загрузка, публикация или передача любого содержания, которое нарушает права неприкосновенности, конфиденциальности, личной жизни или других прав третьих лиц.'
                    }</li>
                    <li>
                        {
                            i18n.language === 'uz' ? `Boshqalarning intellektual mulki, shaxsiy hayoti yoki boshqa huquqlarini buzish.` : 'Нарушение интеллектуальных прав, личной жизни или других прав других лиц.'
                        }
                    </li>
                    <li>{
                        i18n.language === 'uz' ? `Saytning yoki Saytga ulangan tarmoqlarning ishlashiga xalaqit berish.` : 'Вызвать сбой или сбой работы сайта или связанных с ним сетей.'
                    }</li>
                </ul>
            </section>

            <section>
                <h2 className="text-2xl font-semibold text-[#444444]">4.{
                    i18n.language === 'uz' ? `Buyurtmalar va to'lovlar` : `Заказы и платежи`
                } </h2>
                <p className='text-[#444444]'>4.1. {
                    i18n.language === 'uz' ? ` MyBazar-da berilgan barcha buyurtmalar mahsulot mavjudligi va narxi tasdiqlanishi shart. Biz har qanday sababga ko'ra buyurtmani rad etish yoki bekor qilish huquqini saqlab qolamiz.` : 'Подтверждение наличия товара и его цены является обязательным условием для оформления заказа. Мы оставляем за собой право отменить или аннулировать заказ по любой причине.'
                }</p>
                <p className='text-[#444444]'>4.2.{
                    i18n.language === 'uz' ? `Mahsulot narxlari oldindan ogohlantirmasdan o'zgartirilishi mumkin. Biz Saytdagi ma'lumotlarning to'g'riligini ta'minlash uchun barcha sa'y-harakatlarni qilamiz, lekin narxlash yoki mahsulot tavsifidagi xatolar darhol tuzatilishiga kafolat bera olmaymiz.` : 'Цены на товары могут быть изменены без предварительного уведомления. Мы делаем все возможные усилия, чтобы обеспечить точность информации на нашем сайте, но не гарантируем, что цены или ошибки в описании товара будут немедленно устранены.'
                } </p>
                <p className='text-[#444444]'>4.3.{
                    i18n.language === 'uz' ? `To'lovni Saytda taklif qilingan turli usullar yordamida amalga oshirish mumkin. Siz toʻgʻri toʻlov maʼlumotlarini taqdim etishga rozilik berasiz va buyurtmangiz summasini yechib olishga ruxsat berasiz.` : 'Оплата может быть осуществлена с использованием различных предложенных на сайте способов оплаты. Вы соглашаетесь предоставить правильные сведения о платеже и разрешить нам вычесть сумму заказа.'
                } </p>
            </section>

            <section>
                <h2 className="text-2xl font-semibold text-[#444444]">5. {
                    i18n.language === 'uz' ? `To'lovlarni qaytarish va qaytarish` : `Возврат и возврат денег`
                } </h2>
                <p className='text-[#444444]'>5.1.{
                    i18n.language === 'uz' ? ` Qaytish va pulni qaytarish siyosati Saytda mavjud bo'lib, tovarlarni qaytarish va pulni qaytarib olish shartlarini boshqaradi.` : 'Политика возврата и возврата денег существует на сайте и регулирует условия возврата товаров и возврата денег.'
                } </p>
                <p className='text-[#444444]'>5.2.{
                    i18n.language === 'uz' ? `Agar buyum bizning qaytarish siyosatimizga mos kelmasa, biz qaytarish yoki pulni qaytarishni rad etish huquqini saqlab qolamiz.` : 'Если товар не соответствует нашей политике возврата, мы оставляем за собой право отказаться от возврата или возврата денег.'
                } </p>
            </section>

            <section>
                <h2 className="text-2xl font-semibold text-[#444444]">6.{
                    i18n.language === 'uz' ? `Intellektual mulk` : `Интеллектуальная собственность`
                } </h2>
                <p className='text-[#444444]'>6.1. Saytda taqdim etilgan barcha kontent, jumladan matn, grafikalar, logotiplar, tasvirlar, audio va video materiallar MyBazar yoki bizning litsenziarimizga tegishli bo'lib, mualliflik huquqi va boshqa intellektual mulk huquqlari qonunlari bilan himoyalangan.</p>
                <p className='text-[#444444]'>6.2. Siz bizning yozma roziligimizsiz Sayt mazmunidan foydalana olmaysiz, nusxa ko'chira olmaysiz, tarqata olmaysiz, o'zgartira olmaysiz yoki yarata olmaysiz.</p>
            </section>

            <section>
                <h2 className="text-2xl font-semibold text-[#444444]">7.{
                    i18n.language === 'uz' ? `Rad etish` : `Отказ`
                } </h2>
                <p className='text-[#444444]'>7.1.{
                    i18n.language === 'uz' ? ` Sayt va uning barcha mazmuni "mavjud bo'lganidek" va "mavjud bo'lganidek" asosida taqdim etiladi. Biz Saytning aniqligi, ishonchliligi yoki mavjudligi haqida aniq yoki nazarda tutilgan hech qanday kafolat bermaymiz.` : 'Сайт и его содержание предоставляются "как есть" и "как доступно". Мы не гарантируем точность, надежность или доступность сайта. Никакие утверждения, выраженные или подразумеваемые, не могут быть основаны на том, что сайт соответствует каким-либо критериям.'
                } </p>
                <p className='text-[#444444]'>7.2.{
                    i18n.language === 'uz' ? `Biz Saytdan foydalanish yoki foydalana olmaslik natijasida yuzaga keladigan to'g'ridan-to'g'ri, bilvosita, tasodifiy, maxsus yoki oqibatli zararlar uchun javobgar emasmiz` : 'Мы не отвечаем за прямые, косвенные, случайные, специальные или косвенные убытки, возникающие в результате использования или невозможности использования сайта.'
                } </p>
            </section>

            <section>
                <h2 className="text-2xl font-semibold text-[#444444]">8. {
                    i18n.language === 'uz' ? ` Shartlarga o'zgartirishlar` : `Изменения в условиях`
                }</h2>
                <p className='text-[#444444]'>8.1. {
                    i18n.language === 'uz' ? ` Biz istalgan vaqtda ushbu Foydalanish shartlarini o'zgartirish yoki yangilash huquqini saqlab qolamiz. O'zgartirishlar Saytda e'lon qilingan paytdan boshlab kuchga kiradi.` : 'Мы оставляем за собой право в любое время изменять или обновлять эти условия использования. Изменения вступают в силу с момента их опубликования на сайте.'
                }</p>
                <p className='text-[#444444]'>8.2.{
                    i18n.language === 'uz' ? ` O'zgartirishlar kiritilgandan so'ng Saytdan foydalanishni davom ettirish orqali siz yangi Foydalanish shartlariga rozilik bildirasiz.` : 'Продолжая использовать сайт после внесения изменений, вы соглашаетесь с новыми условиями использования.'
                }</p>
            </section>

            <section>
                <h2 className="text-2xl font-semibold text-[#444444]">9. {
                    i18n.language === 'uz' ? `Tugatish` : `Завершение`
                } </h2>
                <p className='text-[#444444]'>9.1.{
                    i18n.language === 'uz' ? `Agar siz ushbu Foydalanish shartlarini buzsangiz, biz istalgan vaqtda, ogohlantirmasdan Saytga kirishingizni to'xtatib qo'yishimiz yoki to'xtatishimiz mumkin.` : 'Если вы не согласны с этими условиями использования, мы можем в любое время прекратить доступ к сайту без предварительного уведомления.'
                } </p>
                <p className='text-[#444444]'>9.2.{
                    i18n.language === 'uz' ? `
                    Ushbu Shartlarning o'z tabiatiga ko'ra bekor qilinganidan keyin ham saqlanib qolishi kerak bo'lgan barcha qoidalari, shu jumladan, cheklanmagan holda, javobgarlik cheklovlari va nizolarni hal qilish qoidalari bekor qilinganda ham saqlanib qoladi.` : 'Все правила, включая ограничения ответственности и ограничения, которые могут быть применимы, сохраняются после прекращения действия этих условий. Если какие-либо правила, включая ограничения ответственности и ограничения, применимы, они сохраняются после прекращения действия этих условий.'
                } </p>
            </section>

            <section>
                <h2 className="text-2xl font-semibold text-[#444444]">10.{
                    i18n.language === 'uz' ? `Amaldagi qonunchilik` : `Действующее законодательство`
                } </h2>
                <p className='text-[#444444]'>10.1. {
                    i18n.language === 'uz' ? ` Ushbu Foydalanish shartlari O‘zbekiston qonunlariga muvofiq boshqariladi va talqin qilinadi. Ushbu Shartlar bilan bog'liq barcha nizolar O‘zbekiston sudlariga topshiriladi.` : 'Эти условия использования регулируются и толкуются в соответствии с законодательством Республики Узбекистан. Все споры, связанные с этими условиями, рассматриваются судами Республики Узбекистан.'
                }</p>
            </section>

            <section>
                <h2 className="text-2xl font-semibold text-[#444444]">11.{
                    i18n.language === 'uz' ? `Kontaktlar` : `Контакты`
                } </h2>
                <p className='text-[#444444]'>{
                    i18n.language === 'uz' ? `Agar ushbu Foydalanish shartlari bo‘yicha savollaringiz bo‘lsa, biz bilan bog‘laning:` : 'Если у вас есть вопросы по этим условиям использования, свяжитесь с нами:'
                }</p>
                <ul className="list-disc list-inside ml-4 text-[#444444]">
                    <li> {
                        i18n.language === 'uz' ? `Elektron pochta:` : 'Электронная почта:'
                    }<a
                        href="#" className="text-blue-600 underline">
                            feliz.uz@gmail.com</a></li>
                </ul>
            </section>
        </div>
    )
}

export default TermsPage
