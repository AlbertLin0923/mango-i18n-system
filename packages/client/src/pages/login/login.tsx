import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import classNames from 'classnames/bind'
import md5 from 'md5'
import { Alert, Form, Input, Button } from 'antd'
import { LockOutlined, UserOutlined } from '@ant-design/icons'

import SelectLang from '@/components/SelectLang/index'

import { RootState, Dispatch } from '@/store/index'
import { LoginParamsType } from '@/services/user'

import styles from './login.module.less'

const cx = classNames.bind(styles)

const mapState = (state: RootState) => ({
  loading: state.loading.effects.userModel.login,
  systemTitle: state.appModel.systemTitle
})

const mapDispatch = (dispatch: Dispatch) => ({
  getSystemTitle: () => dispatch.appModel.getSystemTitle(),
  login: (value: LoginParamsType) => dispatch.userModel.login(value)
})

type StateProps = ReturnType<typeof mapState>
type DispatchProps = ReturnType<typeof mapDispatch>

type Props = StateProps & DispatchProps

const LoginMessage: React.FC<{
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

const Login: React.FC<Props> = ({ loading, systemTitle, getSystemTitle, login }) => {
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const [easeStatus, setEaseStatus] = useState<boolean>(false)
  const [loginMessage, setLoginMessage] = useState<string>('')

  const handleSubmit = async (values: LoginParamsType) => {
    try {
      const { username, password } = values

      const delivery = {
        username: username.trim(),
        password: md5(password.trim())
      }
      const result: string = await login(delivery)
      setLoginMessage(result)

      // 重定向
      const urlParams = new URL(window.location.href)
      let redirect: string = ''

      if (urlParams?.searchParams?.get('redirect')) {
        redirect = urlParams.searchParams.get('redirect') as string
        const redirectUrlParams = new URL(redirect)
        if (redirectUrlParams.origin === urlParams.origin) {
          redirect = redirect.substring(urlParams.origin.length)
          if (redirect.match(/^\/.*#/)) {
            redirect = redirect.substring(redirect.indexOf('#') + 1)
          }
        } else {
          window.location.href = redirect
          return
        }
      }

      navigate(redirect || '/home', { replace: true })
    } catch (msg) {
      setLoginMessage((msg as string) ?? '')
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
        <title>{t('登录')}</title>
      </Helmet>
      <div className={styles['page-container']}>
        <div className={styles['select-lang-wrapper']}>
          <SelectLang />
        </div>
        <div className={styles['login-form-wrapper']}>
          <div className={cx({ ease: easeStatus }, 'logo')}>
            <img
              src={require('@/assets/images/logo.svg')?.default}
              className={styles.img}
              alt={systemTitle}
            />
          </div>
          <h3 className={styles.title}>{systemTitle}</h3>
          <div className={styles.form}>
            {loginMessage && !loading && <LoginMessage content={loginMessage} />}
            <Form autoComplete="off" form={form} onFinish={handleSubmit}>
              <Form.Item
                name="username"
                rules={[
                  {
                    required: true,
                    message: t('请输入用户名')
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
                  className="login-input-item"
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
                  }
                ]}
                hasFeedback
              >
                <Input.Password
                  prefix={<LockOutlined className={styles['prefix-icon']} />}
                  className="login-input-item"
                  size="large"
                  placeholder={t('密码')}
                />
              </Form.Item>

              <Form.Item>
                <Button
                  size="large"
                  className="login-control-btn"
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                >
                  {t('登录')}
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </HelmetProvider>
  )
}

export default connect(mapState, mapDispatch)(Login)
