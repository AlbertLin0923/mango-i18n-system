import { useState } from 'react'
import { App, Avatar, Popover, Row, Col, Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  UserOutlined,
  BarsOutlined,
  PoweroffOutlined,
  TranslationOutlined,
} from '@ant-design/icons'

import { useUserStore } from '@/store'

import styles from './index.module.scss'

const UserPanel: FC<{ onClose: () => void }> = ({ onClose }) => {
  const {
    userInfo: { username },
    logout,
  } = useUserStore()
  const { t } = useTranslation()
  const { modal, message } = App.useApp()
  const navigate = useNavigate()

  const actionList = [
    {
      icon: <TranslationOutlined />,
      text: t('文案配置'),
      action: () => {
        onClose()
        navigate('/locale')
      },
    },
    {
      icon: <BarsOutlined />,
      text: t('操作记录'),
      action: () => {
        onClose()
        navigate('/record')
      },
    },
    {
      icon: <UserOutlined />,
      text: t('账户设置'),
      action: () => {
        onClose()
        navigate('/account')
      },
    },
  ]

  return (
    <div className={styles['card-container']}>
      <div>
        <div className={styles['card-header']}>
          <div className="user-info">
            <Avatar className={styles['avatar']} icon={<UserOutlined />} />
            <div className={styles['phone']}>{username}</div>
          </div>

          <div className={styles['logout']}>
            <Button
              icon={<PoweroffOutlined />}
              type="link"
              onClick={() => {
                onClose()
                modal.confirm({
                  title: t('退出登录'),
                  content: t('确定要退出登录吗？'),
                  onOk: async () => {
                    const { success, msg } = await logout()
                    if (success) {
                      message.success(msg)
                      navigate('/user/login')
                    }
                  },
                  onCancel() {},
                })
              }}
            >
              {t('退出登录')}
            </Button>
          </div>
        </div>
        <Row className={styles['card-content']}>
          {actionList.map((i) => {
            return (
              <Col
                className={styles['action-item']}
                key={i.text}
                span={8}
                onClick={i.action}
              >
                <div className={styles['action-icon']}>{i.icon}</div>
                <div className={styles['action-text']}>{i.text}</div>
              </Col>
            )
          })}
        </Row>
      </div>
    </div>
  )
}

const User: FC = () => {
  const [popoverVisible, setPopoverVisible] = useState<boolean>(false)
  const handleOpenChange = (open: boolean) => {
    setPopoverVisible(open)
  }
  return (
    <>
      <Popover
        content={<UserPanel onClose={() => handleOpenChange(false)} />}
        open={popoverVisible}
        overlayClassName={styles['popover-container']}
        onOpenChange={handleOpenChange}
      >
        <div className={styles['user-container']}>
          <Avatar className={styles['user-avatar']} icon={<UserOutlined />} />
        </div>
      </Popover>
    </>
  )
}

export default User
