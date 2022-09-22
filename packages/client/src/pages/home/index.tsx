import * as React from 'react'
import { connect } from 'react-redux'
import { RootState } from '@/store/index'

import { useTranslation } from 'react-i18next'
import styles from './home.module.less'

const mapState = (state: RootState) => ({
  username: state.userModel.userInfo.username
})

type StateProps = ReturnType<typeof mapState>

type Props = StateProps

const Home: React.FC<Props> = (props) => {
  const { t } = useTranslation()
  const { username } = props

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
    <div className={styles.container}>
      <p className={styles.welcome}>
        <span>Hi </span>
        <label htmlFor="" className={styles.username}>
          {username}
        </label>
        <span>{hello()}</span>
      </p>
    </div>
  )
}

export default connect(mapState)(Home)
