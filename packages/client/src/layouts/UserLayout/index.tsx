import { useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'
import { SvgIcon } from '@mango-kit/components'
import { useTranslation } from 'react-i18next'

import SelectLang from '@/components/SelectLang'

import './index.module.scss'

import Helmet from '../components/Helmet'

import type { RootState } from '@/store'

const User: FC = () => {
  const { t } = useTranslation()

  const {
    publicSystemSetting: { systemTitle },
  } = useSelector((state: RootState) => state.appModel)
  return (
    <>
      <Helmet />
      <div className="layout-container">
        <div className="layout-header">
          <div className="logo-wrapper">
            {systemTitle ? (
              systemTitle
            ) : (
              <SvgIcon className="logo" iconClass="logo" />
            )}
          </div>
          <div className="select-lang-wrapper">
            <SelectLang />
          </div>
        </div>

        <div className="layout-wrapper">
          <div className="layout-content">
            <h2 className="title">{t(systemTitle)}</h2>
            <Outlet />
          </div>
        </div>

        <div className="layout-footer">
          <div className="copyright-info">
            Open-source MIT Licensed | Copyright © 2022-present AlbertLin
          </div>
        </div>
      </div>
    </>
  )
}

export default User
