import Cookies from "js-cookie";
import { useGetById } from "../../services/query/useGetById";
import { useTranslation } from "react-i18next";
import { CiLocationOn } from "react-icons/ci";
import { Button, Flex, Form, Input, Modal, Select } from "antd";
import { RiDeleteBinLine, RiEdit2Line } from "react-icons/ri";
import { useState } from "react";
import { useGetList } from "../../services/query/useGetList";
import { useUpdateById } from "../../services/mutations/useUpdateById";
import { PiPlus } from "react-icons/pi";
import { toast } from "react-toastify";
import { useCreate } from "../../services/mutations/useCreate";
import { useDeleteById } from "../../services/mutations/useDeleteById";
import { endpoints } from "../../configs/endpoints";

const AddressCard = () => {
  const userID = Cookies.get("USER-ID");
  const [form] = Form.useForm();
  const [isCreate, setIsCreate] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAddress, setselectedAddress] = useState(null);
  const [selectedRegion, setselectedRegion] = useState(null);
  const [selectedSubregion, setselectedSubregion] = useState(null);
  const { i18n, t } = useTranslation();
  const { data, isLoading } = useGetById(
    endpoints.address.getAddressByCustumerId,
    userID
  );
  const { data: AllRegions } = useGetList("/api/region/getAllRegions");
  const { data: AllSubRegions } = useGetById(
    "/api/subRegion/getSubRegionsByRegionId/",
    selectedRegion
  );
  const { data: AllPostFilial } = useGetById(
    "/api/postFilial/getPostFilialBySubRegionId/",
    selectedSubregion
  );

  const { mutate } = useUpdateById("/api/address/editAddress/");

  const { mutate: postAddress, isPending } = useCreate(
    "/api/address/addAddress"
  );

  const { mutate: deleteAddress } = useDeleteById(
    "/api/address/deleteAddress/"
  );
  console.log(data);
  console.log(selectedAddress);
  console.log(selectedRegion);

  if (isLoading) {
    return <></>;
  }
  return (
    <div>
      <div className="flex flex-col gap-4">
        {data?.map((item) => (
          <div className="flex items-center justify-between border border-secondary p-4 font-tenor font-normal">
            <div className="flex gap-3">
              <CiLocationOn size={24} />
              <div className="flex flex-col">
                <h1 className="text-xl text-primary">
                  {i18n.language == "uz"
                    ? item.region.nameUZB
                    : item.region.nameRUS}
                </h1>
                <p className="text-sm text-primary font-tenor">
                  {i18n.language == "uz"
                    ? item.subRegion.nameUZB
                    : item.subRegion.nameRUS}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button
                className="!border-none !bg-transparent"
                onClick={() => deleteAddress(item?.id)}
                icon={<RiDeleteBinLine size={24} />}
              />
              <Button
                className="!border-none !bg-transparent"
                icon={<RiEdit2Line size={24} />}
                onClick={() => (
                  setIsCreate(false),
                  setselectedRegion(item?.region?.id),
                  setselectedSubregion(item?.subRegion?.id),
                  setselectedAddress(item),
                  setIsModalOpen(true),
                  form.setFieldsValue({
                    regionId: item?.region?.id,
                    subRegionId: item?.subRegion?.id,
                    postFilialId: item?.postFilial?.id,
                    street: item?.street,
                    houseNumber: item?.houseNumber,
                  })
                )}
              />
            </div>
          </div>
        ))}

        <div className="text-center mt-2">
          <Button
            className="!font-tenor !font-normal !text-base !border-none !bg-transparent"
            icon={<PiPlus size={24} />}
            children={t("order.add-addr")}
            onClick={() => {
              setIsCreate(true);
              setIsModalOpen(true);
              setselectedAddress(null);
              form.resetFields();
            }}
          />
        </div>
      </div>

      <Modal
        // title="Address Update"
        closable={{ "aria-label": "Custom Close Button" }}
        open={isModalOpen}
        // onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form
          layout="vertical"
          className="!mt-10"
          form={form}
          initialValues
          onFinish={(data) => {
            console.log(data);
            const fullData = {
              customerId: userID,
              ...data,
              street: data.street || "",
              houseNumber: data.houseNumber || "",
              postFilialId: data.postFilialId || "",
            };
            if (isCreate) {
              postAddress(fullData, {
                onSuccess: () => {
                  setIsModalOpen(false);
                  form.resetFields();
                  toast.success(
                    i18n.language == "uz"
                      ? "Manzil muvaffaqiyatli qo'shildi"
                      : "Адрес успешно добавлен"
                  );
                },
              });
            } else {
              mutate(
                { id: selectedAddress?.id, data: fullData },
                {
                  onSuccess: () => {
                    setIsModalOpen(false);
                    form.resetFields();
                    toast.success(
                      i18n.language == "uz"
                        ? "Manzil muvaffaqiyatli yangilandi"
                        : "Адрес успешно обновлен"
                    );
                  },
                }
              );
            }
          }}
        >
          <Form.Item name={"regionId"}>
            <Select
              className="!h-12 !rounded-none !font-tenor !font-normal"
              onChange={(value) => {
                setselectedRegion(value);
                form.setFieldsValue({ subRegionId: null, postFilialId: null });
              }}
              // defaultValue={selectedAddress?.region?.id}
              placeholder={
                i18n.language == "uz"
                  ? "Viloyat yoki shahar"
                  : "Провинция или город"
              }
              options={AllRegions?.map((item) => ({
                value: item?.id,
                label: (
                  <p className="font-tenor font-normal">
                    {i18n.language == "uz" ? item?.nameUZB : item?.nameRUS}
                  </p>
                ),
              }))}
            />
          </Form.Item>
          <Form.Item name={"subRegionId"}>
            <Select
              className="!h-12 !rounded-none !font-tenor !font-normal"
              onChange={(value) => {
                setselectedSubregion(value);
                form.setFieldsValue({ postFilialId: null });
              }}
              placeholder={i18n.language == "uz" ? "Tuman" : "Округ"}
              // defaultValue={selectedAddress?.subRegion?.id}
              options={AllSubRegions?.map((item) => ({
                value: item?.id,
                label: (
                  <p className="font-tenor font-normal">
                    {i18n.language == "uz" ? item?.nameUZB : item?.nameRUS}
                  </p>
                ),
              }))}
            />
          </Form.Item>

          {selectedRegion != 1 && (
            <Form.Item name={"postFilialId"}>
              <Select
                className="!h-12 !rounded-none !font-tenor !font-normal"
                placeholder={
                  i18n.language == "uz" ? "BTS filiali" : "филиал BTS"
                }
                // defaultValue={selectedAddress?.postFilial?.id}
                options={AllPostFilial?.map((item) => ({
                  value: item?.id,
                  label: (
                    <p className="font-tenor font-normal">
                      {i18n.language == "uz"
                        ? item?.postName
                        : item?.postFilialName}
                    </p>
                  ),
                }))}
              />
            </Form.Item>
          )}

          {selectedRegion == 1 && (
            <Flex
              align="center"
              className="gap-2 lg:gap-4 flex-wrap lg:flex-nowrap"
            >
              <Form.Item
                label={
                  <p className="font-tenor font-normal">
                    {i18n.language == "uz" ? "Ko’cha" : "Улица"}
                  </p>
                }
                name={"street"}
                className="lg:!w-3/4 w-full"
              >
                <Input className="!h-12" />
              </Form.Item>
              <Form.Item
                label={
                  <p className="font-tenor font-normal">
                    {i18n.language == "uz" ? "Uy raqami" : "Номер дома"}
                  </p>
                }
                name={"houseNumber"}
                className="lg:!w-1/4"
              >
                <Input className="!h-12" />
              </Form.Item>
            </Flex>
          )}
          <Form.Item className="!mb-1 !mt-10">
            <Button
              className="!h-12 !rounded-none !font-tenor !font-normal "
              type="primary"
              block
              htmlType="submit"
              children={t("cart.save")}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AddressCard;
