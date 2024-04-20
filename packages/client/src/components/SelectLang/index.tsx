import { Dropdown, App } from 'antd'
import { TranslationOutlined } from '@ant-design/icons'

import { localeDict } from '@/locales'
import { useAppStore } from '@/store'

import type { MenuProps } from 'antd'

const SelectLang: FC = () => {
  const { language, changeLanguage } = useAppStore()
  const { message } = App.useApp()

  const onClick: MenuProps['onClick'] = async ({ key }) => {
    const { success, msg } = await changeLanguage(key)
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
      menu={{
        items: localeDict.map((i) => ({
          key: i.fileName,
          label: (
            <div className="flex items-center">
              <i.countryFlagIcons className="mr-1 block h-4 w-6" />
              <div className="ml-2">{i.name}</div>
            </div>
          ),
        })),
        onClick,
      }}
      placement="bottomRight"
      trigger={['click', 'hover']}
    >
      <div className="text-primary flex h-16 w-20 cursor-pointer items-center justify-center text-2xl hover:bg-zinc-100">
        <TranslationOutlined />
      </div>
    </Dropdown>
  )
}

export default SelectLang
