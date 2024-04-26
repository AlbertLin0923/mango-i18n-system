import { Modal, Table, Progress } from 'antd'
import { useTranslation } from 'react-i18next'

const AnalysisModal: FC<{
  localeDictWithLabel: { label: string; value: string }[]
  filterTableData: any[]
  open: boolean
  onClose: () => void
}> = ({ localeDictWithLabel, filterTableData, open, onClose }) => {
  const { t } = useTranslation()

  const data =
    localeDictWithLabel?.map(({ label, value }) => {
      const all = filterTableData.length
      const finished = filterTableData?.filter(
        (i) => i[value] !== '' && i[value] !== undefined,
      )?.length

      console.log('finished', finished, filterTableData, value)

      return {
        key: label,
        locale: label,
        all,
        finished,
        unfinished: filterTableData.filter(
          (i) => i[value] === '' || i[value] === undefined,
        ).length,
        finishedPercent: Math.floor((finished / all) * 100),
      }
    }) ?? []

  return (
    <Modal
      footer={null}
      maskClosable={false}
      open={open}
      title={t('数据统计')}
      width="50vw"
      onCancel={onClose}
    >
      <Table
        columns={[
          {
            title: t('语言包'),
            dataIndex: 'locale',
            key: 'locale',
          },
          {
            title: t('总数目'),
            dataIndex: 'all',
            key: 'all',
          },
          {
            title: t('已翻译'),
            dataIndex: 'finished',
            key: 'finished',
          },
          {
            title: t('未翻译'),
            dataIndex: 'unfinished',
            key: 'unfinished',
          },
          {
            title: t('翻译进度'),
            dataIndex: 'finishedPercent',
            key: 'finishedPercent',
            render: (text: number) => <Progress percent={text} />,
          },
        ]}
        dataSource={data}
        pagination={false}
      />
    </Modal>
  )
}

export default AnalysisModal
