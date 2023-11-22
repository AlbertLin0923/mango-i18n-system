import { forwardRef, useImperativeHandle } from 'react'
import { useTranslation } from 'react-i18next'
import { Form, Input } from 'antd'

import { MangoRegExp } from '@/utils'

import './index.module.scss'

export type ChangeEmailFormProps = {
  email: string
}

export type ChangeEmailFormHandle = {
  getValues: () => Promise<[any, any]>
}

const ChangeEmailForm = forwardRef<ChangeEmailFormHandle, ChangeEmailFormProps>(
  ({ email }, ref) => {
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
            initialValue={email}
            label={t('邮箱')}
            name="email"
            normalize={(value: any) => {
              return value.trim()
            }}
            rules={[
              {
                required: true,
                message: t('请输入邮箱'),
              },
              () => ({
                validator(_, value) {
                  if (!value) {
                    return Promise.resolve()
                  }

                  if (!MangoRegExp.isEmail(value)) {
                    return Promise.reject(new Error(t('请输入正确的邮箱')))
                  } else {
                    return Promise.resolve()
                  }
                },
              }),
            ]}
          >
            <Input
              maxLength={50}
              placeholder={t('请输入邮箱')}
              allowClear
              showCount
            />
          </Form.Item>
        </Form>
      </div>
    )
  },
)

export default ChangeEmailForm
