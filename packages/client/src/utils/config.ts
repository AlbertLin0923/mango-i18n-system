export const commonSelectProps = {
  filterOption: (input: string, option?: { label: string; value: string }) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase()),
  optionFilterProp: 'children',
  allowClear: true,
  showSearch: true,
}
