/* eslint-disable @typescript-eslint/ban-types */
declare type FC<P = {}> = React.FunctionComponent<P>

declare type PropsWithChildren<P = unknown> = P & {
  children?: ReactNode | undefined
}

declare type ReactNode =
  | string
  | number
  | boolean
  | ReactElement<any, string | JSXElementConstructor<any>>
  | Iterable<ReactNode>
  | ReactPortal
  | null
  | undefined
