import { Button, Form, Select } from "antd";
import Cookies from "js-cookie";
import { useGetList } from "../../services/query/useGetList";
import { useGetById } from "../../services/query/useGetById";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { IoAddOutline } from "react-icons/io5";
import { useCreate } from "../../services/mutations/useCreate";

const AddAddress = () => {
  const userID = Cookies.get("USER-ID");
  const { i18n, t } = useTranslation();
  const [form] = Form.useForm();
  const [showForm, setShowForm] = useState(false);
  const [selectedRegionId, setselectedRegionId] = useState(null);
  const [selectedSubRegionId, setselectedSubRegionId] = useState(null);
  const { data: regions } = useGetList("/api/region/getAllRegions");
  const { data: subRegions } = useGetById(
    "/api/subRegion/getSubRegionsByRegionId/",
    selectedRegionId
  );
  const { data: postFilials } = useGetById(
    "/api/postFilial/getPostFilialBySubRegionId/",
    selectedSubRegionId
  );

  const { mutate } = useCreate(
    "/api/address/addAddress",
    "/api/address/getAddressesByCustomerId/"
  );

  const onSubmit = () => {
    const values = form.getFieldsValue();
    const fullData = { ...values, customerId: userID };
    mutate(fullData, {
      onSuccess: () => {
        setShowForm(false);
      },
    });
  };

  return (
    <div className="duration-700  space-y-4">
      <Button
        className="!border-none mx-auto !font-tenor !font-normal !pb-0"
        icon={<IoAddOutline size={24} />}
        children={t("order.add-addr")}
        onClick={() => (form.resetFields(), setShowForm(!showForm))}
      />

      <Form
        form={form}
        style={{ display: showForm ? "block" : "none" }}
        // onFinish={(data) => onSubmit(data)}
        className=""
        layout="vertical"
      >
        <Form.Item name={"regionId"}>
          <Select
            placeholder={
              i18n.language == "uz"
                ? "Viloyat yoki shahar"
                : "Провинция или город"
            }
            onChange={(value) => setselectedRegionId(value)}
            allowClear
            options={regions?.map((item) => ({
              value: item.id,
              label: i18n.language == "uz" ? item.nameUZB : item.nameRUS,
            }))}
          />
        </Form.Item>
        <Form.Item name={"subRegionId"}>
          <Select
            placeholder={i18n.language == "uz" ? "Tuman" : "Округ"}
            //   open={selectedRegionId ? true : false}
            onChange={(value) => setselectedSubRegionId(value)}
            allowClear
            options={subRegions?.map((item) => ({
              value: item.id,
              label: i18n.language == "uz" ? item.nameUZB : item.nameRUS,
            }))}
          />
        </Form.Item>
        <Form.Item name={"postFilialId"}>
          <Select
            // onChange={(value) => setselectedSubRegionId(value)}
            //   open={selectedSubRegionId ? true : false}
            placeholder={i18n.language == "uz" ? "BTS filiali" : "филиал BTS"}
            allowClear
            options={postFilials?.map((item) => ({
              value: item.id,
              label: i18n.language == "uz" ? item.streetUZB : item.streetRUS,
            }))}
          />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            onClick={onSubmit}
            children={t("order.add-addr")}
          />
        </Form.Item>
        {/* <Form.Item name={""}></Form.Item> */}
      </Form>
    </div>
  );
};

export default AddAddress;
