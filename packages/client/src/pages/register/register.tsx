import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import classNames from 'classnames/bind'
import md5 from 'md5'
import { Alert, Form, Input, Button } from 'antd'
import { LockOutlined, UserOutlined, MailOutlined, KeyOutlined } from '@ant-design/icons'

import SelectLang from '@/components/SelectLang/index'

import { RootState, Dispatch } from '@/store/index'
import { RegisterParamsType } from '@/services/user'

import styles from './register.module.less'

const cx = classNames.bind(styles)

const mapState = (state: RootState) => ({
  userModel: state.userModel,
  loading: state.loading.effects.userModel.register,
  systemTitle: state.appModel.systemTitle
})

const mapDispatch = (dispatch: Dispatch) => ({
  getSystemTitle: () => dispatch.appModel.getSystemTitle(),
  register: (value: RegisterParamsType) => dispatch.userModel.register(value)
})

type StateProps = ReturnType<typeof mapState>
type DispatchProps = ReturnType<typeof mapDispatch>

type Props = StateProps & DispatchProps

const RegisterMessage: React.FC<{
  content: string
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24
    }}
    message={content}
    type="error"
    showIcon
  />
)

const Register: React.FC<Props> = ({ loading, systemTitle, getSystemTitle, register }) => {
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const [easeStatus, setEaseStatus] = useState<boolean>(false)
  const [registerMessage, setRegisterMessage] = useState<string>('')

  const handleSubmit = async (values: RegisterParamsType) => {
    try {
      const { username, password, email, key } = values
      const delivery = {
        username: username.trim(),
        password: md5(password.trim()),
        email: email.trim(),
        key: key.trim()
      }
      const result: string = await register(delivery)
      setRegisterMessage(result)

      const urlParams = new URL(window.location.href).searchParams
      navigate(urlParams.get('redirect') || '/home', { replace: true })
    } catch (msg) {
      setRegisterMessage((msg as string) ?? '')
    }
  }

  useEffect(() => {
    getSystemTitle()
    setTimeout(() => {
      setEaseStatus(true)
    }, 300)

    return () => {
      setEaseStatus(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <HelmetProvider>
      <Helmet>
        <title>{t('注册')}</title>
      </Helmet>
      <div className={styles['page-container']}>
        <div className={styles['select-lang-wrapper']}>
          <SelectLang />
        </div>
        <div className={styles['register-form-wrapper']}>
          <div className={cx({ ease: easeStatus }, 'logo')}>
            <img
              src={require('@/assets/images/logo.svg')?.default}
              className={styles.img}
              alt={systemTitle}
            />
          </div>
          <h3 className={styles.title}>{systemTitle}</h3>
          <div className={styles.form}>
            {registerMessage && !loading && <RegisterMessage content={registerMessage} />}
            <Form autoComplete="off" form={form} onFinish={handleSubmit}>
              <Form.Item
                name="username"
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
                  }
                ]}
                hasFeedback
              >
                <Input
                  prefix={
                    <UserOutlined
                      style={{
                        color: '#1890ff'
                      }}
                      className={styles['prefix-icon']}
                    />
                  }
                  className="register-input-item"
                  size="large"
                  placeholder={t('用户名')}
                />
              </Form.Item>

              <Form.Item
                name="password"
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
                  }
                ]}
                hasFeedback
              >
                <Input.Password
                  prefix={<LockOutlined className={styles['prefix-icon']} />}
                  className="register-input-item"
                  size="large"
                  placeholder={t('密码')}
                />
              </Form.Item>

              <Form.Item
                name="repeatPassword"
                rules={[
                  ...[
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
                    }
                  ],
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve()
                      }
                      return Promise.reject(new Error(t('两次输入密码不匹配')))
                    }
                  })
                ]}
                hasFeedback
                dependencies={['password']}
              >
                <Input.Password
                  prefix={<LockOutlined className={styles['prefix-icon']} />}
                  className="register-input-item"
                  size="large"
                  placeholder={t('确认密码')}
                />
              </Form.Item>

              <Form.Item
                name="email"
                rules={[
                  {
                    required: true,
                    message: t('请输入邮箱')
                  },
                  {
                    pattern:
                      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                    message: '请输入正确的邮箱格式'
                  }
                ]}
                hasFeedback
              >
                <Input
                  prefix={<MailOutlined className={styles['prefix-icon']} />}
                  className="register-input-item"
                  size="large"
                  placeholder={t('邮箱')}
                />
              </Form.Item>

              <Form.Item
                name="key"
                rules={[
                  {
                    required: true,
                    message: t('请输入注册密钥')
                  }
                ]}
                hasFeedback
              >
                <Input
                  prefix={<KeyOutlined className={styles['prefix-icon']} />}
                  className="register-input-item"
                  size="large"
                  placeholder={t('密钥')}
                />
              </Form.Item>

              <Form.Item>
                <Button
                  size="large"
                  className="register-control-btn"
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                >
                  {t('注册')}
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </HelmetProvider>
  )
}

export default connect(mapState, mapDispatch)(Register)
