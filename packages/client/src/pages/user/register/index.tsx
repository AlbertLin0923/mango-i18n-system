import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Form, Input, Button, App } from 'antd'
import { MangoFormPassword } from '@mango-kit/components'

import { getRedirect, MangoRegExp } from '@/utils'

import '../index.module.scss'
import FormMessage from '../components/FormMessage'

import type { RootState, Dispatch } from '@/store'

const Register: FC = () => {
  const loading = useSelector(
    (state: RootState) => state.loading.effects.userModel.register,
  )
  const dispatch = useDispatch<Dispatch>()
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const { message } = App.useApp()
  const navigate = useNavigate()
  const [formMessage, setFormMessage] = useState<string>('')

  const handleSubmit = async () => {
    const { username, password, email, invitationCode } =
      form.getFieldsValue(true)
    setFormMessage('')
    const { success, msg } = await dispatch.userModel.register({
      username,
      password,
      email,
      invitationCode,
    })
    if (success) {
      message.success(msg)
      navigate(getRedirect() || '/locale', { replace: true })
    } else {
      setFormMessage(msg)
    }
  }

  return (
    <div className="page-container">
      <h3 className="form-title">{t('注册')}</h3>
      <div className="form-container">
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
            <Button
              className="control-btn"
              htmlType="submit"
              loading={loading}
              type="primary"
              block
            >
              {t('注册')}
            </Button>
          </Form.Item>

          <Form.Item>
            <div className="form-item-other">
              <Button
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
