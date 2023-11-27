import { useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { EditOutlined, UserOutlined } from '@ant-design/icons'
import { Button, App, Avatar, Typography, Card } from 'antd'
import md5 from 'md5'
import { getLabel } from '@mango-kit/utils'

import { roleMap } from '@/dict/user'

import ChangeEmailForm from './components/ChangeEmailForm'
import ChangePasswordForm from './components/ChangePasswordForm'
import './index.module.scss'

import type { RootState, Dispatch } from '@/store'
import type { ChangeEmailFormHandle } from './components/ChangeEmailForm'
import type { ChangePasswordFormHandle } from './components/ChangePasswordForm'

const { Paragraph } = Typography

const Page: FC = () => {
  const { username, role, email, userId } = useSelector(
    (state: RootState) => state.userModel.userInfo,
  )

  const dispatch = useDispatch<Dispatch>()
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
            const { success, msg } = await dispatch.userModel.updateMyUserInfo({
              email: values.email,
            })
            if (success) {
              message.success(msg)
              await dispatch.userModel.getUserInfo()
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
            const { success, msg } = await dispatch.userModel.updateMyPassword({
              oldPassword: md5(oldPassword),
              password: md5(password),
            })
            if (success) {
              message.success(msg)
              await dispatch.userModel.getUserInfo()
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
        <div className="user-setting">
          <Avatar
            className="avatar"
            icon={<UserOutlined className="icon" />}
            size={84}
          />

          <div className="content">
            <div className="line">
              <div className="item">
                <div className="label">{t('用户名：')}</div>
                <div className="value">
                  <Paragraph
                    className="text"
                    ellipsis={{ rows: 1, tooltip: username }}
                  >
                    {username}
                  </Paragraph>
                </div>
              </div>
              <div className="item">
                <div className="label">{t('用户角色：')}</div>
                <div className="value">{getLabel(role, roleMap)}</div>
              </div>
            </div>
            <div className="line">
              <div className="item">
                <div className="label">{t('邮箱：')}</div>
                <div className="value">
                  <Paragraph
                    className="text"
                    ellipsis={{ rows: 1, tooltip: email }}
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
              </div>
              <div className="item">
                <div className="label">{t('用户编号：')}</div>
                <div className="value">{userId}</div>
              </div>
            </div>
          </div>
        </div>
      </Card>
      <Card className="bottom-card" title={t('安全设置')}>
        <div className="safe-setting">
          <div className="line">
            <div className="item">
              <div className="label">{t('登录密码：')}</div>
              <div className="value">
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
