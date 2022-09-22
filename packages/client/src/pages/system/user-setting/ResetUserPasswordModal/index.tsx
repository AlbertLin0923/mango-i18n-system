import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Form, Modal, Input, message } from 'antd'

import md5 from 'md5'
import * as API from '../../../../services/user'

export type ResetUserPasswordModalProps = React.PropsWithChildren<{
  visible: boolean
  data: any
  onResetTableList: () => void
  onClose: () => void
}>

const ResetUserPasswordModal: React.FC<ResetUserPasswordModalProps> = (props) => {
  const { visible, data, onResetTableList, onClose } = props

  const [form] = Form.useForm()
  const { t } = useTranslation()

  const [submitLoading, setSubmitLoading] = useState<boolean>(false)

  const handleFormSubmit = () => {
    form.validateFields().then((values) => {
      resetUserPassword(values)
    })
  }

  const resetUserPassword = async (values: any) => {
    setSubmitLoading(true)
    const { password } = values
    const delivery = {
      userId: data.userId,
      password: md5(password.trim())
    }

    const result = await API.updateOtherPassword(delivery)
    setSubmitLoading(false)

    if (result?.success) {
      message.success(t('重置用户密码成功'))
      onResetTableList()
      onClose()
    }
  }

  useEffect(() => {
    visible && form && form.setFieldsValue({ username: data.username })
  }, [visible, data, form])

  return (
    <Modal
      title={t('重置用户密码')}
      width="500px"
      visible={visible}
      onOk={() => {
        handleFormSubmit()
      }}
      onCancel={() => {
        form.resetFields()
        onClose()
      }}
      confirmLoading={submitLoading}
    >
      <Form layout="vertical" autoComplete="off" form={form}>
        <Form.Item label={t('用户名')} shouldUpdate>
          {() => {
            return form.getFieldValue('username') || '--'
          }}
        </Form.Item>

        <Form.Item
          name="password"
          label={t('新密码')}
          rules={[
            {
              required: true,
              message: t('请输入密码')
            },
            {
              min: 6,
              message: '最小长度为6'
            },
            {
              max: 20,
              message: '最大长度为20'
            },
            {
              validator: (_, value) => {
                if (value && !String(value).trim())
                  return Promise.reject(new Error(t('请输入密码')))
                return Promise.resolve()
              }
            }
          ]}
          hasFeedback
        >
          <Input.Password placeholder={t('请输入新密码')} />
        </Form.Item>

        <Form.Item
          name="repeatPassword"
          label={t('确认密码')}
          rules={[
            {
              required: true,
              message: t('请输入确认密码')
            },
            {
              min: 6,
              message: '最小长度为6'
            },
            {
              max: 20,
              message: '最大长度为20'
            },
            {
              validator: (_, value) => {
                if (value && !String(value).trim())
                  return Promise.reject(new Error(t('请输入确认密码')))
                return Promise.resolve()
              }
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve()
                }
                return Promise.reject(new Error(t('两次输入密码不匹配!')))
              }
            })
          ]}
          hasFeedback
          dependencies={['password']}
        >
          <Input.Password placeholder={t('请输入确认密码')} />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ResetUserPasswordModal
