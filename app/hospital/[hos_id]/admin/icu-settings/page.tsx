import IcuSettingsTab from '@/components/hospital/admin/icu-settings/icu-settings-tab'
import {
  getBasicHosData,
  getVetListData,
} from '@/lib/services/icu/get-basic-hos-data'
import { BasicHosDataProvider } from '@/providers/basic-hos-data-context-provider'
import { type IcuOrderColors, type VitalRefRange } from '@/types/adimin'

export default async function AdminIcuSettingsPage(props: {
  params: Promise<{ hos_id: string }>
}) {
  const { hos_id } = await props.params

  const basicHosData = await getBasicHosData(hos_id)
  const vetlistData = await getVetListData(hos_id)

  return (
    <BasicHosDataProvider
      basicHosData={{
        vetsListData: vetlistData,
        groupListData: basicHosData.group_list,
        orderColorsData: basicHosData.order_color as IcuOrderColors,
        memoNameListData: basicHosData.icu_memo_names,
        showOrderer: basicHosData.show_orderer,
        showTxUser: basicHosData.show_tx_user,
        sidebarData: [],
        vitalRefRange: basicHosData.vital_ref_range as VitalRefRange[],
        orderFontSizeData: basicHosData.order_font_size,
        timeGuidelineData: basicHosData.time_guidelines,
        orderColorDisplay: basicHosData.order_color_display,
        plan: basicHosData.plan,
        isInChargeSystem: basicHosData.is_in_charge_system,
        baselineTime: basicHosData.baseline_time,
      }}
    >
      <IcuSettingsTab hosId={hos_id} />
    </BasicHosDataProvider>
  )
}
