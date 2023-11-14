//  与 URL 相关的工具函数
export const getRedirect = (): string => {
  const urlParams = new URL(window.location.href)
  let redirect = ''
  if (urlParams?.searchParams?.get('redirect')) {
    redirect = urlParams.searchParams.get('redirect') as string
    const redirectUrlParams = new URL(redirect)
    if (redirectUrlParams.origin === urlParams.origin) {
      redirect = redirect.substring(urlParams.origin.length)
      if (redirect.match(/^\/.*#/)) {
        redirect = redirect.substring(redirect.indexOf('#') + 1)
      }
    }
  }
  return redirect
}
