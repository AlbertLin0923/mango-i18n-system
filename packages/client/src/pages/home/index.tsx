import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import './index.module.scss'

import type { RootState } from '@/store'

const Page: FC = (props) => {
  const { t } = useTranslation()

  const username = useSelector(
    (state: RootState) => state.userModel.userInfo.username,
  )

  const hello = () => {
    const int = new Date().getHours()
    if (int >= 5 && int < 10) {
      return `${t('早上好')}!`
    } else if (int >= 10 && int < 14) {
      return `${t('中午好')}!`
    } else if (int >= 14 && int < 19) {
      return `${t('下午好')}!`
    } else if (int >= 19 && int < 23) {
      return `${t('晚上好')}!`
    } else {
      return `${t('夜深了,要注意休息哦')}~`
    }
  }

  return (
    <div className="page-container">
      <p className="welcome">
        <span>Hi </span>
        <label className="username" htmlFor="">
          {username}
        </label>
        <span>{hello()}</span>
      </p>
    </div>
  )
}

export default Page
