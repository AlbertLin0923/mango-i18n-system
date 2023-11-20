import { useState, useEffect } from 'react'
import { message } from 'antd'

import * as API from '@/services/locale'

export type LocaleDictWithLabelType = {
  label: string
  value: string
}[]

export type DictType = {
  localeDictWithLabel: LocaleDictWithLabelType
}

const initialMap: DictType = {
  localeDictWithLabel: [],
}

const getDictFromBackend = async (): Promise<DictType> => {
  const resp = await API.getDict()
  if (resp && resp.success && resp.data) {
    const localeDictWithLabel = resp.data

    const result = {
      localeDictWithLabel,
    }

    return result
  } else {
    message.error(resp?.err_msg)
    return { localeDictWithLabel: [] }
  }
}

const useDict = (): [DictType, boolean, () => Promise<void>] => {
  const [dict, setDict] = useState(initialMap)

  const [dictAlready, setDictAlready] = useState<boolean>(false)

  const updateDict = async () => {
    const result = await getDictFromBackend()
    if (result) {
      setDict((dict) => ({
        ...dict,
        ...result,
      }))
    }
  }

  const update = async () => {
    updateDict()
  }

  const reFresh = async () => {
    setDictAlready(false)
    update()
  }

  useEffect(() => {
    update()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (
      dict &&
      dict['localeDictWithLabel'] &&
      dict['localeDictWithLabel'].length > 0
    ) {
      setDictAlready(true)
    }
  }, [dict])

  return [dict, dictAlready, reFresh]
}

export default useDict
