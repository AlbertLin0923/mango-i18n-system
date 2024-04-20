import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { EditOutlined, UserOutlined } from '@ant-design/icons'
import { Button, App, Avatar, Typography, Card, Row, Col } from 'antd'
import md5 from 'md5'
import { getLabel } from '@mango-kit/utils'

import { roleMap } from '@/dict/user'
import { useUserStore } from '@/store'

import ChangeEmailForm from './components/ChangeEmailForm'
import ChangePasswordForm from './components/ChangePasswordForm'

import type { ChangeEmailFormHandle } from './components/ChangeEmailForm'
import type { ChangePasswordFormHandle } from './components/ChangePasswordForm'

const { Paragraph } = Typography

const Page: FC = () => {
  const {
    userInfo: { username, role, email, userId },
    getUserInfo,
    updateMyUserInfo,
    updateMyPassword,
  } = useUserStore()
  const { t } = useTranslation()
  const { message, modal } = App.useApp()

  const changeEmailFormRef = useRef<ChangeEmailFormHandle>(null)
  const changePasswordFormRef = useRef<ChangePasswordFormHandle>(null)

  const handleChangeEmail = () => {
    modal.confirm({
      title: t('修改邮箱'),
      centered: true,
      icon: null,
      width: 600,
      content: <ChangeEmailForm email={email} ref={changeEmailFormRef} />,
      onCancel: async () => {
        return Promise.resolve()
      },
      onOk: async () => {
        if (changeEmailFormRef.current) {
          const [error, values] = await changeEmailFormRef.current.getValues()
          if (!error) {
            const { success, msg } = await updateMyUserInfo({
              email: values.email,
            })
            if (success) {
              message.success(msg)
              await getUserInfo()
              return Promise.resolve()
            } else {
              return Promise.reject()
            }
          }
          return Promise.reject()
        }
      },
    })
  }

  const handleChangePassword = () => {
    modal.confirm({
      title: t('修改密码'),
      centered: true,
      icon: null,
      width: 600,
      content: <ChangePasswordForm ref={changePasswordFormRef} />,
      onOk: async () => {
        if (changePasswordFormRef?.current) {
          const [error, values] =
            await changePasswordFormRef.current.getValues()
          if (!error) {
            const { oldPassword, password } = values
            const { success, msg } = await updateMyPassword({
              oldPassword: md5(oldPassword),
              password: md5(password),
            })
            if (success) {
              message.success(msg)
              await getUserInfo()
              return Promise.resolve()
            } else {
              return Promise.reject()
            }
          } else {
            return Promise.reject()
          }
        }
      },
    })
  }

  return (
    <div className="page-container">
      <Card title={t('个人信息')}>
        <div className="flex">
          <Avatar
            className="mr-10 flex h-20 w-20 flex-none items-center justify-center rounded-full"
            icon={<UserOutlined className="icon" />}
            size={84}
          />
          <div className="flex-auto">
            <Row className="h-2/4">
              <Col className="flex items-center" span={12}>
                <div className="font-bold">{t('用户名：')}</div>
                <div className="flex items-center">
                  <Paragraph
                    className="text-zinc-400"
                    ellipsis={{ rows: 1, tooltip: username }}
                    style={{ marginBottom: 0 }}
                  >
                    {username}
                  </Paragraph>
                </div>
              </Col>
              <Col className="flex items-center" span={12}>
                <div className="font-bold">{t('用户角色：')}</div>
                <div className="text-zinc-400">{getLabel(role, roleMap)}</div>
              </Col>
            </Row>
            <Row className="h-2/4">
              <Col className="flex items-center" span={12}>
                <div className="font-bold">{t('邮箱：')}</div>
                <div className="flex items-center">
                  <Paragraph
                    className="text-zinc-400"
                    ellipsis={{ rows: 1, tooltip: email }}
                    style={{ marginBottom: 0 }}
                  >
                    {email}
                  </Paragraph>

                  <Button
                    icon={<EditOutlined />}
                    type="link"
                    onClick={handleChangeEmail}
                  >
                    {t('点击修改')}
                  </Button>
                </div>
              </Col>
              <Col className="flex items-center" span={12}>
                <div className="font-bold">{t('用户编号：')}</div>
                <div className="text-zinc-400">{userId}</div>
              </Col>
            </Row>
          </div>
        </div>
      </Card>
      <Card className="mt-6" title={t('安全设置')}>
        <div>
          <div className="mb-10 flex">
            <div className="w-100 flex items-center">
              <div className="font-bold">{t('登录密码：')}</div>
              <div className="text-zinc-400">
                {t(
                  '定期更换登录密码会让您的账号更加安全，设置密码必须由8-20位的字母、数字或符号组成',
                )}
                <Button
                  icon={<EditOutlined />}
                  type="link"
                  onClick={handleChangePassword}
                >
                  {t('修改密码')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default Page
