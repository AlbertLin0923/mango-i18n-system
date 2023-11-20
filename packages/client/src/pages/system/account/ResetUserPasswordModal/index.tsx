import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Form, Modal, App } from 'antd'
import md5 from 'md5'
import { MangoFormPassword } from '@mango-kit/components'

import * as API from '@/services/user'

export type ResetUserPasswordModalProps = React.PropsWithChildren<{
  open: boolean
  data: any
  onResetTableList: () => void
  onClose: () => void
}>

const ResetUserPasswordModal: React.FC<ResetUserPasswordModalProps> = ({
  open,
  data,
  onResetTableList,
  onClose,
}) => {
  const { message } = App.useApp()
  const [form] = Form.useForm()
  const { t } = useTranslation()

  const [submitLoading, setSubmitLoading] = useState<boolean>(false)

  const handleFormSubmit = () => {
    form.validateFields().then((values) => {
      resetUserPassword(values)
    })
  }

  const resetUserPassword = async ({ password }: any) => {
    setSubmitLoading(true)

    const result = await API.updateOtherPassword({
      userId: data.userId,
      password: md5(password.trim()),
    })
    setSubmitLoading(false)

    if (result?.success) {
      message.success(t('重置用户密码成功'))
      onResetTableList()
      onClose()
    }
  }

  useEffect(() => {
    open && form && form.setFieldsValue({ username: data.username })
  }, [open, data, form])

  return (
    <Modal
      confirmLoading={submitLoading}
      open={open}
      title={t('重置用户密码')}
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
        <Form.Item label={t('用户名')} shouldUpdate>
          {() => {
            return form.getFieldValue('username') || '--'
          }}
        </Form.Item>

        <MangoFormPassword />
      </Form>
    </Modal>
  )
}

export default ResetUserPasswordModal
