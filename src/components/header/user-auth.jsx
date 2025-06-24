import {
  Avatar,
  Button,
  Drawer,
  Flex,
  Form,
  Input,
  message,
  Radio,
} from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaRegUser, FaUser } from "react-icons/fa6";
import { useCreate } from "../../services/mutations/useCreate";
import { endpoints } from "../../configs/endpoints";
import Cookies from "js-cookie";
import { IoIosArrowBack } from "react-icons/io";
import { useGetById } from "../../services/query/useGetById";
import { useNavigate } from "react-router-dom";

const UserAuth = () => {
  const userID = Cookies.get("USER-ID");
  const Token = Cookies.get("FELIZA-TOKEN");
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [isregister, setIsregister] = useState(0);
  const [isForgetPassword, setisForgetPassword] = useState(0);
  const [isLogin, setIsLogin] = useState(false);
  const [confirmCode, setConfirmCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const { mutate } = useCreate(endpoints.auth.isRegistered);
  const { mutate: RegisterPost } = useCreate(endpoints.auth.register);
  const { mutate: LoginPost } = useCreate(endpoints.auth.login);
  const { mutate: sendForgetPassword } = useCreate(
    endpoints.auth.sendVerifyCodeForgetPassword
  );
  const { mutate: forgetPassword } = useCreate(endpoints.auth.forgetPassword);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
    setIsregister(0);
    setIsLogin(false);
  };

  const { data: userData } = useGetById(
    "/api/customers/getCustomerById/",
    userID
  );
  return (
    <div className="">
      {userID || Token ? (
        <div>
          <Avatar
            onClick={() => (
              navigate("/profile?tab=my-profile"),
              window.scrollTo({ top: 0, behavior: "smooth" })
            )}
            icon={<FaRegUser />}
            className="!bg-secondary cursor-pointer !border-2 !border-primary"
            src={userData?.image?.url || false}
          />
        </div>
      ) : (
        <div>
          {open ? (
            <FaUser cursor={"pointer"} onClick={onClose} size={21} />
          ) : (
            <FaRegUser cursor={"pointer"} onClick={showDrawer} size={21} />
          )}
        </div>
      )}
      <Drawer
        closable={{ "aria-label": "Close Button" }}
        onClose={onClose}
        open={open}
        width={464}
        height={70}
        maskClosable={false}
        mask={false}
        styles={{
          body: { height: "700px", background: "white" },
          wrapper: { height: 700, marginTop: "83px" },
        }}
        placement="right"
      >
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
              <Button
                className="!font-tenor"
                type="primary"
                style={{ height: 48 }}
                block
                children={t("header.login")}
                onClick={() => {
                  setIsLogin(true);
                  setIsregister(false);
                }}
              />
              <Button
                className="!font-tenor"
                type="default"
                style={{ height: 48 }}
                block
                children={t("header.register.title")}
                onClick={() => setIsregister(1)}
              />
            </Flex>
          </Flex>
        )}

        {isregister == 1 && (
          <Flex vertical gap={24} className="mt-5">
            <h1 className="text-2xl font-normal text-center text-primary font-tenor">
              {t("header.register.title")}
            </h1>
            <Form
              onFinish={(values) => {
                console.log(values);
                setPhoneNumber(values.phoneNumber);
                mutate(
                  { phoneNumber: values.phoneNumber },
                  {
                    onSuccess: (data) => {
                      if (data) {
                        setIsLogin(true);
                        setIsregister(0);
                      } else {
                        setIsregister(2);
                      }
                    },
                  }
                );
              }}
              layout="vertical"
              className="w-full"
            >
              <Form.Item name="phoneNumber">
                <Input
                  required
                  className="h-12"
                  placeholder={t("header.register.phone")}
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
                />
              </Form.Item>
            </Form>
          </Flex>
        )}
        {isregister == 2 && (
          <Flex vertical gap={24} className="mt-5">
            <h1 className="text-2xl font-normal text-center text-primary font-tenor">
              {t("header.register.enterPassword")}
            </h1>
            <Form
              onFinish={(values) => {
                console.log(values);
                setConfirmCode(values.code);
                setIsregister(3);
              }}
              layout="vertical"
              className="w-full"
            >
              <Form.Item name="code" className="text-center">
                <Input.OTP
                  required
                  length={4}
                  className="h-12"
                  placeholder={t("header.register.phone")}
                  style={{ borderRadius: 0, border: "2px solid red" }}
                />
              </Form.Item>

              <Form.Item>
                <Button
                  className="!font-tenor"
                  type="primary"
                  style={{ height: 48 }}
                  block
                  htmlType="submit"
                  children={t("header.register.continue")}
                />
              </Form.Item>
            </Form>
          </Flex>
        )}
        {isregister == 3 && (
          <Flex vertical gap={24} className="mt-5">
            <h1 className="text-2xl font-normal text-center text-primary font-tenor">
              {t("header.register.title")}
            </h1>
            <Form
              onFinish={(values) => {
                console.log("Dataaa", {
                  ...values,
                  verifyCode: confirmCode,
                  phoneNumber: phoneNumber,
                });

                RegisterPost(
                  {
                    ...values,
                    verifyCode: confirmCode,
                    phoneNumber: phoneNumber,
                  },
                  {
                    onSuccess: (data) => {
                      setIsLogin(true);
                      setIsregister(0);
                      console.log("Registration successful", data);
                    },
                  }
                );
              }}
              layout="vertical"
              className="w-full"
            >
              <Form.Item name="fullName">
                <Input
                  required
                  className="h-12"
                  placeholder={t("header.register.name")}
                  style={{ borderRadius: 0 }}
                />
              </Form.Item>
              <Form.Item name="phoneNumber">
                <Input
                  required
                  value={phoneNumber}
                  defaultValue={phoneNumber}
                  className="h-12"
                  placeholder={t("header.register.phone")}
                  style={{ borderRadius: 0 }}
                  disabled
                />
              </Form.Item>
              <Form.Item name="birthDate">
                <Input
                  required
                  className="h-12"
                  type="date"
                  placeholder={t("header.register.dateOfBirth")}
                  style={{ borderRadius: 0 }}
                />
              </Form.Item>
              <Form.Item name="password">
                <Input
                  required
                  placeholder={t("header.register.password")}
                  className="h-12"
                  style={{ borderRadius: 0 }}
                />
              </Form.Item>

              <p className="text-xs font-tenor font-normal text-secondary mb-10">
                {t("header.register.passwordWarning")}
              </p>
              <Form.Item required name={"gender"}>
                <Radio.Group value={"Ayol"}>
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
                  children={t("header.register.title")}
                />
              </Form.Item>
            </Form>
          </Flex>
        )}

        {isLogin && (
          <Flex vertical gap={24} className="mt-5">
            <h1 className="text-2xl font-normal text-center text-primary font-tenor">
              {t("header.login")}
            </h1>
            <Form
              onFinish={(values) => {
                console.log(values);
                LoginPost(
                  {
                    phoneNumber: values.phoneNumber,
                    password: values.password,
                  },
                  {
                    onSuccess: (data) => {
                      console.log("Login successful", data);
                      onClose();
                      Cookies.set("FELIZA-TOKEN", data.accessToken, {
                        expires: 30,
                        secure: true,
                      });
                      Cookies.set("USER-ID", data.customerId, {
                        expires: 30,
                        secure: true,
                      });
                      navigate("/profile?tab=my-profile");
                    },
                    onError: (error) => {
                      console.error("Login failed", error);
                      message.error("Login failed. Please try again.");
                    },
                  }
                );
              }}
              layout="vertical"
              className="w-full"
            >
              <Form.Item name="phoneNumber">
                <Input
                  className="h-12"
                  placeholder={t("header.register.phone")}
                  style={{ borderRadius: 0 }}
                />
              </Form.Item>
              <Form.Item name="password">
                <Input.Password
                  placeholder={t("header.register.password")}
                  className="h-12"
                  style={{ borderRadius: 0 }}
                />
              </Form.Item>
              <p
                onClick={() => (
                  setIsLogin(false), setIsregister(0), setisForgetPassword(1)
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
                />
              </Form.Item>
            </Form>
          </Flex>
        )}

        {isForgetPassword == 1 && (
          <div className="">
            <div className="flex justify-between pb-14 items-center">
              <IoIosArrowBack
                size={30}
                className="cursor-pointer"
                onClick={() => {
                  setisForgetPassword(0);
                  setIsLogin(true);
                }}
              />
              <h1 className="font-tenor font-normal text-xl text-primary text-center">
                {t("header.forget.password-recovery")}
              </h1>
              <div className=""></div>
            </div>

            <Form
              onFinish={(values) => {
                sendForgetPassword(values, {
                  onSuccess: () => {
                    setPhoneNumber(values.phoneNumber);
                    setisForgetPassword(2);
                  },
                });
                console.log(values);
              }}
            >
              <Form.Item name={"phoneNumber"} className="!pb-10">
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
                />
              </Form.Item>
            </Form>
          </div>
        )}
        {isForgetPassword == 2 && (
          <div className="">
            <div className="flex justify-between items-center pb-14">
              <IoIosArrowBack
                size={30}
                onClick={() => {
                  setisForgetPassword(1);
                }}
              />
              <h1 className="font-tenor font-normal text-xl text-primary text-center">
                {t("header.forget.password-recovery")}
              </h1>
              <div className=""></div>
            </div>

            <Form
              className="!space-y-8"
              initialValues={{
                phoneNumber: phoneNumber,
              }}
              onFinish={(values) => {
                forgetPassword(values, {
                  onSuccess: () => {
                    setisForgetPassword(0);
                    setIsLogin(true);
                  },
                });
                console.log(values);
              }}
            >
              <Form.Item name={"phoneNumber"}>
                <Input
                  disabled
                  value={phoneNumber}
                  defaultValue={phoneNumber}
                  className="h-12 !rounded-none"
                />
              </Form.Item>
              <Form.Item name={"newPassword"}>
                <Input.Password
                  className="h-12 !rounded-none"
                  placeholder={t("header.forget.new-password")}
                  required
                />
              </Form.Item>
              <Form.Item className="text-center !pb-7" name={"verifyCode"}>
                <Input.OTP length={4} />
              </Form.Item>
              <Form.Item>
                <Button
                  block
                  className="!rounded-none !h-12"
                  type="primary"
                  htmlType="submit"
                  children={t("header.forget.password-recovery")}
                />
              </Form.Item>
            </Form>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default UserAuth;
