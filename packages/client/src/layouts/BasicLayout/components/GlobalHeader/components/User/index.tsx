import { useState } from 'react'
import { connect } from 'react-redux'
import { HomeOutlined, LogoutOutlined, LockOutlined } from '@ant-design/icons'
import { Modal, Dropdown, Menu, Avatar, Space } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { UserOutlined } from '@ant-design/icons'

import ChangePasswordModal from '../ChangePasswordModal/index'

import { RootState, Dispatch } from '@/store/index'

const mapState = (state: RootState) => ({
  username: state.userModel.userInfo.username
})

const mapDispatch = (dispatch: Dispatch) => ({
  logout: () => dispatch.userModel.logout()
})

const User: React.FC<{
  username: string
  logout: () => Promise<void>
}> = ({ username, logout }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [changePasswordModalConfig, setChangePasswordModalConfig] = useState<{
    visible: boolean
  }>({
    visible: false
  })

  const menu = (
    <Menu
      items={[
        { label: t('首页'), key: 'home', icon: <HomeOutlined /> },
        { label: t('登出'), key: 'logout', icon: <LogoutOutlined /> },
        { label: t('修改密码'), key: 'changePassword', icon: <LockOutlined /> }
      ]}
      onClick={({ key, keyPath, domEvent }) => {
        if (key === 'home') {
          navigate('/home')
        } else if (key === 'logout') {
          Modal.confirm({
            title: t('操作确认'),
            content: t('确定要登出吗？'),
            onOk: async () => {
              await logout()
              navigate('/login')
            },
            onCancel() {}
          })
        } else if (key === 'changePassword') {
          setChangePasswordModalConfig(() => ({ visible: true }))
        }
      }}
    ></Menu>
  )
  return (
    <>
      <Dropdown overlay={menu} placement="bottomRight" trigger={['click', 'hover']}>
        <Space>
          <Avatar style={{ backgroundColor: '#519fe8' }} icon={<UserOutlined />} />
          <span>{username.trim() ?? 'Unknown'}</span>
        </Space>
      </Dropdown>
      <ChangePasswordModal
        {...changePasswordModalConfig}
        onClose={() => setChangePasswordModalConfig((v) => ({ ...v, visible: false }))}
      ></ChangePasswordModal>
    </>
  )
}

export default connect(mapState, mapDispatch)(User)
