import { useSelector, useDispatch } from 'react-redux'
import { Dropdown, App } from 'antd'
import { TranslationOutlined } from '@ant-design/icons'

import { localeDict } from '@/locales/index'

import styles from './style.module.scss'

import type { MenuProps } from 'antd'
import type { RootState, Dispatch } from '@/store/index'

const SelectLang: FC = () => {
  const language = useSelector((state: RootState) => state.appModel.language)
  const dispatch = useDispatch<Dispatch>()

  const { message } = App.useApp()

  const items: MenuProps['items'] = localeDict.map((i) => ({
    key: i.fileName,
    label: (
      <div className={styles['item-wrapper']}>
        <div className={styles['icon']}>
          <i.countryFlagIcons className={styles['country-flag-icons']} />
        </div>
        <div className={styles['text']}>{i.name}</div>
      </div>
    ),
  }))

  const onClick: MenuProps['onClick'] = async ({ key }) => {
    const { success, msg } = await dispatch.appModel.changeLanguage(key)
    if (success) {
      message.success(msg)
    } else {
      message.error(msg)
    }
  }

  if (!language) {
    return null
  }
  return (
    <Dropdown
      menu={{ items, onClick }}
      placement="bottomRight"
      trigger={['click', 'hover']}
    >
      <div className={styles['icon-btn-wrapper']}>
        <TranslationOutlined className={styles['select-language-icon']} />
      </div>
    </Dropdown>
  )
}

export default SelectLang
