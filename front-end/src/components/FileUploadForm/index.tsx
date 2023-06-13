// Libs
import React, { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
// import dataFile from "./data_training.xlsx";
// Atnd
import { Button, Form, Space, Upload } from "antd";
import { DownloadOutlined, InboxOutlined } from "@ant-design/icons";

function UploadForm() {
  const [data, setData] = useState<unknown[]>([]);

  const onFinish = (info: any) => {
    console.log("info: ", info);
    const { status, response } = info.dragger[0];
    console.log("status: ", status);
    console.log("response: ", response);

    if (status === "done") {
      const workbook = XLSX.read(response, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      setData(jsonData);
    } else if (status === "error") {
      console.log("File upload failed.: ");
    }
  };

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

  const handleExport = () => {
    const excelFilePath = "/data_training.xlsx";
    // "../Fdata_training.xlsx";

    // Đọc dữ liệu từ file Excel
    const workbook = XLSX.readFile(excelFilePath);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    // Tạo một bảng dữ liệu mới từ dữ liệu đọc được
    const newWorksheet = XLSX.utils.aoa_to_sheet(jsonData);
    const newWorkbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, "Sheet1");

    // Xuất file Excel mới
    const excelBuffer = XLSX.write(newWorkbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "training_data.xlsx");
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
      <Form.Item label="Dragger">
        <Form.Item
          name="dragger"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          noStyle
        >
          <Upload.Dragger name="files" accept=".xlsx" action={"/upload-form"}>
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

      <Button icon={<DownloadOutlined />} onClick={handleExport}>
        Export Excel
      </Button>

      <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
        <Space>
          <Button type="primary" htmlType="submit">
            Dự đoán
          </Button>
          <Button htmlType="reset">reset</Button>
        </Space>
      </Form.Item>
    </Form>
  );
}

export default React.memo(UploadForm);
