import { Form, Space, Button, Input, App, Card, Spin } from 'antd'
import { useTranslation } from 'react-i18next'
import { useRequest } from 'ahooks'

import * as API from '@/services/system'

type SystemFormSettingType = {
  systemTitle: string
}

export type SearchOptionsType = {
  already: boolean
  allFilterExtName: { label: string; value: string }[]
  allExtractor: { label: string; value: string }[]
  allResolveDirPath: { label: string; value: string }[]
  allLocaleDict: { label: string; value: string }[]
}

const Page: FC = () => {
  const { t } = useTranslation()
  const { message } = App.useApp()
  const [systemForm] = Form.useForm()

  const { loading } = useRequest<SystemFormSettingType, any>(
    async () => await API.getSetting().then((res) => res?.data?.setting),
    {
      onSuccess: (data) => {
        systemForm.setFieldsValue(data)
      },
    },
  )
  const { loading: formLoading, run } = useRequest<
    any,
    [SystemFormSettingType]
  >(async (v) => await API.updateSetting({ setting: v }), {
    manual: true,
    onSuccess: ({ success, data }) => {
      if (success) {
        if (data?.message?.length > 0) {
          message.success(data?.message.join(','))
        }
        message.success(t('系统展示配置设置成功'))
        window.location.reload()
      }
    },
  })

  const handleSystemFormFinish = async (values: SystemFormSettingType) => {
    run(values)
  }

  return (
    <div className="page-container">
      <Spin spinning={loading} tip="正在加载配置，请稍候。。。">
        <Card title="系统展示配置">
          <Form
            form={systemForm}
            labelAlign="left"
            name="systemForm"
            onFinish={handleSystemFormFinish}
          >
            <Form.Item label="系统名称" name="systemTitle">
              <Input maxLength={20} allowClear showCount />
            </Form.Item>

            <Form.Item className="text-right">
              <Space>
                <Button
                  htmlType="button"
                  onClick={() => {
                    systemForm.resetFields()
                  }}
                >
                  重置
                </Button>
                <Button htmlType="submit" loading={formLoading} type="primary">
                  确定
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      </Spin>
    </div>
  )
}

export default Page
