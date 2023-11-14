import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useMount } from 'ahooks'
import { App } from 'antd'

export const useQuery = (queryList?: string[]) => {
  const { message } = App.useApp()
  const [params] = useSearchParams()
  const { t } = useTranslation()

  const p: Record<string, string> = {}
  params.forEach((value, key) => {
    p[key] = value
  })

  useMount(() => {
    if (queryList?.find((query: string) => !p[query])) {
      message.error(t('参数错误'))
    }
  })

  return p
}

export const useStepNav = ({ scrollElement }: { scrollElement: string }) => {
  const [scrollY, setScrollY] = useState<number>(0)
  const [formSectionDomHeightList, setFormSectionDomHeightList] = useState<
    number[]
  >([])

  const initScroll = (e: any) => {
    const scrollTop = e.target.scrollTop
    setScrollY(scrollTop)
  }

  useMount(() => {
    const scrollDom = document.querySelector(scrollElement)
    scrollDom?.addEventListener('scroll', initScroll, false)

    return () => {
      scrollDom?.removeEventListener('scroll', initScroll, false)
    }
  })

  useEffect(() => {
    const formSectionDomList = document.querySelectorAll('.ant-card')
    const arr: number[] = [0]
    let height = 0
    for (let i = 0; i < formSectionDomList.length; i++) {
      height = height + formSectionDomList[i].clientHeight
      arr.push(height)
    }

    setFormSectionDomHeightList(() => arr)
  }, [])

  const currentIndex = useMemo(() => {
    for (let i = 0; i < formSectionDomHeightList.length; i++) {
      const left = formSectionDomHeightList[i]
      const right = formSectionDomHeightList[i + 1]
      if (!right || (scrollY >= left && scrollY < right)) {
        return i
      }
    }
    return 0
  }, [formSectionDomHeightList, scrollY])

  return [currentIndex]
}
