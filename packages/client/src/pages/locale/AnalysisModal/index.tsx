import React from 'react'
import { Modal, Table, Progress } from 'antd'

import { useTranslation } from 'react-i18next'

export type AnalysisModalProps = React.PropsWithChildren<{
  localeDictWithLabel: Array<any>
  filterTableData: Array<any>
  visible: boolean
  onClose: () => void
}>

const AnalysisModal: React.FC<AnalysisModalProps> = (props) => {
  const { t } = useTranslation()
  const { localeDictWithLabel, filterTableData, visible, onClose } = props

  const data = localeDictWithLabel.map((item) => {
    const name = item['value']
    const locale = item['label']
    const all = filterTableData.length
    const finished = filterTableData.filter((i) => {
      return i[name] !== '' && i[name] !== undefined
    }).length

    const finishedPercent = Math.floor((finished / all) * 100)

    const unfinished = filterTableData.filter((i) => {
      return i[name] === '' || i[name] === undefined
    }).length

    return {
      key: locale,
      locale,
      all,
      finished,
      unfinished,
      finishedPercent
    }
  })

  const columns = [
    {
      title: '语言包',
      dataIndex: 'locale',
      key: 'locale'
    },
    {
      title: '总数目',
      dataIndex: 'all',
      key: 'all'
    },
    {
      title: '已翻译',
      dataIndex: 'finished',
      key: 'finished'
    },
    {
      title: '未翻译',
      dataIndex: 'unfinished',
      key: 'unfinished'
    },
    {
      title: '翻译进度',
      dataIndex: 'finishedPercent',
      key: 'finishedPercent',
      render: (text: number) => {
        return <Progress percent={text} />
      }
    }
  ]

  return (
    <Modal
      width="50vw"
      title={t('数据统计')}
      visible={visible}
      footer={null}
      maskClosable={false}
      onCancel={() => {
        onClose()
      }}
    >
      <Table columns={columns} dataSource={data} pagination={false} />
    </Modal>
  )
}

export default AnalysisModal
