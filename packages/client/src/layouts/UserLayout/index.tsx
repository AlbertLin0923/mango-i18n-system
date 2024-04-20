import { Outlet } from 'react-router-dom'
import { SvgIcon } from '@mango-kit/components'
import { useTranslation } from 'react-i18next'

import SelectLang from '@/components/SelectLang'
import { useAppStore } from '@/store'

import Helmet from '../components/Helmet'
import Footer from '../components/Footer'

const User: FC = () => {
  const { t } = useTranslation()
  const { systemTitle } = useAppStore((state) => state.publicSystemSetting)

  return (
    <>
      <Helmet />
      <div className="flex h-screen w-screen flex-col overflow-hidden bg-[#f8fafd]">
        <div className="flex h-16 w-screen items-center justify-between border border-solid border-zinc-200 bg-white px-12 py-0">
          <div className="flex cursor-pointer items-center">
            {systemTitle ? (
              systemTitle
            ) : (
              <SvgIcon
                className="mr-4 block h-[30px] w-[200px]"
                iconClass="logo"
              />
            )}
          </div>
          <div>
            <SelectLang />
          </div>
        </div>

        <div className="flex h-full w-full items-center justify-center">
          <div className="flex h-[400px] w-[400px] flex-col items-center">
            <h2 className="text-2xl font-bold">
              {systemTitle ? t(systemTitle) : t('自动国际化文案配置系统')}
            </h2>
            <Outlet />
          </div>
        </div>

        <Footer />
      </div>
    </>
  )
}

export default User
