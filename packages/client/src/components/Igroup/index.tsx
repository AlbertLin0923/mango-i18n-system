const Igroup: FC<
  PropsWithChildren<{
    title: string
  }>
> = ({ title, children }) => {
  return (
    <div className="relative mb-6 rounded-md bg-white p-4">
      <div className="border border-solid border-zinc-200 px-5 pt-5">
        {children}
      </div>
      <div className="z-5 absolute left-5 top-2 bg-white px-1 py-0 text-xs">
        {title}
      </div>
    </div>
  )
}

export default Igroup
