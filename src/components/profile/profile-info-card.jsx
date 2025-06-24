import Cookies from "js-cookie";
import { useGetById } from "../../services/query/useGetById";
import { RiEdit2Line } from "react-icons/ri";
import {
  Button,
  DatePicker,
  Flex,
  Form,
  Input,
  Modal,
  Radio,
  Upload,
} from "antd";
import { useUpdateById } from "../../services/mutations/useUpdateById";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { PiLockKey } from "react-icons/pi";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

export const ProfileInfoCard = () => {
  const token = Cookies.get("FELIZA-TOKEN");
  const userID = Cookies.get("USER-ID");
  const [form] = Form.useForm();
  const { i18n, t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileList, setFileList] = useState([]);
  dayjs.extend(customParseFormat);
  const dateFormat = "YYYY-MM-DD";

  const {
    data: userData,
    refetch,
    isLoading,
  } = useGetById("/api/customers/getCustomerById/", userID);

  const { mutate, isPending } = useUpdateById(
    "/api/customers/editCustomer/",
    "/api/customers/getCustomerById/"
  );
  const { mutate: updatePassword, isPending: updatePasswordLoading } =
    useUpdateById("/api/customers/editCustomerPassword/");

  const handleUpdateImage = async (newFileList) => {
    const formData = new FormData();
    newFileList.forEach((file) => {
      formData.append("image", file.originFileObj); // serverda image sifatida qabul qilinadi
    });

    try {
      await axios.put(
        "https://felizabackend.uz/api/customers/editCustomerImage/" + userID,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Yuborildi!");
      refetch();
    } catch (err) {
      console.log("Xatolik yuz berdi!", err);
    }
  };

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    if (newFileList.length > 0) {
      handleUpdateImage(newFileList);
    }
  };

  if (isLoading) {
    return <></>;
  }
  return (
    <div>
      <div className="h-full text-center">
        <div className="flex flex-col items-center gap-6 justify-center">
          <div className="flex items-end">
            <img
              className="size-[90px] object-cover rounded-full"
              src={userData?.image?.url}
              alt=""
            />
            <Upload
              onChange={handleChange}
              beforeUpload={() => false}
              fileList={fileList}
              showUploadList={false}
            >
              <Button
                className="!border-none !flex flex-col !gap-0 !bg-transparent !text-xs !font-normal !font-tenor !text-primary"
                icon={<RiEdit2Line size={24} />}
                loading={isPending}
              />
            </Upload>
          </div>
          <Form
            className="w-[358px]"
            initialValues={{
              fullName: userData?.fullName,
              // birthDate: new Date(userData?.birthDate),
              gender: userData?.gender,
            }}
            onFinish={(values) => {
              const formatted = {
                ...values,
                birthDate: values.birthDate
                  ? dayjs(values.birthDate).format(dateFormat)
                  : userData?.birthDate,
              };

              mutate({ data: formatted, id: userID });
              console.log(formatted);
            }}
          >
            <Form.Item name={"fullName"}>
              <Input className="!h-11 !rounded-none !border-primary" />
            </Form.Item>
            <Form.Item name={"birthDate"}>
              <DatePicker
                format={dateFormat}
                style={{ width: "100%" }}
                defaultValue={dayjs(userData?.birthDate, dateFormat)}
                className="!h-11 !rounded-none !border-primary"
              />
            </Form.Item>
            <Form.Item name={"gender"}>
              <Radio.Group
                defaultValue={userData?.gender || "Ayol"}
                value={"Ayol"}
              >
                <Radio value="Erkak">{t("header.register.male")}</Radio>
                <Radio value="Ayol">{t("header.register.female")}</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item>
              <Flex className="!mb-28">
                <Button
                  className="!border-none"
                  icon={<PiLockKey />}
                  children={
                    i18n.language == "uz"
                      ? "Parolni o’zgartirish"
                      : "Изменить пароль"
                  }
                  onClick={() => setIsModalOpen(true)}
                />
              </Flex>
            </Form.Item>
            <Form.Item>
              <Button
                block
                className="!font-tenor !font-normal !rounded-none !h-12"
                type="primary"
                htmlType="submit"
                children={t("cart.save")}
              />
            </Form.Item>
          </Form>
        </div>
      </div>

      <Modal
        title={
          <p className="font-tenor font-normal text-2xl">
            {i18n.language == "uz" ? "Parolni o’zgartirish" : "Изменить пароль"}
          </p>
        }
        centered
        maskClosable={false}
        closable={{ "aria-label": "Custom Close Button" }}
        open={isModalOpen}
        onCancel={() => (setIsModalOpen(false), form.resetFields())}
        footer={false}
      >
        <Form
          form={form}
          layout="vertical"
          className="!mt-6"
          onFinish={(values) => {
            console.log(values);

            updatePassword(
              { data: values, id: userID },
              {
                onSuccess: () => {
                  form.resetFields();
                  setIsModalOpen(false);
                },
                onError: (error) => {
                  if (error?.response?.status === 409) {
                    form.setFields([
                      {
                        name: "oldPassword",
                        errors: [t("profile.input.messages.password-error")],
                      },
                    ]);
                  }
                },
              }
            );
          }}
        >
          <Form.Item
            // styles={{ input: { fontFamily: "Tenor Sans" } }}
            label={
              <span className="font-tenor font-normal">
                {t("profile.input.messages.current-password")}
              </span>
            }
            name={"oldPassword"}
            rules={[
              {
                required: true,
                message: t("profile.input.messages.current-password-error"),
              },
            ]}
          >
            <Input.Password
              styles={{ input: { fontFamily: "Tenor Sans" } }}
              className="!h-12 !rounded-none !border-primary !text-base !font-tenor"
            />
          </Form.Item>

          <Form.Item
            label={
              <span className="font-tenor font-normal">
                {t("profile.input.messages.new-password")}
              </span>
            }
            name={"newPassword"}
            rules={[
              {
                required: true,
                message: t("profile.input.messages.new-password-error"),
              },
              {
                min: 6,
                message: t("profile.input.messages.min-6"),
              },
            ]}
            hasFeedback
          >
            <Input.Password
              styles={{ input: { fontFamily: "Tenor Sans" } }}
              className="!h-12 !rounded-none !border-primary"
            />
          </Form.Item>

          <Form.Item
            label={
              <span className="font-tenor font-normal">
                {t("profile.input.messages.confirm")}
              </span>
            }
            name={"confirmPassword"}
            dependencies={["newPassword"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: t("profile.input.messages.confirm-error"),
              },
              {
                min: 6,
                message: t("profile.input.messages.min-6"),
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(t("profile.input.messages.not-match"))
                  );
                },
              }),
            ]}
          >
            <Input.Password
              styles={{ input: { fontFamily: "Tenor Sans" } }}
              className="!h-12 !rounded-none !border-primary"
            />
          </Form.Item>
          <Form.Item className="!mb-0 !mt-20">
            <Button
              block
              className="!font-tenor !font-normal !rounded-none !h-12"
              type="primary"
              htmlType="submit"
              children={t("cart.save")}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
