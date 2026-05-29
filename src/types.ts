export type TabKey = 'home' | 'delivery' | 'balcony' | 'community'

export type FacadeKey = 'SSE' | 'NNW' | 'ENE' | 'WSW'
export type FacadeTone = 'high' | 'mid' | 'low'

export interface CurrentUser {
  id: string
  name: string
  avatar: string
  buildingCode: string
  floor: number
  roomNumber: string
  unitType: string
  primaryFacade: FacadeKey
  communityName: string
  greeting: string
}

export interface HomeHero {
  weatherTemp: number
  weatherCondition: string
  windDirection: string
  windSpeed: number
  systemStatus: string
  heroHint: string
}

export interface PriorityCard {
  priorityType: 'delivery' | 'balcony' | 'maintenance'
  title: string
  subtitle: string
  ctaText: string
  targetTab: Exclude<TabKey, 'home'>
}

export interface DeliveryCard {
  orderId: string
  orderType: '外卖' | '快递' | '社区配送'
  orderTitle: string
  orderCode: string
  currentNode: string
  nextNode: string
  etaMinutes: number
  progressPercent: number
  pathPreview: string
  ctaText: string
}

export interface BalconyCard {
  facade: FacadeKey
  windPressureLevel: string
  suggestion: string
  humidity: number
  depthM: number
  ctaText: string
}

export interface CommunityCard {
  messageType: 'maintenance' | 'activity' | 'bill'
  title: string
  subtitle: string
  ctaText: string
}

export interface HomeSiteMap {
  highlightBuilding: string
  highlightNode: string
  highlightZone: string
}

export interface ActiveDeliveryOrder {
  orderId: string
  orderType: '外卖' | '快递' | '社区配送'
  orderTitle: string
  orderCode: string
  statusLabel: string
  etaText: string
  deliveryMode: string
  receiveMode: string
}

export interface RouteStep {
  id: string
  label: string
  heightLabel: string
  status: 'done' | 'active' | 'upcoming'
  description: string
}

export interface DeliveryPreference {
  receiveOptions: string[]
  selectedReceiveOption: string
}

export interface DeliveryNodeCard {
  currentStatusTitle: string
  currentStatusDesc: string
  nextStatusHint: string
}

export interface HistoryOrder {
  id: string
  type: string
  title: string
  date: string
  status: string
  finalNode: string
  receiveMode: string
}

export interface BalconyFacadeData {
  bearingDeg: number
  depthM: number
  windPressurePa: number
  windPressureLevel: string
  windSpeed: number
  temperature: number
  humidity: number
  lightKlx: number
  adviceTitle: string
  adviceDesc: string
  plantHint: string
  statusTone: FacadeTone
}

export type BalconyFacades = Record<FacadeKey, BalconyFacadeData>

export interface IrrigationConfig {
  mode: '自动' | '手动'
  nextIrrigationTime: string
  monthlyWaterL: number
  lastManualIrrigation: string
}

export interface Plant {
  name: string
  status: '良好' | '需补水' | '注意风压'
  hint: string
}

export interface Bill {
  month: string
  propertyFee: number
  uavServiceFee: number
  parkingFee: number
  totalFee: number
  dueDate: string
  billStatus: '待支付' | '已支付'
  note: string
}

export interface Announcement {
  id: string
  tag: '设施' | '活动' | '步道' | '安全'
  title: string
  summary: string
  time: string
  isRead: boolean
}

export interface NeighborThread {
  id: string
  userName: string
  content: string
  time: string
  repliesCount: number
}

export interface SharedSpace {
  id: string
  name: string
  status: '可预约' | '维护中' | '开放中' | '已预约'
  nextAvailable: string
  ctaText: string
}

export interface CarbonStats {
  carFreeKg: number
  uavKg: number
  balconyPlantKg: number
  totalKg: number
}

export interface AppDataSnapshot {
  currentUser: CurrentUser
  homeHero: HomeHero
  homePriorityCard: PriorityCard
  homeDeliveryCard: DeliveryCard
  homeBalconyCard: BalconyCard
  homeCommunityCard: CommunityCard
  homeSiteMap: HomeSiteMap
  activeDeliveryOrder: ActiveDeliveryOrder
  deliveryRouteSteps: RouteStep[]
  deliveryNodeCard: DeliveryNodeCard
  deliveryPreference: DeliveryPreference
  deliveryHistory: HistoryOrder[]
  balconyFacades: BalconyFacades
  balconyIrrigation: IrrigationConfig
  balconyPlants: Plant[]
  communityBill: Bill
  communityAnnouncements: Announcement[]
  neighborhoodThreads: NeighborThread[]
  sharedSpaces: SharedSpace[]
  carbonStats: CarbonStats
}

export interface AppDataRepository {
  getAppData(): Promise<AppDataSnapshot>
  updateReceiveOption(option: string): Promise<string>
  saveAppData(snapshot: AppDataSnapshot): Promise<AppDataSnapshot>
  resetAppData(): Promise<AppDataSnapshot>
}
