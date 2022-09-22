import React, { useState } from 'react'
import { connect } from 'react-redux'
import { useTranslation } from 'react-i18next'

import md5 from 'md5'
import { Form, Modal, Input } from 'antd'

import { UpdateMyPasswordParamsType } from '@/services/user'
import { RootState, Dispatch } from '@/store/index'

const mapState = (state: RootState) => ({
  userModel: state.userModel
})

const mapDispatch = (dispatch: Dispatch) => ({
  changePassword: (v: UpdateMyPasswordParamsType) => dispatch.userModel.changePassword(v)
})

type StateProps = ReturnType<typeof mapState>
type DispatchProps = ReturnType<typeof mapDispatch>

export type ChangePasswordModalProps = React.PropsWithChildren<{
  visible: boolean
  onClose: () => void
}>

type Props = ChangePasswordModalProps & StateProps & DispatchProps

const ChangePasswordModal: React.FC<Props> = (props) => {
  const { visible, onClose, changePassword } = props

  const [form] = Form.useForm()
  const { t } = useTranslation()

  const passwordRule = [
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
      validator: (_: any, value: any) => {
        if (value && !String(value).trim()) return Promise.reject(new Error(t('请输入密码')))
        return Promise.resolve()
      }
    }
  ]

  const [submitLoading, setSubmitLoading] = useState<boolean>(false)

  const handleFormSubmit = () => {
    form.validateFields().then((values) => {
      setSubmitLoading(true)
      const { oldPassword, password } = values
      const delivery = {
        oldPassword: md5(oldPassword.trim()),
        password: md5(password.trim())
      }
      changePassword(delivery)
      setSubmitLoading(false)
    })
  }

  return (
    <Modal
      title={t('修改密码')}
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
        <Form.Item name="oldPassword" label={t('原密码')} rules={passwordRule} hasFeedback>
          <Input.Password placeholder={t('请输入原密码')} />
        </Form.Item>

        <Form.Item name="password" label={t('新密码')} rules={passwordRule} hasFeedback>
          <Input.Password placeholder={t('请输入新密码')} />
        </Form.Item>

        <Form.Item
          name="repeatPassword"
          label={t('确认密码')}
          rules={[
            ...passwordRule,
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

export default connect(mapState, mapDispatch)(ChangePasswordModal)
