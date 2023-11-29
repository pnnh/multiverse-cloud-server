'use client'

import { formatRfc3339 } from '@/utils/datetime'
import styles from './table.module.scss'
import React from 'react'
import Link from 'next/link'
import { TagModel } from '@/models/tag'
import { PLSelectResult } from '@/models/common-result'

export function Table (props: { data: PLSelectResult<TagModel> }) {
  return <table className={styles.Table + ' table w-full'}>
    {/* head */}
    <thead>
      <tr>
        <th className={styles.columnCheck}>
          <label>
            <input type="checkbox" className="checkbox"/>
          </label>
        </th>
        <th>标题</th>
        <th className={styles.columnTime}>修改时间</th>
        <th className={styles.columnOperator}>操作</th>
      </tr>
    </thead>
    <tbody>
      {
        props.data.range.map((item, index) => {
          return <TableRow key={index} model={item}/>
        })
      }

    </tbody>
    {/* foot */}
    <tfoot>
    </tfoot>

  </table>
}

function TableRow (props: { model: TagModel }) {
  const updateTimeString = formatRfc3339(props.model.update_time)
  return <tr className={styles.Row}>
    <th>
      <label>
        <input type="checkbox" className="checkbox"/>
      </label>
    </th>
    <td>
      <Link href={'/console/tags/update?pk=' + props.model.pk}
        title={props.model.title}>{props.model.title}</Link>
    </td>
    <td>
      {updateTimeString}
    </td>
    <th>

    </th>
  </tr>
}