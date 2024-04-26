import { useTranslation } from 'react-i18next'
import { Form, Modal, Select } from 'antd'
import { useRequest } from 'ahooks'

import { commonSelectProps } from '@/utils'
import * as API from '@/services/locale'

const DownloadLocaleModal: FC<{
  localeDictWithLabel: { label: string; value: string }[]
  open: boolean
  onClose: () => void
}> = ({ localeDictWithLabel, open, onClose }) => {
  const [form] = Form.useForm()
  const { t } = useTranslation()

  const { loading, run } = useRequest<any, any>(
    async () => await API.getLocaleMap().then((res) => res?.data?.map),
    {
      manual: true,
      onSuccess: async (map, params) => {
        const downloadLocaleFileNameArr = params?.[0]?.downloadLocaleFileNameArr
        if (map) {
          downloadLocaleFileNameArr.forEach((val: string) => {
            const item = JSON.stringify(map[val], null, 2)
            const element = document.createElement('a')
            element.setAttribute(
              'href',
              'data:text/json;charset=utf-8,' + encodeURIComponent(item),
            )
            element.download = `${val}.json`
            element.click()
          })
        }
      },
    },
  )

  return (
    <Modal
      confirmLoading={loading}
      maskClosable={false}
      okText={t('下载')}
      open={open}
      title={t('下载语言包')}
      width="50vw"
      onCancel={() => {
        form.resetFields()
        onClose()
      }}
      onOk={async () => {
        const values = await form.validateFields()
        run(values)
      }}
    >
      <Form autoComplete="off" form={form} layout="horizontal">
        <Form.Item
          initialValue={localeDictWithLabel.map((i) => i.value)}
          label={t('导出语言包')}
          name="downloadLocaleFileNameArr"
          rules={[
            {
              required: true,
              message: t('请选择导出语言包'),
            },
          ]}
        >
          <Select
            {...commonSelectProps}
            mode="multiple"
            options={localeDictWithLabel?.map(({ label, value }) => ({
              label: `${value}.json`,
              value,
            }))}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default DownloadLocaleModal
