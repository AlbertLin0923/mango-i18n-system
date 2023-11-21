import { useState } from 'react'
import { Form, Space, Button, Input, App, Card, Spin } from 'antd'
import { useTranslation } from 'react-i18next'
import { useMount } from 'ahooks'

import * as API from '@/services/system'

import './index.module.scss'

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

  const [pageLoading, setPageLoading] = useState(false)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [systemFormSetting, setSystemFormSetting] =
    useState<SystemFormSettingType>({
      systemTitle: '',
    })

  const getSetting = async () => {
    const { data, success } = await API.getSetting()
    if (success) {
      const {
        setting: { systemTitle },
      } = data

      const _systemFormSetting = {
        systemTitle,
      }

      setSystemFormSetting(() => _systemFormSetting)
      systemForm.setFieldsValue(_systemFormSetting)
    }
  }

  useMount(async () => {
    setPageLoading(true)
    await getSetting()
    setPageLoading(false)
  })

  const handleSystemFormFinish = async (values: SystemFormSettingType) => {
    setPageLoading(true)
    const { success, data } = await API.updateSetting({
      setting: values,
    })
    setPageLoading(false)
    if (success) {
      if (data?.message?.length > 0) {
        message.success(data?.message.join(','))
      }
      message.success(t('系统展示配置设置成功'))
      window.location.reload()
    }
  }

  return (
    <div className="page-container">
      <Spin spinning={pageLoading} tip="正在加载配置，请稍候。。。">
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

            <Form.Item style={{ textAlign: 'right' }}>
              <Space>
                <Button
                  htmlType="button"
                  onClick={() => {
                    systemForm.resetFields()
                  }}
                >
                  重置
                </Button>
                <Button htmlType="submit" type="primary">
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
