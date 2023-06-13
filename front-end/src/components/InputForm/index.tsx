// Librarys
import React, { useEffect, useState } from "react";
import { get } from "lodash";

// Atnd
import {
  Button,
  Col,
  Form,
  InputNumber,
  Row,
  Select,
  Slider,
  Space,
  Spin,
} from "antd";

// Constants
import {
  REAL_ESTATES,
  RANGE_AREA,
  RANGE_BATHROOM,
  RANGE_BEDROOM,
} from "../../constants";

// APIs
import districtApi from "../../services/districts";

// Types
import { TDistrict } from "../../types";

const { Option } = Select;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

interface InputFormProps {
  onSubmitInputForm: Function;
  isLoading: boolean;
  isDarkMode: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

function InputForm({
  onSubmitInputForm,
  isLoading,
  isDarkMode,
  setIsLoading,
}: InputFormProps) {
  const [form] = Form.useForm();
  // District State
  const [districtList, setDistrictList] = useState<TDistrict[]>([]);

  const [minAreaValue, setMinAreaValue] = useState<number>(RANGE_AREA.min);
  const [maxAreaValue, setMaxAreaValue] = useState<number>(RANGE_AREA.max);

  const onAreaChange = (value: [number, number]) => {
    setMinAreaValue(value[0]);
    setMaxAreaValue(value[1]);
  };

  // Bathroom State
  const [minBathValue, setMinBathValue] = useState<number>(RANGE_BATHROOM.min);
  const [maxBathValue, setMaxBathValue] = useState<number>(RANGE_BATHROOM.max);

  const onBathChange = (value: [number, number]) => {
    setMinBathValue(value[0]);
    setMaxBathValue(value[1]);
  };

  // Bedroom State
  const [minBedValue, setMinBedValue] = useState<number>(RANGE_BEDROOM.min);
  const [maxBedValue, setMaxBedValue] = useState<number>(RANGE_BEDROOM.max);

  const onBedChange = (value: [number, number]) => {
    setMinBedValue(value[0]);
    setMaxBedValue(value[1]);
  };

  // Fetch data
  const fetchDistricts = async () => {
    const response = await districtApi.getAll();
    setDistrictList(get(response, "data.results", []));
  };

  useEffect(() => {
    fetchDistricts();
  }, []);

  useEffect(() => {
    form.setFieldValue("area", [minAreaValue, maxAreaValue]);
    form.setFieldValue("bathroom", [minBathValue, maxBathValue]);
    form.setFieldValue("bedroom", [minBedValue, maxBedValue]);
  }, [
    minAreaValue,
    maxAreaValue,
    form,
    minBathValue,
    maxBathValue,
    minBedValue,
    maxBedValue,
  ]);

  return (
    <Form
      form={form}
      name="validate_other"
      {...formItemLayout}
      onFinish={(values) => onSubmitInputForm(values)}
      style={{
        maxWidth: 1000,
        color: `${isDarkMode ? "white" : "black"}`,
      }}
    >
      <Form.Item
        name="city"
        label="City"
        style={{ color: `${isDarkMode ? "white" : "black"}` }}
        hasFeedback
        initialValue="hcm"
        rules={[{ message: "Please select your city!" }]}
      >
        <Select placeholder="Please select your city" disabled>
          <Option value="hcm" key="hcm">
            Thành phố Hồ Chí Minh
          </Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="district"
        label="District"
        hasFeedback
        initialValue="Huyện Bình Chánh"
        rules={[{ required: true, message: "Please select your district!" }]}
        style={{ color: "white" }}
      >
        <Select placeholder="Please select your district">
          {districtList.length > 0
            ? districtList.map((item) => (
                <Option value={item.district_name} key={item.district_id}>
                  {item.district_name}
                </Option>
              ))
            : ""}
        </Select>
      </Form.Item>

      <Form.Item
        name="type"
        label="Type"
        hasFeedback
        initialValue={REAL_ESTATES[0].key}
        rules={[
          { required: true, message: "Please select the type of real estate!" },
        ]}
      >
        <Select placeholder="Please select a type of real estate">
          {REAL_ESTATES.map((item) => (
            <Option value={item.key} key={item.key}>
              {item.name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="area"
        label="Area (m2)"
        initialValue={[minAreaValue, maxAreaValue]}
        rules={[{ required: true, message: "Please select your area!" }]}
      >
        <Row>
          <Col span={5}>
            <InputNumber
              min={RANGE_AREA.min}
              max={RANGE_AREA.max}
              step={RANGE_AREA.step}
              value={minAreaValue}
              onChange={(newValue: number | null) =>
                setMinAreaValue(newValue || 0)
              }
            />
          </Col>
          <Col span={14}>
            <Slider
              range
              step={RANGE_AREA.step}
              min={RANGE_AREA.min}
              max={RANGE_AREA.max}
              value={[minAreaValue, maxAreaValue]}
              onChange={onAreaChange}
            />
          </Col>
          <Col span={5}>
            <InputNumber
              min={RANGE_AREA.min}
              max={RANGE_AREA.max}
              value={maxAreaValue}
              step={RANGE_AREA.step}
              onChange={(newValue: number | null) =>
                setMaxAreaValue(newValue || 0)
              }
            />
          </Col>
        </Row>
      </Form.Item>

      <Form.Item
        name="bathroom"
        label="Bathroom"
        initialValue={[minBathValue, maxBathValue]}
        rules={[{ required: true, message: "Please select your bathrroom!" }]}
      >
        <Row>
          <Col span={5}>
            <InputNumber
              min={RANGE_BATHROOM.min}
              max={RANGE_BATHROOM.max}
              step={RANGE_BATHROOM.step}
              value={minBathValue}
              onChange={(newValue: number | null) =>
                setMinBathValue(newValue || 0)
              }
            />
          </Col>
          <Col span={14}>
            <Slider
              range
              step={RANGE_BATHROOM.step}
              min={RANGE_BATHROOM.min}
              max={RANGE_BATHROOM.max}
              value={[minBathValue, maxBathValue]}
              onChange={onBathChange}
            />
          </Col>
          <Col span={5}>
            <InputNumber
              min={RANGE_BATHROOM.min}
              max={RANGE_BATHROOM.max}
              step={RANGE_BATHROOM.step}
              value={maxBathValue}
              onChange={(newValue: number | null) =>
                setMaxBathValue(newValue || 0)
              }
            />
          </Col>
        </Row>
      </Form.Item>

      <Form.Item
        name="bedroom"
        label="Bedroom"
        initialValue={[minBedValue, maxBedValue]}
        rules={[{ required: true, message: "Please select your bedroom!" }]}
      >
        <Row>
          <Col span={5}>
            <InputNumber
              min={RANGE_BEDROOM.min}
              max={RANGE_BEDROOM.max}
              step={RANGE_BEDROOM.step}
              value={minBedValue}
              onChange={(newValue: number | null) =>
                setMinBedValue(newValue || 0)
              }
            />
          </Col>
          <Col span={14}>
            <Slider
              range
              step={RANGE_BEDROOM.step}
              min={RANGE_BEDROOM.min}
              max={RANGE_BEDROOM.max}
              value={[minBedValue, maxBedValue]}
              onChange={onBedChange}
            />
          </Col>
          <Col span={5}>
            <InputNumber
              min={RANGE_BEDROOM.min}
              max={RANGE_BEDROOM.max}
              step={RANGE_BEDROOM.step}
              value={maxBedValue}
              onChange={(newValue: number | null) =>
                setMaxBedValue(newValue || 0)
              }
            />
          </Col>
        </Row>
      </Form.Item>

      <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
        <Space>
          <Button
            type="primary"
            htmlType="submit"
            disabled={isLoading}
            style={{ width: "200px" }}
          >
            {isLoading ? (
              <>
                <Spin />
                &ensp;
              </>
            ) : (
              ""
            )}{" "}
            Dự đoán
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}

export default React.memo(InputForm);
