import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { Helmet as ReactHelmetAsync } from 'react-helmet-async'

import { getFullRoutePath } from '@/router'

const Helmet: FC = () => {
  const { t } = useTranslation()
  const location = useLocation()
  const { pathname } = location

  const pageTitle = useMemo(() => {
    const items = getFullRoutePath(pathname, true).reverse()
    return `${t(items?.[items.length - 1]?.label)} - ${t(
      '自动国际化文案配置系统',
    )}`
  }, [pathname, t])

  return (
    <ReactHelmetAsync>
      <title>{pageTitle}</title>
      <meta content={pageTitle} property="og:title" />
    </ReactHelmetAsync>
  )
}

export default Helmet
