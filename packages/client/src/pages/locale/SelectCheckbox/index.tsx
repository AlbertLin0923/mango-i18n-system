import { Select, Checkbox } from 'antd'
import { useControllableValue } from 'ahooks'

export type SelectCheckboxProps = PropsWithChildren<{
  localeDictWithLabel: any[]
  value?: any[]
  onChange?: (checked: boolean, type: string) => void
}>

const SelectCheckbox: FC<SelectCheckboxProps> = (props) => {
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
      />

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span>只显示未翻译</span>
        <Select
          bordered={false}
          style={{ minWidth: '150px' }}
          value={_type}
          onChange={handleSelectChange}
        >
          {localeDictWithLabel.map((item: any) => {
            return (
              <Select.Option key={item.value} value={item.value}>
                {item.label}
              </Select.Option>
            )
          })}
        </Select>
        <span>的字段</span>
      </div>
    </div>
  )
}

export default SelectCheckbox
