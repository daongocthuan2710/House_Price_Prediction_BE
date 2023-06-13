// Libs
import React from "react";
import * as XLSX from "xlsx";

// Atnd
import { Button, Form, Space, Upload, Spin } from "antd";
import { DownloadOutlined, InboxOutlined } from "@ant-design/icons";
import { isNull } from "lodash";

import dataFile from "./data_training.xlsx";

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

interface UploadFormProps {
  onSetValuesUpload: Function;
  isLoading: boolean;
}

function UploadForm({ onSetValuesUpload, isLoading }: UploadFormProps) {
  const onFinish = async (info: any) => {
    try {
      const { originFileObj } = info.dragger[0];
      if (originFileObj) {
        const data = await originFileObj.arrayBuffer();
        const workbook = XLSX.read(data);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData: any[][] = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          defval: null,
        });

        handleDataUpload(jsonData);
      }
    } catch (err) {
      console.log("File upload failed.: ");
    }
  };

  function isAllNull(arr: any[]): boolean {
    return arr.every((item) => isNull(item));
  }

  function handleValues(arr: any[]): any[] {
    // Filter null values
    const filterNullArray = arr.filter((item) => item !== null);

    // Sort values
    const sortedArr = filterNullArray.sort(function (a, b) {
      if (a > b) return 1;
      if (a < b) return -1;
      return 0;
    });

    // Remove duplicates
    const uniqueArr = sortedArr.filter(
      (item, index) => sortedArr.indexOf(item) === index
    );

    return uniqueArr;
  }

  const handleDataUpload = (data: any[][]) => {
    const districtIndex = data[0].indexOf("district");
    const typeIndex = data[0].indexOf("type");
    const bedIndex = data[0].indexOf("bedroom");
    const bathIndex = data[0].indexOf("bathroom");
    const areaIndex = data[0].indexOf("area");

    const district = [];
    const type = [];
    const area = [];
    const bathroom = [];
    const bedroom = [];

    const maxRow = 99;
    for (let i = 1; i < maxRow; i++) {
      if (isAllNull(data[i])) break;

      if (districtIndex >= 0) district.push(data[i][districtIndex]);
      if (typeIndex >= 0) type.push(data[i][typeIndex]);
      if (bedIndex >= 0) bedroom.push(data[i][bedIndex]);
      if (bathIndex >= 0) bathroom.push(data[i][bathIndex]);
      if (areaIndex >= 0) area.push(data[i][areaIndex]);
    }

    onSetValuesUpload(
      handleValues(district),
      handleValues(type),
      handleValues(area),
      handleValues(bathroom),
      handleValues(bedroom)
    );
  };

  return (
    <Form
      name="validate_other"
      style={{
        maxWidth: 1000,
        // color: `${isDarkMode ? "white" : "black"}`,
      }}
      {...formItemLayout}
      onFinish={onFinish}
      initialValues={{
        "input-number": 3,
        "checkbox-group": ["A", "B"],
        rate: 3.5,
      }}
    >
      <Form.Item label="Upload">
        <Form.Item
          name="dragger"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          noStyle
        >
          <Upload.Dragger name="files" accept=".xlsx">
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Click or drag file to this area to upload
            </p>
            <p className="ant-upload-hint">
              Support for a single or bulk upload.
            </p>
          </Upload.Dragger>
        </Form.Item>
      </Form.Item>

      <Button
        icon={<DownloadOutlined />}
        href={dataFile}
        download={"data_sample.xlsx"}
        style={{ marginBottom: `20px` }}
      >
        Export mẫu Excel
      </Button>

      <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
        <Space>
          <Button type="primary" htmlType="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Spin />
                &ensp;
              </>
            ) : (
              ""
            )}
            Dự đoán
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}

export default React.memo(UploadForm);
