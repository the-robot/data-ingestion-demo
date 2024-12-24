"use client";

import React from 'react';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import { GeoJson } from './geojson';
import { OpenApi } from './open-api';

const onChange = (key: string) => {
  console.log(key);
};

const items: TabsProps['items'] = [
  {
    key: 'geojson',
    label: 'GeoJSON',
    children: <GeoJson />,
  },
  {
    key: 'realtime-api',
    label: 'Real-Time API',
    children: <OpenApi />,
  },
];

export default function DataPage() {
  return (
    <Tabs defaultActiveKey="geojson" items={items} onChange={onChange} className='px-2' />
  );
}
