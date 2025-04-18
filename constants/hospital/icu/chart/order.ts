// 불필요
// export const DEFAULT_ICU_ORDER_NAME = [
//   {
//     orderName: '체온(T)',
//     orderComment: '직장체온',
//   },
//   {
//     orderName: '심박수(P)',
//     orderComment: '분당 심박수',
//     dataType: 'checklist',
//   },
//   {
//     orderName: '호흡수(R)',
//     orderComment: '①기침 ②맑은콧물 ③화농성콧물',
//     dataType: 'checklist',
//   },
//   {
//     orderName: '혈압(BP)',
//     orderComment: '도플러 혈압계',
//     dataType: 'checklist',
//   },
//   {
//     orderName: '활력',
//     orderComment: '①양호 ②저하 ③불량',
//     dataType: 'checklist',
//   },
//   {
//     orderName: '구토',
//     orderComment: '①위액 ②음식물 ③혈액 ④거품 ⑤기타',
//     dataType: 'checklist',
//   },
//   {
//     orderName: '배변',
//     orderComment: '①정상 ②약간무름 ③무름 ④설사 ⑤혈액 ⑥점액',
//     dataType: 'checklist',
//   },
//   {
//     orderName: '배뇨',
//     orderComment: '①정상뇨 ②옅은뇨 ③진한뇨 ④혈뇨',
//     dataType: 'checklist',
//   },
//   {
//     orderName: '수액',
//     orderComment: 'N/S',
//     dataType: 'fluid',
//   },
//   {
//     orderName: '라인확인',
//     orderComment: '라인설치일',
//     dataType: 'fluid',
//   },
//   {
//     orderName: 'Cefazoline 30mg/kg IV TID',
//     orderComment: '2ml/dog',
//     dataType: 'injection',
//   },
//   {
//     orderName: 'Famotidine 0.5mg/kg IV BID',
//     orderComment: '1ml/dog',
//     dataType: 'injection',
//   },
//   {
//     orderName: '사료',
//     orderComment: '①모두먹음 ②절반 ③안먹음',
//     dataType: 'feed',
//   },
// ] as const

export const CHECKLIST_ORDERS = [
  '체온(T)',
  '심박수(P)',
  '호흡수(R)',
  '혈압(BP)',
  '체중(BW)',
  '활력',
  '구토',
  '배변',
  '배뇨',
  'SPO2',
  '혈당',
] as const

export const DEFAULT_ICU_ORDER_TYPE = [
  {
    label: '체크리스트',
    value: 'checklist',
  },
  {
    label: '수액',
    value: 'fluid',
  },
  {
    label: '주사',
    value: 'injection',
  },
  {
    label: '경구',
    value: 'po',
  },
  {
    label: '검사',
    value: 'test',
  },
  {
    label: '식이',
    value: 'feed',
  },
  {
    label: '기타',
    value: 'manual',
  },

] as const

export const DEFAULT_ICU_ORDER_TYPE_DIC = {
  checklist: '체크리스트',
  fluid: '수액',
  injection: '주사',
  po: '경구',
  test: '검사',
  manual: '기타',
  feed: '식이',
} as const

export const CHECKLIST_ORDER_CANDIDATES = [
  '체온',
  '체온(T)',
  '심박수',
  '심박수(P)',
  '호흡수',
  '호흡수(R)',
  '혈압',
  '혈압(BP)',
  '활력',
  '활기',
  '구토',
  '배변',
  '배뇨',
  '체중',
  '몸무게',
  'SPO2',
  'spo2',
  '대변',
  '소변',
  '혈당',
  'bg',
  'blood glucose',
  '간이혈당',
  'bw',
  't',
  'p',
  'r',
  'bp',
  '도플러',
  '간이혈당',
  '간이 혈당',
] as const

export const DESKTOP_WIDTH_SEQUENCE = [300, 400, 500, 600] as const
export const MOBILE_WIDTH_SEQUENCE = [200, 300] as const

export type OrderType = (typeof DEFAULT_ICU_ORDER_TYPE)[number]['value']
