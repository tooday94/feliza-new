import { Button, Flex, Form, Grid, Input, Radio } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useCreate } from "../../services/mutations/useCreate";
import { endpoints } from "../../configs/endpoints";
import Cookies from "js-cookie";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Ortga qaytish ikonkasini chizuvchi yordamchi komponent
const BackButton = ({ onClick }) => (
  <IoIosArrowBack
    size={30}
    className="cursor-pointer absolute top-0 left-0"
    onClick={onClick}
  />
);

const AuthForm = ({ onClose }) => {
  const { i18n } = useTranslation();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isregister, setIsregister] = useState(0);
  const [isForgetPassword, setisForgetPassword] = useState(0);
  const [isLogin, setIsLogin] = useState(false);
  const [confirmCode, setConfirmCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [smsError, setSmsError] = useState("");

  // API call mutatorlari
  const { mutate: checkRegistered } = useCreate(endpoints.auth.isRegistered);
  const { mutate: RegisterPost } = useCreate(endpoints.auth.register);
  const { mutate: LoginPost } = useCreate(endpoints.auth.login);
  const { mutate: sendForgetPassword } = useCreate(
    endpoints.auth.sendVerifyCodeForgetPassword
  );
  const { mutate: forgetPassword } = useCreate(endpoints.auth.forgetPassword);
  const { mutate: verifySmsCode } = useCreate(endpoints.auth.smsCodeVerification)

  const width = Grid.useBreakpoint();

  // Muvaffaqiyatli Login/Registerdan so'ng foydalanuvchini yo'naltirish funksiyasi
  const handleAuthSuccess = (data) => {
    setLoading(false);

    // Cookie saqlash
    Cookies.set("FELIZA-TOKEN", data.accessToken, { expires: 30, secure: true });
    Cookies.set("USER-ID", data.customerId, { expires: 30, secure: true });

    // 2. Modal/Drawer ni yopish
    onClose();
    // ⭐ MUHIM: navigate o'rniga window.location.href ishlatsang, 
    // sahifa polniy refresh bo'ladi va "Invalid Date" chiqmaydi.
    const redirectPath = width.lg ? "/profile?tab=my-profile" : "/profile";
    window.location.href = redirectPath;
  };

  return (
    <div className="relative">
      {/* 1. Asosiy sahifa (Login/Register tugmalari) - O'zgarishsiz */}
      {isForgetPassword == 0 && (
        <Flex
          vertical
          gap={24}
          style={{ display: isregister || isLogin ? "none" : "flex" }}
        >
          <h1 className="text-2xl font-normal text-center text-primary font-tenor">
            {t("header.profile")}
          </h1>
          <p className="font-tenor text-center text-sm text-[#444] max-w-[300px] mx-auto text-wrap leading-[150%] mb-5">
            {t("header.desc")}
          </p>

          <Flex vertical gap={20} className="">
            {/* <Button
              className="!font-tenor"
              type="primary"
              style={{ height: 48 }}
              block
              children={t("header.login")}
              loading={loading}
              onClick={() => {
                setIsLogin(true);
                setIsregister(0);
              }}
            /> */}
            <Button
              className="!font-tenor"
              type="primary"
              style={{ height: 48 }}
              block
              onClick={() => setIsregister(1)}
            >
              {i18n.language === "uz"
                ? "Ro'yxatdan o'tish | Kirish"
                : "Регистрация | Вход"}
            </Button>

          </Flex>
        </Flex>
      )}

      {/* 2. Ro'yxatdan o'tish - 1-bosqich (Telefon raqami) - O'zgarishsiz */}
      {isregister == 1 && (
        <Flex vertical gap={24} className="mt-5 relative">
          <BackButton onClick={() => setIsregister(0)} />
          <h1 className="text-2xl font-normal text-center text-primary font-tenor">
            {t("header.register.title")}
          </h1>
          <Form
            initialValues={{
              phoneNumber: phoneNumber || "+998"
            }}
            onFinish={(values) => {
              setLoading(true);
              setPhoneNumber(values.phoneNumber);

              checkRegistered(
                { phoneNumber: values.phoneNumber },
                {
                  // ... checkRegistered ichidagi onSuccess qismi
                  onSuccess: (data) => {
                    setLoading(false);
                    if (data) {
                      // Agar raqam bazada bo'lsa, Login sahifasiga otamiz
                      setIsLogin(true);
                      setIsregister(0);

                      // ✅ BU YERDA: Login formasiga raqamni avtomatik yozamiz
                      form.setFieldsValue({
                        phoneNumber: values.phoneNumber,
                      });

                      toast.info(
                        i18n.language === "uz"
                          ? "Siz allaqachon ro‘yxatdan o‘tgansiz. Parolingizni kiriting."
                          : "Вы уже зарегистрированы. Введите пароль."
                      );
                    } else {
                      // Agar raqam yo'q bo'lsa, SMS kod yuborish bosqichiga
                      setIsregister(2);
                      toast.success(`${values.phoneNumber} raqamiga tasdiqlash kodi yuborildi.`);
                    }
                  },
                  onError: (error) => {
                    setLoading(false);
                    toast.error(error?.response?.data?.message || "Raqamni tekshirishda xatolik.");
                  },
                }
              );
            }}
            layout="vertical"
            className="w-full"
          >
            <Form.Item
              name="phoneNumber"
              rules={[
                {
                  required: true,
                  message:
                    i18n.language === "uz"
                      ? "Telefon raqamini kiriting"
                      : "Введите номер телефона",
                },
                {
                  pattern: /^\+998\d{9}$/,
                  message:
                    i18n.language === "uz"
                      ? "Telefon raqami noto‘g‘ri formatda kiritildi"
                      : "Неверный формат номера телефона"
                },
              ]}
            >
              <Input
                className="h-12"
                placeholder="+998901234567"
                style={{ borderRadius: 0 }}
              />
            </Form.Item>


            <Form.Item>
              <Button
                className="!font-tenor"
                type="primary"
                style={{ height: 48 }}
                block
                htmlType="submit"
                children={t("header.register.title")}
                loading={loading}
              />
            </Form.Item>
          </Form>
        </Flex>
      )
      }

      {/* 3. Ro'yxatdan o'tish - 2-bosqich (SMS kod) */}
      {isregister == 2 && (
        <Flex vertical gap={24} className="mt-5 relative">
          <BackButton onClick={() => setIsregister(1)} />
          <h1 className="text-center font-tenor text-base leading-relaxed">
            <span className="font-semibold">{phoneNumber}</span>{" "}
            {i18n.language === "uz"
              ? "raqamiga yuborilgan"
              : "на номер отправлен"}
            <br />
            <span className="text-primary font-medium">
              {i18n.language === "uz"
                ? "4 xonali tasdiqlash kodini"
                : "4-значный код подтверждения"}
            </span>{" "}
            {i18n.language === "uz" ? "kiriting" : "введите"}
          </h1>

          <Form
            onFinish={(values) => {
              setLoading(true);
              setSmsError(""); // Har safar xatoni tozalaymiz

              // ✅ SMS kodni tekshirish API'sini chaqiramiz
              verifySmsCode(
                { phoneNumber, verifyCode: values.code },
                {
                  onSuccess: () => {
                    setLoading(false);
                    setConfirmCode(values.code);
                    setIsregister(3); // FAQAT kod to'g'ri bo'lsa keyingi bosqichga o'tadi
                  },
                  onError: (err) => {
                    setLoading(false);
                    setSmsError(i18n.language === "uz" ? "SMS kod noto'g'ri!" : "Неверный код СМС!");
                    toast.error(err?.response?.data?.message || "Kod noto'g'ri!");
                  }
                }
              );
            }}
          >
            <Form.Item name="code" className="text-center mb-2">
              <Input.OTP length={4} className="h-12" />
            </Form.Item>

            {/* ✅ Xato xabari chiqadigan joy */}
            {smsError && <p className="text-red-500 text-center text-sm mb-4">{smsError}</p>}

            <Form.Item>
              <Button type="primary" block className="!h-12" htmlType="submit" loading={loading}>
                {t("header.register.continue")}
              </Button>
            </Form.Item>
          </Form>
        </Flex>
      )}

      {/* 4. Ro'yxatdan o'tish - 3-bosqich (Ma'lumotlarni kiritish) - O'zgartirildi */}
      {
        isregister == 3 && (
          <Flex vertical gap={24} className="mt-5 relative">
            <BackButton onClick={() => setIsregister(2)} />
            <h1 className="text-2xl font-normal text-center text-primary font-tenor">
              {t("header.register.title")}
            </h1>
            <Form
              // initialValues telefon raqamini ko'rsatish uchun kerak
              initialValues={{
                fullName: undefined,
                birthDate: undefined,
                password: undefined,
                gender: "Ayol",
                phoneNumber: phoneNumber // Telefon raqami avtomatik to'ldiriladi
              }}
              onFinish={(values) => {
                setLoading(true);
                const data = {
                  ...values,
                  verifyCode: confirmCode,
                  phoneNumber: phoneNumber, // oldindan saqlangan raqam
                };

                RegisterPost(data, {
                  onSuccess: () => {
                    setLoading(false);

                    toast.success(
                      i18n.language === "uz"
                        ? "Ro‘yxatdan o‘tdingiz. Endi tizimga kiring."
                        : "Вы зарегистрировались. Войдите в систему."
                    );

                    // 🔹 Register bosqichlarini yopamiz
                    setIsregister(0);

                    // 🔹 Login sahifasiga o'tkazamiz
                    setIsLogin(true);

                    // 🔹 Login inputlariga avtomatik yozib qo'yamiz
                    form.setFieldsValue({
                      phoneNumber: phoneNumber,
                      password: data.password, // registerda yozilgan parol
                    });
                  },

                  onError: (error) => {
                    setLoading(false);
                    toast.error(
                      error?.response?.data?.message ||
                      "Ro‘yxatdan o‘tishda xatolik"
                    );
                  }
                });



              }}
              layout="vertical"
              className="w-full"
            >
              <Form.Item name="fullName" rules={[{ required: true, message: t("header.register.name-required") }]}>
                <Input
                  className="h-12"
                  placeholder={t("header.register.name")}
                  style={{ borderRadius: 0 }}
                />
              </Form.Item>
              <Form.Item name="phoneNumber">
                {/* Disabled input uchun value yoki defaultValue to'g'ri berilishi kerak */}
                <Input
                  className="h-12"
                  placeholder={t("header.register.phone")}
                  style={{ borderRadius: 0 }}
                  disabled
                />
              </Form.Item>
              <Form.Item name="birthDate" rules={[{ required: true, message: t("header.register.date-required") }]}>
                <Input
                  className="h-12"
                  type="date"
                  placeholder={t("header.register.dateOfBirth")}
                  style={{ borderRadius: 0 }}
                />
              </Form.Item>
              <Form.Item name="password" rules={[{ required: true, message: t("header.register.password-required") }]}>
                <Input.Password
                  placeholder={t("header.register.password")}
                  className="h-12"
                  style={{ borderRadius: 0 }}
                />
              </Form.Item>

              <p className="text-xs font-tenor font-normal text-secondary mb-10">
                {t("header.register.passwordWarning")}
              </p>
              <Form.Item required name={"gender"}>
                <Radio.Group>
                  <Radio value="Erkak">{t("header.register.male")}</Radio>
                  <Radio value="Ayol">{t("header.register.female")}</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item>
                <Button
                  className="!font-tenor"
                  type="primary"
                  style={{ height: 48 }}
                  block
                  htmlType="submit"
                  loading={loading}
                  children={t("header.register.title")}
                />
              </Form.Item>
            </Form>
          </Flex>
        )
      }

      {/* 5. Tizimga kirish (Login) - O'zgarishsiz */}
      {
        isLogin && (
          <Flex vertical gap={24} className="mt-5 relative">
            <BackButton onClick={() => setIsLogin(false)} />
            <h1 className="text-2xl font-normal text-center text-primary font-tenor">
              {t("header.login")}
            </h1>
            <Form
              form={form}
              onFinish={(values) => {
                setLoading(true);

                LoginPost(
                  {
                    phoneNumber: values.phoneNumber,
                    password: values.password,
                  },
                  {
                    onSuccess: (data) => {
                      toast.success("Muvaffaqiyatli tizimga kirdingiz ");
                      // O'zgarishsiz: Muvaffaqiyatli Login
                      handleAuthSuccess(data);
                    },

                    onError: (error) => {
                      setLoading(false);
                      toast.error(
                        error?.response?.data?.message ||
                        "Login xatosi! Parol yoki raqam noto'g'ri. Qayta urinib ko‘ring"
                      );
                    },
                  }
                );
              }}

              layout="vertical"
              className="w-full"
            >
              <Form.Item name="phoneNumber" rules={[{ required: true, message: t("header.register.phone-required") }]}>
                <Input
                  defaultValue={"+998"}
                  className="h-12"
                  placeholder={t("header.register.phone")}
                  style={{ borderRadius: 0 }}
                />
              </Form.Item>
              <Form.Item name="password" rules={[{ required: true, message: t("header.register.password-required") }]}>
                <Input.Password
                  placeholder={t("header.register.password")}
                  className="h-12"
                  style={{ borderRadius: 0 }}
                />
              </Form.Item>
              <p
                onClick={() => (
                  setIsLogin(false), setisForgetPassword(1)
                )}
                className="text-xs font-tenor font-normal text-primary mb-10 underline cursor-pointer"
              >
                {t("header.register.forgotPassword")}
              </p>
              <Form.Item>
                <Button
                  className="!font-tenor"
                  type="primary"
                  style={{ height: 48 }}
                  block
                  htmlType="submit"
                  children={t("header.login")}
                  loading={loading}
                />
              </Form.Item>
            </Form>
          </Flex>
        )
      }

      {/* 6. Parolni unutish - 1-bosqich (Telefon raqami) - O'zgarishsiz */}
      {
        isForgetPassword == 1 && (
          <div className="relative">
            <div className="flex justify-between pb-14 items-center relative">
              <BackButton
                onClick={() => {
                  setisForgetPassword(0);
                  setIsLogin(true);
                }}
              />
              <h1 className="font-tenor font-normal text-xl text-primary text-center mx-auto">
                {t("header.forget.password-recovery")}
              </h1>
              <div className="w-[30px]"></div>
            </div>

            <Form
              onFinish={(values) => {
                setLoading(true);
                // Nomer saqlanadigan joy
                setPhoneNumber(values.phoneNumber)

                sendForgetPassword(values, {
                  onSuccess: () => {
                    setLoading(false);
                    setPhoneNumber(values.phoneNumber);
                    setisForgetPassword(2);
                    toast.success(`${values.phoneNumber} raqamiga tasdiqlash kodi yuborildi.`);
                  },
                  onError: (error) => {
                    setLoading(false);
                    toast.error(error?.response?.data?.message || "Parolni tiklashda xatolik. Raqam noto'g'ri bo'lishi mumkin.");
                  },
                });
              }}
            >
              <Form.Item name={"phoneNumber"} className="!pb-10" rules={[{ required: true, message: t("header.register.phone-required") }]}>
                <Input
                  defaultValue={"+998"}
                  className="h-12 !rounded-none"
                  placeholder={t("header.register.phone")}
                  required
                />
              </Form.Item>
              <Form.Item>
                <Button
                  block
                  type="primary"
                  className="!h-12 !rounded-none"
                  htmlType="submit"
                  children={t("header.register.confirm")}
                  loading={loading}
                />
              </Form.Item>
            </Form>
          </div>
        )
      }

      {/* 7. Parolni unutish - 2-bosqich (Kod va Yangi Parol) - O'zgartirildi */}
      {
        isForgetPassword == 2 && (
          <div className="relative">
            <div className="flex justify-between items-center pb-14 relative">
              <IoIosArrowBack
                size={30}
                className="cursor-pointer"
                onClick={() => {
                  setisForgetPassword(1); // Oldingi bosqichga qaytish
                }}
              />
              <h1 className="font-tenor font-normal text-xl text-primary text-center mx-auto">
                {t("header.forget.password-recovery")}
              </h1>
              <div className="w-[30px]"></div>
            </div>

            <Form
              className="!space-y-8"
              // ⭐ O'zgartirish: initialValues yordamida phoneNumber state'dagi qiymatni avtomatik to'ldirish
              initialValues={{
                phoneNumber: phoneNumber,
                newPassword: '',
                verifyCode: '',
              }}
              onFinish={(values) => {
                setLoading(true);
                forgetPassword(values, {
                  onSuccess: () => {
                    setLoading(false);

                    toast.success(
                      i18n.language === "uz"
                        ? "Parol tiklandi. Endi tizimga kiring."
                        : "Пароль восстановлен. Войдите в систему."
                    );

                    // 🔹 Login sahifasiga qaytamiz
                    setisForgetPassword(0);
                    setIsLogin(true);

                    // 🔹 Telefon va yangi parolni login inputlariga yozib qo'yamiz
                    form.setFieldsValue({
                      phoneNumber: values.phoneNumber,
                      password: values.newPassword,
                    });
                  },
                  onError: (error) => {
                    setLoading(false);
                    toast.error(error?.response?.data?.message || "Xatolik yuz berdi.");
                  },
                });
              }}
            >
              <Form.Item name={"phoneNumber"}>
                <Input
                  disabled
                  className="h-12 !rounded-none"
                />
              </Form.Item>
              <Form.Item name={"newPassword"} rules={[{ required: true, message: t("header.register.new-password-required") }]}>
                <Input.Password
                  className="h-12 !rounded-none"
                  placeholder={t("header.forget.new-password")}
                />
              </Form.Item>
              <Form.Item className="text-center !pb-7" name={"verifyCode"} rules={[{ required: true, message: t("header.register.code-required") }]}>
                <Input.OTP length={4} />
              </Form.Item>
              <Form.Item>
                <Button
                  block
                  className="!rounded-none !h-12"
                  type="primary"
                  htmlType="submit"
                  children={t("header.forget.password-recovery")}
                  loading={loading}
                />
              </Form.Item>
            </Form>
          </div>
        )
      }
    </div >
  );
};
export default AuthForm;