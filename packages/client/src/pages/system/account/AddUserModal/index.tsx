import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Form, Modal, Input, Select, App } from 'antd'
import md5 from 'md5'

import * as API from '@/services/user'
import { roleMap } from '@/dict/user'

export type AddUserModalProps = React.PropsWithChildren<{
  open: boolean
  onResetTableList: () => void
  onClose: () => void
}>

const AddUserModal: React.FC<AddUserModalProps> = ({
  open,
  onResetTableList,
  onClose,
}) => {
  const [form] = Form.useForm()
  const { message } = App.useApp()
  const { t } = useTranslation()

  const [submitLoading, setSubmitLoading] = useState<boolean>(false)

  const handleFormSubmit = () => {
    form.validateFields().then((values) => {
      addUser(values)
    })
  }

  const addUser = async (values: any) => {
    setSubmitLoading(true)
    const { username, password, email, role } = values

    const { success } = await API.addUser({
      username: username.trim(),
      password: md5(password.trim()),
      email: email.trim(),
      role: role.trim(),
    })

    setSubmitLoading(false)
    if (success) {
      message.success(t('新增成功'))
      onResetTableList()
      onClose()
    }
  }

  return (
    <Modal
      confirmLoading={submitLoading}
      open={open}
      title={t('创建用户')}
      width="500px"
      onCancel={() => {
        form.resetFields()
        onClose()
      }}
      onOk={() => {
        handleFormSubmit()
      }}
    >
      <Form autoComplete="off" form={form} layout="vertical">
        <Form.Item
          label={t('用户名')}
          name="username"
          rules={[
            {
              required: true,
              message: t('请输入用户名'),
            },
            {
              min: 2,
              message: '最小长度为2',
            },
            {
              max: 20,
              message: '最大长度为20',
            },
            {
              validator: (_, value) => {
                if (value && !String(value).trim())
                  return Promise.reject(new Error(t('请输入用户名')))
                return Promise.resolve()
              },
            },
          ]}
          hasFeedback
        >
          <Input maxLength={20} placeholder={t('请输入用户名')} allowClear />
        </Form.Item>

        <Form.Item
          label={t('密码')}
          name="password"
          rules={[
            {
              required: true,
              message: t('请输入密码'),
            },
            {
              min: 6,
              message: '最小长度为6',
            },
            {
              max: 20,
              message: '最大长度为20',
            },
            {
              validator: (_, value) => {
                if (value && !String(value).trim())
                  return Promise.reject(new Error(t('请输入密码')))
                return Promise.resolve()
              },
            },
          ]}
          hasFeedback
        >
          <Input.Password
            maxLength={20}
            placeholder={t('请输入密码')}
            allowClear
          />
        </Form.Item>

        <Form.Item
          label={t('邮箱')}
          name="email"
          rules={[
            {
              required: true,
              message: t('请输入邮箱'),
            },
            {
              validator: (_, value) => {
                if (value && !String(value).trim())
                  return Promise.reject(new Error(t('请输入邮箱')))
                return Promise.resolve()
              },
            },
            {
              pattern:
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
              message: '请输入正确的邮箱格式',
            },
          ]}
          hasFeedback
        >
          <Input placeholder={t('请输入邮箱')} allowClear />
        </Form.Item>

        <Form.Item
          label={t('请选择角色')}
          name="role"
          rules={[
            {
              required: true,
              message: t('请选择角色'),
            },
          ]}
        >
          <Select
            filterOption={(input, option) =>
              (String(option?.children) ?? '')
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
            optionFilterProp="children"
            placeholder="请选择角色"
            style={{ width: '100%' }}
            allowClear
            showSearch
          >
            {roleMap.length &&
              roleMap.map((item: any) => {
                return (
                  <Select.Option key={item.value} value={item.value}>
                    {t(item.label)}
                  </Select.Option>
                )
              })}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default AddUserModal
