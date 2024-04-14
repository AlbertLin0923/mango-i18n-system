import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { Helmet as ReactHelmetAsync } from 'react-helmet-async'

import { getFullRoutePath } from '@/router'
import { useAppStore } from '@/store'

const Helmet: FC = () => {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const { systemTitle } = useAppStore((state) => state.publicSystemSetting)

  const pageTitle = useMemo(() => {
    const items = getFullRoutePath(pathname, true).reverse()
    return `${t(items?.[items.length - 1]?.label)} - ${
      systemTitle ? t(systemTitle) : t('自动国际化文案配置系统')
    }`
  }, [systemTitle, pathname, t])

  return (
    <ReactHelmetAsync>
      <title>{pageTitle}</title>
      <meta content={pageTitle} property="og:title" />
    </ReactHelmetAsync>
  )
}

export default Helmet
