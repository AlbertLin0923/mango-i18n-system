import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import md5 from 'md5'
import { Form, Modal, Input, Select, message } from 'antd'

import * as API from '../../../../services/user'
import { AddUserParamsType } from '../../../../services/user'
import { SearchOptionsType } from '../index'

export type AddUserModalProps = React.PropsWithChildren<{
  visible: boolean
  searchOptions: SearchOptionsType
  onResetTableList: () => void
  onClose: () => void
}>

const AddUserModal: React.FC<AddUserModalProps> = (props) => {
  const { visible, searchOptions, onResetTableList, onClose } = props

  const { roleMap } = searchOptions

  const [form] = Form.useForm()
  const { t } = useTranslation()

  const [submitLoading, setSubmitLoading] = useState<boolean>(false)

  const handleFormSubmit = () => {
    form.validateFields().then((values) => {
      addUser(values)
    })
  }

  const addUser = async (values: AddUserParamsType) => {
    setSubmitLoading(true)
    const { username, password, email, role } = values
    const delivery = {
      username: username.trim(),
      password: md5(password.trim()),
      email: email.trim(),
      role: role.trim()
    }

    const { success } = await API.addUser(delivery)
    setSubmitLoading(false)
    if (success) {
      message.success(t('新增成功'))

      onResetTableList()
      onClose()
    }
  }

  return (
    <Modal
      title={t('创建用户')}
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
        <Form.Item
          name="username"
          label={t('用户名')}
          rules={[
            {
              required: true,
              message: t('请输入用户名')
            },
            {
              min: 2,
              message: '最小长度为2'
            },
            {
              max: 20,
              message: '最大长度为20'
            },
            {
              validator: (_, value) => {
                if (value && !String(value).trim())
                  return Promise.reject(new Error(t('请输入用户名')))
                return Promise.resolve()
              }
            }
          ]}
          hasFeedback
        >
          <Input placeholder={t('请输入用户名')} allowClear />
        </Form.Item>

        <Form.Item
          name="password"
          label={t('密码')}
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
          <Input.Password placeholder={t('请输入密码')} allowClear />
        </Form.Item>

        <Form.Item
          name="email"
          label={t('邮箱')}
          rules={[
            {
              required: true,
              message: t('请输入邮箱')
            },
            {
              validator: (_, value) => {
                if (value && !String(value).trim())
                  return Promise.reject(new Error(t('请输入邮箱')))
                return Promise.resolve()
              }
            },
            {
              pattern:
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
              message: '请输入正确的邮箱格式'
            }
          ]}
          hasFeedback
        >
          <Input placeholder={t('请输入邮箱')} allowClear />
        </Form.Item>

        <Form.Item
          name="role"
          label={t('请选择角色')}
          rules={[
            {
              required: true,
              message: t('请选择角色')
            }
          ]}
        >
          <Select
            showSearch
            allowClear
            style={{ width: '100%' }}
            placeholder="请选择角色"
            optionFilterProp="children"
            filterOption={(input, option) =>
              (String(option?.children) ?? '').toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {roleMap.length &&
              roleMap.map((item: any) => {
                return (
                  <Select.Option value={item.value} key={item.value}>
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
