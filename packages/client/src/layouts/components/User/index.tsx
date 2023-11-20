import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { App, Avatar, Popover, Row, Col, Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  UserOutlined,
  SettingOutlined,
  PoweroffOutlined,
  ProfileOutlined,
  MailOutlined,
} from '@ant-design/icons'

import styles from './index.module.scss'

import type { RootState, Dispatch } from '@/store/index'

const UserPanel: FC<{ onClose: () => void }> = ({ onClose }) => {
  const {
    user: { username },
  } = useSelector((state: RootState) => state.userModel.userInfo)
  const dispatch = useDispatch<Dispatch>()
  const { t } = useTranslation()
  const { modal, message } = App.useApp()
  const navigate = useNavigate()

  const actionList = [
    {
      icon: <ProfileOutlined />,
      text: t('文案配置'),
      action: () => {
        onClose()
        navigate('/locale')
      },
    },
    {
      icon: <MailOutlined />,
      text: t('人员配置'),
      action: () => {
        onClose()
        navigate('/system/account')
      },
    },
    {
      icon: <SettingOutlined />,
      text: t('解析配置'),
      action: () => {
        onClose()
        navigate('/system/extract')
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
                    const { success, msg } = await dispatch.userModel.logout()
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
