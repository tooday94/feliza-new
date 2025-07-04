import React from 'react'
import { useTranslation } from 'react-i18next'
import felizaimg1 from '../../assets/images/feliza1.jpg'
import felizaimg2 from '../../assets/images/feliza2.jpg'
import felizaimg3 from '../../assets/images/feliza3.jpg'

function AboutPage() {
    const { i18n } = useTranslation();

    const isUz = i18n.language === 'uz';

    return (
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-10 space-y-10 text-[#1A1A1A] leading-7">
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-center">
                    {isUz ? "Bizning Missiyamiz" : "Наша Миссия"}
                </h2>
                <p>
                    {isUz
                        ? `Bizning missiyamiz – har bir ayolning ichki go'zalligini tashqi ko'rinishida aks ettiradigan, o'ziga xos va zamonaviy kiyimlar bilan ta'minlashdir. "Uslubingizni biz bilan yarating" shiori ostida, mijozlarimizga har bir holat uchun mukammal obraz yaratishda yordam berishdan faxrlanamiz. Mahsulotlarimiz orqali, nafaqat eng so'nggi moda tendensiyalarini, balki har bir ayolning o'ziga xosligini va shaxsiyatini ta'kidlaydigan uslublarni ham taqdim etamiz. Biz mijozlarimizni o'zini yanada ishonchli, go'zal va betakror his qilishiga intilamiz.`
                        : `Наша миссия – обеспечивать каждую женщину уникальной и современной одеждой, отражающей её внутреннюю красоту во внешнем облике. Под девизом "Создайте свой стиль с нами", мы гордимся тем, что помогаем нашим клиентам создавать идеальный образ для любого случая. Через наши продукты мы представляем не только последние модные тенденции, но и подчеркиваем уникальность и индивидуальность каждой женщины. Мы стремимся к тому, чтобы наши клиенты чувствовали себя ещё более уверенными, красивыми и неповторимыми.`}
                </p>
                <img src={felizaimg2} alt="Feliza fashion 1" className="rounded-lg w-full object-cover shadow-md" />
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-center">
                    {isUz ? "Nessa Brendi" : "Бренд Nessa"}
                </h2>
                <p>
                    {isUz
                        ? `Bundan tashqari, bizda Nessa nomli alohida brend ham mavjud. Nessa brendi islomiy kiyinish madaniyatiga hurmat bilan yondashib, hijob kiyadigan ayollarimiz uchun zamonaviy va qulay kiyimlar yaratishga ixtisoslashgan. Bizning maqsadimiz – har bir ayolning e'tiqodiga mos va ayni paytda zamonaviy uslubda kiyinishini ta'minlash.`
                        : `Кроме того, у нас есть отдельный бренд под названием Nessa. Бренд Nessa с уважением относится к культуре исламской одежды и специализируется на создании современной и удобной одежды для наших женщин, носящих хиджаб. Наша цель – обеспечить каждой женщине одежду, соответствующую её вере и в то же время современному стилю.`}
                </p>
                <img src={felizaimg1} alt="Feliza fashion 2" className="rounded-lg w-full object-cover shadow-md" />
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-center">
                    {isUz ? "Ijodiy Jarayon" : "Творческий процесс"}
                </h2>
                <p>
                    {isUz
                        ? `Har bir libosimiz ustida alohida izlanish va ijodiy jarayon olib boruvchi professional dizaynerlar jamoasi ishlaydi. Ularning mahorati va ijodiy ko'rishlari mahsulotlarimizda namoyon bo'ladi, bu esa har bir libosni o'ziga xos va betakror qiladi. Bizning dizaynerlarimiz moda tendensiyalarini kuzatib borish bilan birga, har bir ayolning o'ziga xosligini va shaxsiyatini ta'kidlaydigan uslublarni yaratishga intilishadi.`
                        : `Над каждым нашим нарядом работает команда профессиональных дизайнеров, проводящих исследования и творческий процесс. Их мастерство и творческое видение отражаются в наших продуктах, что делает каждое платье уникальным и неповторимым. Наши дизайнеры не только следят за модными тенденциями, но и стремятся создавать стили, подчеркивающие индивидуальность и личность каждой женщины.`}
                </p>
                <img src={felizaimg3} alt="Feliza fashion 3" className="rounded-lg w-full object-cover shadow-md" />
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-center">
                    {isUz ? "Hamkorlik va Sifat" : "Сотрудничество и Качество"}
                </h2>
                <p>
                    {isUz
                        ? `Biz, shuningdek, Xitoy bilan mustahkam hamkorlik qilamiz va mahsulotlarimizni eng yuqori sifatda tikish uchun Xitoydagi yetakchi fabrikalarga buyurtma beramiz. Bu hamkorlik bizga sifatli va zamonaviy liboslarni yaratishda yordam beradi, shu bilan birga narx va sifat balansini saqlab qolishga imkon beradi.`
                        : `Мы также активно сотрудничаем с Китаем, заказывая производство наших товаров на ведущих фабриках Китая для обеспечения наивысшего качества пошива. Это партнерство помогает нам создавать качественные и современные наряды, при этом поддерживая баланс между ценой и качеством.`}
                </p>
            </section>
        </div>
    )
}

export default AboutPage
