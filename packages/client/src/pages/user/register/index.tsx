import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Form, Input, Button, App } from 'antd'
import { MangoFormPassword } from '@mango-kit/components'
import md5 from 'md5'
import { useRequest } from 'ahooks'

import { useUserStore } from '@/store'
import { getRedirect, MangoRegExp } from '@/utils'

import FormMessage from '../components/FormMessage'

const Register: FC = () => {
  const { register } = useUserStore()
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const { message } = App.useApp()
  const navigate = useNavigate()
  const [formMessage, setFormMessage] = useState<string>('')

  const { loading, run } = useRequest(
    async ({ username, password, email, invitationCode }) =>
      await register({
        username,
        password: md5(password),
        email,
        invitationCode,
      }),
    {
      manual: true,
      onBefore: () => {
        setFormMessage('')
      },
      onSuccess: ({ success, msg }) => {
        if (success) {
          message.success(msg)
          navigate(getRedirect() || '/locale', { replace: true })
        } else {
          setFormMessage(msg)
        }
      },
    },
  )

  const handleSubmit = async () => {
    run(form.getFieldsValue(true))
  }

  return (
    <div className="w-full">
      <h3 className="my-6 text-center text-xl font-medium text-zinc-800">
        {t('注册')}
      </h3>
      <div>
        {formMessage && !loading && <FormMessage content={formMessage} />}

        <Form
          autoComplete="off"
          form={form}
          size="large"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="username"
            normalize={(value: any) => {
              return value.trim()
            }}
            rules={[
              {
                required: true,
                message: t('请输入账号'),
              },
            ]}
          >
            <Input maxLength={20} placeholder={t('请输入账号')} />
          </Form.Item>

          <MangoFormPassword />

          <Form.Item
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
            <Input placeholder={t('请输入邮箱')} />
          </Form.Item>

          <Form.Item
            name="invitationCode"
            normalize={(value: any) => {
              return value.trim()
            }}
            rules={[
              {
                required: true,
                message: t('请输入邀请码'),
              },
            ]}
          >
            <Input maxLength={50} placeholder={t('请输入邀请码')} />
          </Form.Item>

          <Form.Item>
            <Button htmlType="submit" loading={loading} type="primary" block>
              {t('注册')}
            </Button>
          </Form.Item>

          <Form.Item>
            <div className="flex w-full items-center justify-center">
              <Button
                size="small"
                type="link"
                onClick={() => {
                  navigate('/user/login')
                }}
              >
                {t('使用已有账号登录')}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default Register
