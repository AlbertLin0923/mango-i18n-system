import React from 'react'
import { Select, Checkbox } from 'antd'
import { useControllableValue } from 'ahooks'

const { Option } = Select

export type SelectCheckboxProps = React.PropsWithChildren<{
  localeDictWithLabel: Array<any>
  value?: Array<any>
  onChange?: (checked: boolean, type: string) => void
}>

const SelectCheckbox: React.FC<SelectCheckboxProps> = (props) => {
  const { localeDictWithLabel } = props

  const [state, setState] = useControllableValue<[boolean, string]>(props)

  const [_checked, _type] = state

  const handleCheckboxChange = (checked: boolean) => {
    setState([checked, _type])
  }

  const handleSelectChange = (type: string) => {
    setState([_checked, type])
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Checkbox
        checked={_checked}
        style={{ marginRight: 10 }}
        onChange={(e) => handleCheckboxChange(e.target.checked)}
      ></Checkbox>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span>只显示未翻译</span>
        <Select
          value={_type}
          style={{ minWidth: '150px' }}
          bordered={false}
          onChange={handleSelectChange}
        >
          {localeDictWithLabel.map((item: any) => {
            return (
              <Option value={item.value} key={item.value}>
                {item.label}
              </Option>
            )
          })}
        </Select>
        <span>的字段</span>
      </div>
    </div>
  )
}

export default SelectCheckbox
