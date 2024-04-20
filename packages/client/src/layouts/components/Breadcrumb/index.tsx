import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Breadcrumb as AntBreadcrumb } from 'antd'
import cx from 'classnames'

import { getFullRoutePath } from '@/router'

export type BreadcrumbProps = {
  items?: { label: string; path: string }[]
  className?: string
  beforeGoBack?: () => Promise<boolean>
}

const Breadcrumb: FC<BreadcrumbProps> = ({
  items = [],
  className,
  beforeGoBack,
}) => {
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const { pathname, search } = location

  const autoGenerateItems = useMemo(
    () => getFullRoutePath(pathname, true).reverse(),
    [pathname],
  )

  const generateTitle = (
    _autoGenerateItems: {
      path: string
      label: string
    }[],
    { path, label, icon }: { path: string; label: string; icon?: ReactNode },
    index: number,
  ) => {
    if (index === _autoGenerateItems.length - 1) {
      return (
        <Link className="current" to={`${path}${search}`}>
          {icon} {t(label)}
        </Link>
      )
    } else {
      return (
        <span>
          {icon} {t(label)}
        </span>
      )
    }
  }

  const breadcrumbItems =
    items?.length > 0
      ? items.map((item, index) => ({
          key: item.path,
          title: generateTitle(items, item, index),
        }))
      : autoGenerateItems?.length > 1
        ? autoGenerateItems.map((item, index) => ({
            key: item.path,
            title: generateTitle(autoGenerateItems, item, index),
          }))
        : []

  return (
    <div className={cx('flex items-center px-0 py-2', className)}>
      <AntBreadcrumb className="breadcrumb" items={breadcrumbItems} />
      {breadcrumbItems.length > 2 ? (
        <span
          className="text-primary cursor-pointe ml-4"
          onClick={async () => {
            if (beforeGoBack) {
              const r = await beforeGoBack()
              if (r) {
                navigate(
                  breadcrumbItems[breadcrumbItems.length - 2]?.key as string,
                )
              }
            } else {
              navigate(
                breadcrumbItems[breadcrumbItems.length - 2]?.key as string,
              )
            }
          }}
        >
          {t('返回上一级')}
        </span>
      ) : null}
    </div>
  )
}

export default Breadcrumb
