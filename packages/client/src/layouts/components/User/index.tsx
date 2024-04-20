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
    <div className="w-[400px] ">
      <div className="flex w-full items-center justify-between p-4">
        <div className="flex items-center pl-4">
          <Avatar icon={<UserOutlined />} />
          <div className="ml-2">{username}</div>
        </div>

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
      <Row className="pb-4">
        {actionList.map((i) => {
          return (
            <Col
              className="hover:text-primary flex h-20 cursor-pointer flex-col items-center justify-center"
              key={i.text}
              span={8}
              onClick={i.action}
            >
              <div className="text-base">{i.icon}</div>
              <div>{i.text}</div>
            </Col>
          )
        })}
      </Row>
    </div>
  )
}

const User: FC = () => {
  const [popoverVisible, setPopoverVisible] = useState<boolean>(false)
  const handleOpenChange = (open: boolean) => {
    setPopoverVisible(open)
  }
  return (
    <Popover
      content={<UserPanel onClose={() => handleOpenChange(false)} />}
      open={popoverVisible}
      overlayClassName={'popover-container'}
      onOpenChange={handleOpenChange}
    >
      <div className="flex h-16 w-20 cursor-pointer items-center justify-center hover:bg-zinc-100">
        <Avatar className="bg-primary" icon={<UserOutlined />} />
      </div>
    </Popover>
  )
}

export default User
