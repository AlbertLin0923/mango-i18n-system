import React from 'react'
import styles from './style.module.less'

type IgroupProps = React.PropsWithChildren<{
  title: string
}>

const Igroup: React.FC<IgroupProps> = (props) => {
  const { title, children } = props

  return (
    <div className={styles['wrapper']}>
      <div className={styles['content']}>{children}</div>
      <div className={styles['title']}>{title}</div>
    </div>
  )
}

export default Igroup
