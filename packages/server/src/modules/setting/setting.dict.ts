export const localeDictMap = [
  {
    fileName: 'zh-CN',
    cnName: '简体中文',
    alias: ['zh-CN', 'zh_CN', 'zh'],
  },
  {
    fileName: 'en-US',
    cnName: '英语',
    alias: ['en-US', 'en_US', 'en'],
  },
  {
    fileName: 'id-ID',
    cnName: '印度尼西亚语',
    alias: ['id-ID', 'id_ID', 'in_ID', 'id'],
  },
  {
    fileName: 'vi-VN',
    cnName: '越南语',
    alias: ['vi-VN', 'vi_VN', 'vi', 'vn'],
  },
  {
    fileName: 'ms-MY',
    cnName: '马来语',
    alias: ['ms-MY', 'ms_MY', 'my', 'ms'],
  },
  {
    fileName: 'es-ES',
    cnName: '西班牙语',
    alias: ['es-ES', 'es_ES'],
  },
  {
    fileName: 'fr-FR',
    cnName: '法语-法国',
    alias: ['fr-FR', 'fr_FR'],
  },
  {
    fileName: 'fr-BE',
    cnName: '法语-比利时',
    alias: ['fr-BE', 'fr_BE'],
  },
  {
    fileName: 'it-IT',
    cnName: '意大利语',
    alias: ['it-IT', 'it_IT'],
  },
  {
    fileName: 'pl-PL',
    cnName: '波兰语',
    alias: ['pl-PL', 'pl_PL'],
  },
  {
    fileName: 'de-DE',
    cnName: '德语',
    alias: ['de-DE', 'de_DE'],
  },
  { fileName: 'da-DK', cnName: '丹麦语', alias: ['da-DK', 'da_DK'] },
  { fileName: 'nl-NL', cnName: '荷兰语', alias: ['nl-NL', 'nl_NL'] },
  { fileName: 'fi-FI', cnName: '芬兰语', alias: ['fi-FI', 'fi_FI'] },
  { fileName: 'el-GR', cnName: '希腊语', alias: ['el-GR', 'el_GR'] },
  { fileName: 'hu-HU', cnName: '匈牙利语', alias: ['hu-HU', 'hu_HU'] },
  { fileName: 'is-IS', cnName: '冰岛语', alias: ['is-IS', 'is_IS'] },
  { fileName: 'ja-JP', cnName: '日语', alias: ['ja-JP', 'ja_JP'] },
  { fileName: 'ko-KR', cnName: '韩语', alias: ['ko-KR', 'ko_KR'] },
  { fileName: 'pt-PT', cnName: '葡萄牙语', alias: ['pt-PT', 'pt_PT'] },
  { fileName: 'sv-SE', cnName: '瑞典语', alias: ['sv-SE', 'sv_SE'] },
  { fileName: 'th-TH', cnName: '泰语', alias: ['th-TH', 'th_TH'] },
].map((i) => {
  return { label: `${i.fileName} (${i.cnName})`, value: i.fileName }
})

export const filterExtNameMap = [
  { label: '.vue', value: '.vue' },
  { label: '.js', value: '.js' },
  { label: '.mjs', value: '.mjs' },
  { label: '.jsx', value: '.jsx' },
  { label: '.ts', value: '.ts' },
  { label: '.mts', value: '.mts' },
  { label: '.tsx', value: '.tsx' },
  { label: '.svelte', value: '.svelte' },
]

export const extractorMap = [
  { label: 'regex', value: 'regex' },
  { label: 'ast', value: 'ast' },
]
