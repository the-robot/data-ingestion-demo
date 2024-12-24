"use client";

import React, { useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { message, Upload } from 'antd';
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import OpenAPISchemaValidator from "openapi-schema-validator";

const validator = new OpenAPISchemaValidator({ version: 3 });

const { Dragger } = Upload;

type SchemaValidationError = {
  instancePath: string;
  schemaPath: string;
  keyword: string;
  params: {
    missingProperty?: string;
    additionalProperty?: string;
  };
  message: string;
}

export function OpenApi() {
  const [openApi, setOpenApi] = useState<object | null>(null);
  const [schemaErrors, setSchemaErrors] = useState<SchemaValidationError[]>([]);

  const handleFileUpload = async (file: File) => {
    const fileContent = await file.text();
    const parsedContent = JSON.parse(fileContent);

    // Validate Swagger file
    const validationResult = validator.validate(parsedContent);
    if (validationResult.errors.length > 0) {
      console.log(validationResult.errors)
      setSchemaErrors(validationResult.errors as SchemaValidationError[]);
      setOpenApi(parsedContent);
      return
    }

    setSchemaErrors([]);
    setOpenApi(parsedContent);
    message.success("File processed successfully!");
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
      setOpenApi(null);
    },
  };

  return (
    <div className="flex flex-col items-center">
      <div className='w-[1000px]'>
        <p className='py-2 text-lg'>Open API File Validator</p>
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

      {schemaErrors.length > 0 && (
        <div className="w-[1000px] mt-4 bg-red-100 p-4 rounded-md">
          <h3 className="text-lg font-bold text-red-700">Schema Validation Errors:</h3>
          <table className="w-full border-collapse border border-red-300 mt-2">
            <thead>
              <tr className="bg-red-200">
                <th className="border border-red-300 p-2 text-left">Error Type</th>
                <th className="border border-red-300 p-2 text-left">Property</th>
                <th className="border border-red-300 p-2 text-left">Message</th>
              </tr>
            </thead>
            <tbody>
              {schemaErrors.map((error, index) => (
                <tr key={index} className="hover:bg-red-50">
                  <td className="border border-red-300 p-2">{
                  error.keyword === 'additionalProperties'
                    ? 'Unknown Property'
                    : error.keyword === 'required'
                      ? 'Missing Property'
                      : error.keyword === 'type'
                        ? 'Invalid Type'
                        : error.keyword
                  }</td>
                  <td className="border border-red-300 p-2">{
                  error.keyword === 'additionalProperties'
                    ? error.params.additionalProperty
                    : error.params.missingProperty
                      ? error.params.missingProperty
                      : error.instancePath
                  }</td>
                  <td className="border border-red-300 p-2">{error.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {openApi && (
          <div className="max-w-[1000px] mt-4 bg-gray-100 pt-4 rounded-md overflow-auto">
            <h3 className="text-lg px-2 font-bold">Open API File:</h3>
            <SyntaxHighlighter
              language="json"
              style={vscDarkPlus}
              showLineNumbers
              className="max-h-[400px] rounded-md"
            >
              {JSON.stringify(openApi, null, 2).slice(0, 20000)}
            </SyntaxHighlighter>
          </div>
        )}
    </div>
  );
}
