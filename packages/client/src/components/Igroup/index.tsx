import './style.module.scss'

const Igroup: FC<
  PropsWithChildren<{
    title: string
  }>
> = ({ title, children }) => {
  return (
    <div className="wrapper">
      <div className="content">{children}</div>
      <div className="title">{title}</div>
    </div>
  )
}

export default Igroup
