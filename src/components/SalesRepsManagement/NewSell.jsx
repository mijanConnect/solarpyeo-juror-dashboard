import React from "react";
import { Button, Form, Input, InputNumber, Select, DatePicker } from "antd";
import { IoEyeSharp, IoArrowBack } from "react-icons/io5";

const { Option } = Select;

const NewSell = ({ onBack, onSubmit }) => {
  const handleSubmit = (values) => {
    onSubmit(values);
  };

  return (
    <div className="w-full max-w-xl mx-auto mt-8">
      <div className="flex gap-4 items-center mb-2">
        <Button
          icon={<IoArrowBack />}
          onClick={onBack}
          className="mb-4"
        ></Button>
        <h1 className="text-[24px] font-bold mb-4">New Sell</h1>
      </div>
      <Form layout="vertical" onFinish={handleSubmit}>
        <div className="flex justify-between gap-10">
          <div className="w-full border py-8 rounded-lg">
            <h1 className="text-[24px] font-bold text-primary bg-white px-6 pb-6">
              New Transaction
            </h1>
            <div className="bg-[#D7F4DE] p-6">
              <Form.Item
                label={
                  <span
                    style={{
                      color: "black",
                      fontSize: "22px",
                      fontWeight: "bold",
                    }}
                  >
                    Card ID
                  </span>
                }
                name="cardId"
                // rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label={
                  <span
                    style={{
                      color: "black",
                      fontSize: "22px",
                      fontWeight: "bold",
                    }}
                  >
                    Available Point
                  </span>
                }
                name="availablePoint"
                // rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label={
                  <span
                    style={{
                      color: "black",
                      fontSize: "22px",
                      fontWeight: "bold",
                    }}
                  >
                    Total Bill Amount ($)
                  </span>
                }
                name="totalAmount"
                // rules={[{ required: true }]}
              >
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item
                label={
                  <span
                    style={{
                      color: "black",
                      fontSize: "22px",
                      fontWeight: "bold",
                    }}
                  >
                    Point Redeem
                  </span>
                }
                name="pointRedeem"
              >
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item
                label={
                  <span
                    style={{
                      color: "black",
                      fontSize: "22px",
                      fontWeight: "bold",
                    }}
                  >
                    Expiry Date
                  </span>
                }
                name="date"
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
              <div className="flex flex-col items-center border border-primary rounded p-4 bg-white">
                <h1 className="text-[18px] font-bold">Gift Card #1234</h1>
                <p className="text-[18px] font-normal">
                  Points Available 500 Points
                </p>
              </div>
              <Button className="w-full bg-primary text-white mt-6 text-[16px] font-bold p-5">
                Apply Gift Card
              </Button>
            </div>
            <div className="flex justify-between mt-6 mx-6">
              <Button className="bg-primary text-white">Scan Now</Button>
              <Button className="bg-primary text-white">Add Rewords</Button>
            </div>
          </div>

          <div className="w-full border py-8 rounded-lg">
            <h1 className="text-[24px] font-bold text-primary bg-white px-6 pb-6">
              Summery
            </h1>
            <div className="px-6 flex flex-col gap-2">
              <div className="flex justify-between">
                <p className="font-bold text-[24px] text-secondary">
                  Total Bill:
                </p>
                <p className="font-bold text-[24px] text-secondary">$0.00</p>
              </div>
              <div className="flex justify-between">
                <p className="font-bold text-[24px] text-secondary">
                  Points Redeemed:
                </p>
                <p className="font-bold text-[24px] text-secondary">$0.00</p>
              </div>
              <div className="flex justify-between">
                <p className="font-bold text-[24px] text-secondary">
                  Points Earned:
                </p>
                <p className="font-bold text-[24px] text-secondary">+0</p>
              </div>
              <div className="flex justify-between">
                <p className="font-bold text-[24px] text-secondary">
                  Gift Card:
                </p>
                <p className="font-bold text-[24px] text-secondary">+0</p>
              </div>
              <div className="flex justify-between border-t-2 border-primary">
                <p className="font-bold text-[24px] text-secondary">
                  Final Amount:
                </p>
                <p className="font-bold text-[24px] text-secondary">$0.00</p>
              </div>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-full bg-primary text-white mt-6 text-[16px] font-bold p-5"
                >
                  Complete Transaction
                </Button>
              </Form.Item>
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default NewSell;
