import cx from 'classnames'

const Component: FC<
  PropsWithChildren<{
    title?: string
    className?: string
    border?: boolean
  }>
> = ({ title, className, children, border = true }) => {
  return (
    <div
      className={cx('relative mb-4 rounded-md bg-white p-4 shadow', className)}
    >
      {title && (
        <div className="z-5 absolute left-5 top-2 bg-white px-1 py-0 text-xs">
          {title}
        </div>
      )}
      {border ? (
        <div className="border border-solid border-zinc-200 px-6 pt-6">
          {children}
        </div>
      ) : (
        children
      )}
    </div>
  )
}

export default Component
