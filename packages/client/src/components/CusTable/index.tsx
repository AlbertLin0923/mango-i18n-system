import { useState } from 'react'
import { Table } from 'antd'
import { Resizable } from 'react-resizable'

import styles from './index.module.less'

const ResizableTitle: React.FC<{}> = (props: any) => {
  const { onResize, width, ...restProps } = props

  if (!width) {
    return <th {...restProps} />
  }

  return (
    <Resizable
      width={width}
      height={0}
      handle={
        <span
          className={styles['react-resizable-handle']}
          onClick={(e) => {
            e.stopPropagation()
          }}
        />
      }
      onResize={onResize}
      draggableOpts={{ enableUserSelectHack: false }}
    >
      <th {...restProps} />
    </Resizable>
  )
}

const CusTable = ({ columns, ...restProps }: any) => {
  const [innerColumns, setInnerColumns] = useState(columns)

  const handleResize =
    (index: number) =>
    (e: Event, { size }: any) => {
      setInnerColumns((columns: any) => {
        const nextColumns = [...columns]
        nextColumns[index] = {
          ...nextColumns[index],
          width: size.width
        }
        return [...nextColumns]
      })
    }

  const _columns = innerColumns.map((col: any, index: number) => ({
    ...col,
    onHeaderCell: (column: any) => ({
      width: column.width,
      onResize: handleResize(index)
    })
  }))

  return (
    <Table
      components={{
        header: {
          cell: ResizableTitle
        }
      }}
      columns={_columns}
      {...restProps}
    />
  )
}

export default CusTable
