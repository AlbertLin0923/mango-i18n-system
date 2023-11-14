import { Outlet } from 'react-router-dom'
import { SvgIcon } from '@mango-kit/components'
import { useTranslation } from 'react-i18next'

import SelectLang from '@/components/SelectLang'

import './index.module.scss'

import Helmet from '../components/Helmet'

const User: FC = () => {
  const { t } = useTranslation()
  return (
    <>
      <Helmet />
      <div className="layout-container">
        <div className="layout-header">
          <div className="logo-wrapper">
            <SvgIcon className="logo" iconClass="logo" />
            <div className="text">mango-i18n-system</div>
          </div>
          <div className="select-lang-wrapper">
            <SelectLang />
          </div>
        </div>

        <div className="layout-wrapper">
          <div className="layout-content">
            <h2 className="title">{t('自动国际化文案配置系统')}</h2>
            <Outlet />
          </div>
        </div>

        <div className="layout-footer">
          <div className="copyright-info">
            Open-source MIT Licensed | Copyright © 2022-present
          </div>
        </div>
      </div>
    </>
  )
}

export default User