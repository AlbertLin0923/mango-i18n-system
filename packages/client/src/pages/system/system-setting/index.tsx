import React, { useState, useEffect } from 'react'
import { Form, Space, Button, Input, message, Card, Spin } from 'antd'
import { useTranslation } from 'react-i18next'

import * as API from '../../../services/system'
import styles from './index.module.less'

type SystemFormSettingType = {
  systemTitle: string
}

export type SearchOptionsType = {
  already: boolean
  allFilterExtName: Array<{ label: string; value: string }>
  allExtractor: Array<{ label: string; value: string }>
  allResolveDirPath: Array<{ label: string; value: string }>
  allLocaleDict: Array<{ label: string; value: string }>
}

const SystemSetting: React.FC<{}> = () => {
  const { t } = useTranslation()

  const [systemForm] = Form.useForm()

  const [pageLoading, setPageLoading] = useState(false)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [systemFormSetting, setSystemFormSetting] = useState<SystemFormSettingType>({
    systemTitle: ''
  })

  const getSetting = async () => {
    const { data, success } = await API.getSetting()
    if (success) {
      const {
        setting: { systemTitle }
      } = data

      const _systemFormSetting = {
        systemTitle
      }

      setSystemFormSetting(() => _systemFormSetting)
      systemForm.setFieldsValue(_systemFormSetting)
    }
  }

  const pageInitFunc = async () => {
    setPageLoading(true)
    await getSetting()
    setPageLoading(false)
  }

  useEffect(() => {
    pageInitFunc()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSystemFormFinish = async (values: SystemFormSettingType) => {
    setPageLoading(true)
    const { success, data } = await API.updateSetting({
      setting: values
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
        <Card title="系统展示配置" className={styles.card}>
          <Form
            form={systemForm}
            name="systemForm"
            labelAlign="left"
            onFinish={handleSystemFormFinish}
          >
            <Form.Item
              name="systemTitle"
              label="系统名称"
              rules={[
                { required: true },
                {
                  validator: (_, value) => {
                    if (value && !String(value).trim()) return Promise.reject(new Error('请输入'))
                    return Promise.resolve()
                  }
                }
              ]}
            >
              <Input allowClear />
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
                <Button type="primary" htmlType="submit">
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

export default SystemSetting
