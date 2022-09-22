import React from 'react'
import { connect } from 'react-redux'
import { Dropdown, Menu } from 'antd'
import { TranslationOutlined } from '@ant-design/icons'
import { localeDict } from '@/locales/index'

import { RootState, Dispatch } from '@/store/index'

import styles from './style.module.less'

const mapState = (state: RootState) => ({
  userModel: state.userModel,
  appModel: state.appModel
})

const mapDispatch = (dispatch: Dispatch) => ({
  changeLanguage: (value: string) => dispatch.appModel.changeLanguage(value)
})

type StateProps = ReturnType<typeof mapState>
type DispatchProps = ReturnType<typeof mapDispatch>

type Props = StateProps & DispatchProps

const SelectLang: React.FC<Props> = ({ appModel: { selectedLanguage }, changeLanguage }) => {
  const langMenu = (
    <Menu
      className={styles.menu}
      selectedKeys={[selectedLanguage]}
      onClick={({ key }) => {
        changeLanguage(key)
      }}
      items={localeDict.map((i) => {
        return {
          key: i.fileName,
          label: i.name,
          icon: (
            <div className={styles.icon} aria-label={i.name}>
              <i.countryFlagIcons className={styles['country-flag-icons']}></i.countryFlagIcons>
            </div>
          )
        }
      })}
    ></Menu>
  )

  if (!selectedLanguage) {
    return null
  }
  return (
    <Dropdown overlay={langMenu} placement="bottomRight" trigger={['click', 'hover']}>
      <div className={styles['select-lng']}>
        <TranslationOutlined />
      </div>
    </Dropdown>
  )
}

export default connect(mapState, mapDispatch)(SelectLang)
