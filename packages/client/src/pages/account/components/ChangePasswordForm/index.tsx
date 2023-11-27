import { forwardRef, useImperativeHandle } from 'react'
import { useTranslation } from 'react-i18next'
import { Form, Input } from 'antd'
import { MangoFormPassword } from '@mango-kit/components'

import './index.module.scss'

export type ChangePasswordFormProps = any

export type ChangePasswordFormHandle = {
  getValues: () => Promise<[any, any]>
}

const ChangePasswordForm = forwardRef<
  ChangePasswordFormHandle,
  ChangePasswordFormProps
>((props, ref) => {
  const { t } = useTranslation()
  const [form] = Form.useForm()

  useImperativeHandle(ref, () => ({
    getValues: async () => {
      try {
        const values = await form.validateFields()
        return [null, values]
      } catch (error) {
        return [error, null]
      }
    },
  }))

  return (
    <div className="form-container">
      <Form form={form}>
        <Form.Item
          label={t('原密码')}
          name="oldPassword"
          normalize={(value: any) => {
            return value.trim()
          }}
          rules={[
            {
              required: true,
              message: t('请输入原密码'),
            },
            {
              min: 8,
              message: t('密码最小长度为8'),
            },
            {
              max: 20,
              message: t('密码最大长度为20'),
            },
          ]}
        >
          <Input.Password
            maxLength={20}
            placeholder={t('请输入原密码')}
            allowClear
          />
        </Form.Item>

        <MangoFormPassword label={[t('新密码'), t('确认密码')]} widthLabel />
      </Form>
    </div>
  )
})

export default ChangePasswordForm
