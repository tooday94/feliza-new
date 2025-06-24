import Cookies from "js-cookie";
import { useGetById } from "../../services/query/useGetById";
import { useTranslation } from "react-i18next";
import { Button, Form, Input, Modal, Rate, Spin, Tabs, Upload } from "antd";
import { formatDate } from "../../utils/formatDate";
import { PiPlus } from "react-icons/pi";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const CommentsCard = () => {
  const userID = Cookies.get("USER-ID");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [selectedProductId, setselectedProductId] = useState("");
  const { i18n, t } = useTranslation();
  const {
    data,
    isLoading,
    refetch: reviewCommentFetch,
  } = useGetById("/api/review/getReviewsByCustomerId/", userID);
  const {
    data: unreviewedComment,
    isLoading: unreviewedCommentLoading,
    refetch,
  } = useGetById("/api/review/getUnreviewedByCustomerId/", userID);

  if (isLoading || unreviewedCommentLoading) {
    return <Spin />;
  }
  const selectedProduct = unreviewedComment?.filter(
    (item) => item?.productResponse?.id === selectedProductId
  );
  console.log(unreviewedComment);

  return (
    <div>
      <Tabs
        items={[
          {
            key: "1",
            label: t("profile.modal.add-comment.tab1"),
            children: (
              <div className="">
                {!unreviewedComment || unreviewedComment?.length != 0 ? (
                  unreviewedComment?.map((item) => (
                    <div className="">
                      <div className="w-full border-b flex gap-2 p-6">
                        <img
                          className="w-16"
                          src={item?.productResponse?.productImages[0]?.url}
                          alt=""
                        />

                        <div className="flex flex-col gap-3 font-tenor font-normal w-full">
                          <h1 className="text-primary text-base">
                            {i18n.language == "uz"
                              ? item.productResponse?.nameUZB
                              : item.productResponse?.nameUZB}
                          </h1>

                          <div className="flex items-center gap-4 text-accent text-sm">
                            <h1>
                              {t("cart.color") + ": "}
                              {i18n.language == "uz"
                                ? item.productResponse?.color?.nameUZB
                                : item.productResponse?.color?.nameUZB}
                            </h1>
                            <h1>
                              {t("cart.size")}: {item?.size}
                            </h1>
                          </div>

                          <div className="w-full text-center">
                            <Button
                              className="!border-none !font-tenor !font-normal !text-base !text-primary"
                              icon={<PiPlus />}
                              children={t("profile.modal.add-comment.title")}
                              onClick={() => (
                                setselectedProductId(item?.productResponse?.id),
                                setIsModalOpen(true)
                              )}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="">
                    <h1 className="font-tenor font-normal text-lg text-primary">
                      {t("profile.comments.empty")}
                    </h1>
                  </div>
                )}
              </div>
            ),
          },
          {
            key: "2",
            label: t("profile.modal.add-comment.tab2"),
            children: (
              <div className="">
                {data?.map((item) => (
                  <div className="font-tenor font-normal space-y-4 pb-4 border-b">
                    <h1 className="text-base text-primary">
                      {i18n.language == "uz"
                        ? item.productResponseDto.nameUZB
                        : item.productResponseDto.nameUZB}
                    </h1>

                    <div className="space-y-2.5">
                      <div className="flex justify-between">
                        <Rate
                          className="!text-primary"
                          disabled
                          defaultValue={item.rating}
                        />
                        <p className="text-accent text-sm">
                          {formatDate(item.createdAt)}
                        </p>
                      </div>

                      <div className="font-tenor font-normal text-sm text-accent">
                        <h1>
                          {t("cart.color")}:{" "}
                          {item.productResponseDto.color.nameUZB}
                        </h1>
                        {/* <h1>{t("cart.size")}</h1> */}
                      </div>
                    </div>

                    <div className="w-full flex gap-2">
                      {item?.images?.map((item) => (
                        <img className="w-16" src={item.url} alt="" />
                      ))}
                    </div>

                    <div className="font-tenor font-normal text-sm text-[#444]">
                      <h1 className="line-clamp-2">{item.content}</h1>
                    </div>
                  </div>
                ))}
              </div>
            ),
          },
        ]}
        tabBarStyle={{
          position: "sticky",
          top: -25,
          background: "#fff",
          zIndex: 35,
          marginTop: 0,
        }}
      />

      <Modal
        centered
        closable={{ "aria-label": "Custom Close Button" }}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={false}
      >
        {selectedProduct?.map((item) => (
          <div className="">
            <h1 className="font-tenor font-normal text-2xl text-primary pb-6">
              {t("profile.modal.add-comment.title")}
            </h1>
            <div className="w-full flex gap-2 pb-8">
              <img
                className="w-16"
                src={item?.productResponse?.productImages[0]?.url}
                alt=""
              />

              <div className="flex flex-col gap-3 font-tenor font-normal w-full">
                <h1 className="text-primary text-base">
                  {i18n.language == "uz"
                    ? item.productResponse?.nameUZB
                    : item.productResponse?.nameUZB}
                </h1>

                <div className="flex items-center gap-4 text-accent text-sm">
                  <h1>
                    {t("cart.color") + ": "}
                    {i18n.language == "uz"
                      ? item.productResponse?.color?.nameUZB
                      : item.productResponse?.color?.nameUZB}
                  </h1>
                  <h1>
                    {t("cart.size")}: {item?.size}
                  </h1>
                </div>
              </div>
            </div>
          </div>
        ))}

        <Form
          onFinish={async (values) => {
            const formData = new FormData();

            const reviewDto = {
              content: values.content,
              rating: values.rating,
              productId: selectedProductId,
              customerId: userID,
            };
            formData.append("reviewDto", JSON.stringify(reviewDto));

            fileList.forEach((file, index) => {
              formData.append("files", file.originFileObj); // serverda images[] sifatida qabul qilish mumkin
            });

            try {
              await axios.post(
                "https://felizabackend.uz/api/review/addReview",
                formData,
                {
                  headers: {
                    "Content-Type": "multipart/form-data",
                  },
                }
              );
              console.log("Yuborildi!");
              setIsModalOpen(false);
              refetch();
              reviewCommentFetch();
              toast.success(
                i18n.language == "uz"
                  ? "Sharh muvaffaqiyatli qo'shildi!"
                  : "Комментарий успешно добавлен!"
              );
            } catch (err) {
              console.log("Xatolik yuz berdi!", err);
            }
          }}
          initialValues={{
            rating: 5,
          }}
        >
          <Form.Item
            name={"rating"}
            rules={[
              {
                required: true,
                message: t("profile.modal.add-comment.rating.error"),
              },
            ]}
          >
            <Rate
              className="custom-rate"
              style={{ color: "#0d0d0d", fontSize: 40 }}
              defaultValue={5}
            />
            <p className="pt-2 font-tenor font-normal text-sm text-secondary">
              {t("profile.modal.add-comment.rating.desc")}
            </p>
          </Form.Item>
          <Form.Item valuePropName="fileList" name={"file"}>
            <Upload
              multiple
              listType="picture-card"
              beforeUpload={() => false}
              onChange={({ fileList: newFileList }) => setFileList(newFileList)}
            >
              <Button
                className="!border-none !flex flex-col !gap-0 !bg-transparent !text-xs !font-normal !font-tenor !text-primary"
                icon={<PiPlus />}
                children={t("profile.modal.add-comment.img.title")}
              />
            </Upload>
            <p className="pt-2 font-tenor font-normal text-sm text-secondary">
              {t("profile.modal.add-comment.img.desc")}
            </p>
          </Form.Item>
          <Form.Item
            name={"content"}
            rules={[
              {
                required: true,
                message: t("profile.modal.add-comment.content.error"),
              },
            ]}
          >
            <Input.TextArea
              rows={4}
              placeholder={t("profile.modal.add-comment.content.desc")}
            />
          </Form.Item>

          <Form.Item className="!mb-0 !mt-10">
            <Button
              htmlType="submit"
              className="!h-12 !rounded-none"
              block
              type="primary"
              children={t("cart.save")}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
