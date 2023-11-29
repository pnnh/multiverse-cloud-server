'use client'

import {Breadcrumb} from '~/antd'
import React from 'react'

export function SiteNav (props: { rawQuery: string }) {
  return <Breadcrumb
    items={[
      {
        title: <a href="/console">控制台</a>,
      },
      {
        title: <a href="/console/pipeline">构建流水线</a>,
      },
      {
        title: '构建阶段',
      },
    ]}
  />
}