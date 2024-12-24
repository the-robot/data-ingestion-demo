"use client";

import React, { useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { message, Upload } from 'antd';
import { cleanGeojsonProperties, GeoJSON } from './cleaner';
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

const { Dragger } = Upload;

export function GeoJson() {
  const [geoJson, setGeoJson] = useState<GeoJSON | null>(null);

  const handleFileUpload = async (file: File) => {
    try {
      const fileContent = await file.text();
      const parsedContent = JSON.parse(fileContent) as GeoJSON;
      const cleanedGeoJson = cleanGeojsonProperties(parsedContent);
      setGeoJson(cleanedGeoJson);
      message.success("File processed successfully!");
    } catch (err) {
      console.error("Error processing file:", err);
      message.error("Invalid GeoJSON file.");
    }
  };

  const props: UploadProps = {
    name: 'file',
    multiple: false,
    maxCount: 1,
    onChange(info) {
      const { status, originFileObj } = info.file;
      if (status === "done" && originFileObj) {
        handleFileUpload(originFileObj);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onRemove() {
      setGeoJson(null);
    },
  };

  return (
    <div className="flex flex-col items-center">
      <div className='w-[1000px]'>
        <p className='py-2 text-lg'>GeoJSON File Reformatter</p>
        <Dragger {...props}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click or drag file to this area to upload</p>
          <p className="ant-upload-hint">
            Support for a single upload. Strictly prohibited from uploading company data or other
            banned files.
          </p>
        </Dragger>
      </div>

      {geoJson && (
          <div className="max-w-[1000px] mt-4 bg-gray-100 pt-4 rounded-md overflow-auto">
            <h3 className="text-lg px-2 font-bold">Processed GeoJSON:</h3>
            <SyntaxHighlighter
              language="json"
              style={vscDarkPlus}
              showLineNumbers
              className="max-h-[400px] rounded-md"
            >
              {JSON.stringify(geoJson, null, 2).slice(0, 20000)}
            </SyntaxHighlighter>
          </div>
        )}
    </div>
  );
}
