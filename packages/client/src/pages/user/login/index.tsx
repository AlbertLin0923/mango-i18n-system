import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Form, Input, Button, App } from 'antd'
import md5 from 'md5'

import { getRedirect } from '@/utils'

import FormMessage from '../components/FormMessage'
import '../index.module.scss'

import type { RootState, Dispatch } from '@/store'

const AccountLogin: FC = () => {
  const loading = useSelector(
    (state: RootState) => state.loading.effects.userModel.login,
  )
  const dispatch = useDispatch<Dispatch>()
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const { message } = App.useApp()
  const [formMessage, setFormMessage] = useState<string>('')

  const handleSubmit = async () => {
    const { username, password } = await form.validateFields()

    setFormMessage('')

    const { success, msg } = await dispatch.userModel.login({
      username,
      password: md5(password),
    })

    if (success) {
      message.success(msg)
      navigate(getRedirect() || '/locale', { replace: true })
    } else {
      setFormMessage(msg)
    }
  }

  return (
    <div className="form-container">
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
            className="control-btn"
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
          <div className="form-item-other">
            <div>
              <span className="form-text">{t('还没有账号，')}</span>
              <Button
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
    <div className="page-container">
      <h3 className="form-title">{t('登录')}</h3>
      <AccountLogin />
    </div>
  )
}

export default Login
