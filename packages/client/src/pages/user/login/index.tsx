import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Form, Input, Button, App } from 'antd'
import { useRequest } from 'ahooks'
import md5 from 'md5'

import { useUserStore } from '@/store'
import { getRedirect } from '@/utils'

import FormMessage from '../components/FormMessage'

const AccountLogin: FC = () => {
  const { login } = useUserStore()
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const { message } = App.useApp()
  const [formMessage, setFormMessage] = useState<string>('')

  const { loading, run } = useRequest(
    async ({ username, password }) =>
      await login({
        username,
        password: md5(password),
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
    run(await form.validateFields())
  }

  return (
    <div>
      {formMessage && !loading && <FormMessage content={formMessage} />}
      <Form form={form} size="large">
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

        <Form.Item
          name="password"
          normalize={(value: any) => {
            return value.trim()
          }}
          rules={[
            {
              required: true,
              message: t('请输入密码'),
            },
          ]}
        >
          <Input.Password maxLength={20} placeholder={t('请输入密码')} />
        </Form.Item>

        <Form.Item>
          <Button
            htmlType="submit"
            loading={loading}
            type="primary"
            block
            onClick={handleSubmit}
          >
            {t('登录')}
          </Button>
        </Form.Item>

        <Form.Item>
          <div className="flex w-full items-center justify-center">
            <div>
              <span className="text-sm">{t('还没有账号，')}</span>
              <Button
                size="small"
                type="link"
                onClick={() => {
                  navigate('/user/register')
                }}
              >
                {t('立即注册')}
              </Button>
            </div>
          </div>
        </Form.Item>
      </Form>
    </div>
  )
}

const Login: FC = () => {
  const { t } = useTranslation()
  return (
    <div className="w-full">
      <h3 className="my-6 text-center text-xl font-medium text-zinc-800">
        {t('登录')}
      </h3>
      <AccountLogin />
    </div>
  )
}

export default Login
