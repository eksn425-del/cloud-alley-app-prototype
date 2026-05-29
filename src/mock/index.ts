import type {
  ActiveDeliveryOrder,
  Announcement,
  BalconyCard,
  BalconyFacades,
  Bill,
  CarbonStats,
  CommunityCard,
  CurrentUser,
  DeliveryCard,
  DeliveryPreference,
  HistoryOrder,
  HomeHero,
  HomeSiteMap,
  IrrigationConfig,
  NeighborThread,
  Plant,
  PriorityCard,
  RouteStep,
  SharedSpace,
} from '../types'

export const currentUser: CurrentUser = {
  id: 'user_001',
  name: '李先生',
  avatar: '',
  buildingCode: 'N3',
  floor: 22,
  roomNumber: '2206',
  unitType: '120㎡',
  primaryFacade: 'ENE',
  communityName: '云端坊巷',
  greeting: '下午好，欢迎回到云端坊巷',
}

export const homeHero: HomeHero = {
  weatherTemp: 26,
  weatherCondition: '多云',
  windDirection: 'ENE',
  windSpeed: 3.1,
  systemStatus: '今日低空配送正常',
  heroHint: '高层航线运行平稳，您的社区正在正常接驳',
}

export const homePriorityCard: PriorityCard = {
  priorityType: 'delivery',
  title: '您有 1 份外卖预计 4 分钟到达',
  subtitle: '当前位于 54m 楼间空中通道',
  ctaText: '查看驿路',
  targetTab: 'delivery',
}

export const homeDeliveryCard: DeliveryCard = {
  orderId: 'UAV-20260414-021',
  orderType: '外卖',
  orderTitle: '轻食套餐',
  orderCode: 'UAV-20260414-021',
  currentNode: '54m 空中通道',
  nextNode: 'N3 楼顶转运站',
  etaMinutes: 4,
  progressPercent: 68,
  pathPreview: '西侧发货站 -> 地面基站A -> 54m空中通道 -> N3楼顶转运站',
  ctaText: '进入配送页',
}

export const homeBalconyCard: BalconyCard = {
  facade: 'ENE',
  windPressureLevel: '偏高',
  suggestion: '建议延后浇水',
  humidity: 43,
  depthM: 0.76,
  ctaText: '查看我的庭院',
}

export const homeCommunityCard: CommunityCard = {
  messageType: 'maintenance',
  title: '明日屋顶转运站 10:00-12:00 例行维护',
  subtitle: '高层配送将切换备用路线，社区收件功能正常',
  ctaText: '进入社区',
}

export const homeSiteMap: HomeSiteMap = {
  highlightBuilding: 'N3',
  highlightNode: '54m 通道',
  highlightZone: '中心庭院',
}

export const activeDeliveryOrder: ActiveDeliveryOrder = {
  orderId: 'UAV-20260414-021',
  orderType: '外卖',
  orderTitle: '轻食套餐',
  orderCode: 'UAV-20260414-021',
  statusLabel: '当前在途',
  etaText: '预计送达 04:12',
  deliveryMode: '立体物流网络接驳',
  receiveMode: '门口代收',
}

export const deliveryRouteSteps: RouteStep[] = [
  {
    id: 's1',
    label: '小区外发货站',
    heightLabel: '外部',
    status: 'done',
    description: '包裹已完成起飞准备',
  },
  {
    id: 's2',
    label: '地面基站A',
    heightLabel: '0m',
    status: 'done',
    description: '已进入社区接驳网络',
  },
  {
    id: 's3',
    label: '54m 建筑停靠层',
    heightLabel: '54m',
    status: 'active',
    description: '当前位于楼间空中通道',
  },
  {
    id: 's4',
    label: 'N3 楼顶转运站',
    heightLabel: '96m',
    status: 'upcoming',
    description: '即将切换高层配送段',
  },
  {
    id: 's5',
    label: '垂直下降',
    heightLabel: '22F',
    status: 'upcoming',
    description: '接近目标楼层',
  },
  {
    id: 's6',
    label: '机器人末端配送',
    heightLabel: '走廊',
    status: 'upcoming',
    description: '将送达门口或代收点',
  },
  {
    id: 's7',
    label: '已送达',
    heightLabel: '完成',
    status: 'upcoming',
    description: '用户可前往签收',
  },
]

export const deliveryNodeCard = {
  currentStatusTitle: '已进入 54m 楼间空中通道',
  currentStatusDesc: '包裹正通过社区立体物流网络向 N3 楼顶转运站移动。',
  nextStatusHint: '预计 2 分钟后进入垂直下降阶段。',
}

export const deliveryPreference: DeliveryPreference = {
  receiveOptions: ['阳台接驳', '门口代收', '需本人确认'],
  selectedReceiveOption: '门口代收',
}

export const deliveryHistory: HistoryOrder[] = [
  {
    id: 'h1',
    type: '快递',
    title: '建筑模型材料',
    date: '04-12 16:20',
    status: '已送达',
    finalNode: 'N3 楼顶转运站',
    receiveMode: '门口代收',
  },
  {
    id: 'h2',
    type: '外卖',
    title: '咖啡与贝果',
    date: '04-11 09:10',
    status: '已送达',
    finalNode: '机器人接驳',
    receiveMode: '本人确认',
  },
]

export const balconyFacades: BalconyFacades = {
  SSE: {
    bearingDeg: 150,
    depthM: 1.16,
    windPressurePa: 5.2,
    windPressureLevel: '中风压区',
    windSpeed: 2.8,
    temperature: 26,
    humidity: 46,
    lightKlx: 21,
    adviceTitle: '适合短时通风',
    adviceDesc: '主立面风压适中，建议保持当前灌溉设置。',
    plantHint: '适合悬垂和观花类植物。',
    statusTone: 'mid',
  },
  NNW: {
    bearingDeg: 330,
    depthM: 1.67,
    windPressurePa: 2.9,
    windPressureLevel: '低风压区',
    windSpeed: 1.6,
    temperature: 25,
    humidity: 51,
    lightKlx: 12,
    adviceTitle: '适合补光与轻灌溉',
    adviceDesc: '当前通风平稳，适宜保持植物湿润。',
    plantHint: '更适合耐阴和保湿型植物。',
    statusTone: 'low',
  },
  ENE: {
    bearingDeg: 60,
    depthM: 0.76,
    windPressurePa: 6.6,
    windPressureLevel: '高风压区',
    windSpeed: 3.1,
    temperature: 26,
    humidity: 43,
    lightKlx: 18,
    adviceTitle: '建议延后浇水',
    adviceDesc: '受东北季风影响，外侧百叶已自动收合。',
    plantHint: '适合观叶植物，不建议高杆类摆放。',
    statusTone: 'high',
  },
  WSW: {
    bearingDeg: 240,
    depthM: 1.41,
    windPressurePa: 4.1,
    windPressureLevel: '中低风压区',
    windSpeed: 2.2,
    temperature: 27,
    humidity: 47,
    lightKlx: 16,
    adviceTitle: '适合维持当前养护',
    adviceDesc: '环境稳定，可继续自动灌溉。',
    plantHint: '适合耐热类与混合种植。',
    statusTone: 'mid',
  },
}

export const balconyIrrigation: IrrigationConfig = {
  mode: '自动',
  nextIrrigationTime: '18:30',
  monthlyWaterL: 12.4,
  lastManualIrrigation: '今天 07:40',
}

export const balconyPlants: Plant[] = [
  { name: '绿萝', status: '良好', hint: '当前长势稳定。' },
  { name: '香草', status: '需补水', hint: '建议晚间少量补水。' },
  { name: '蕨类', status: '注意风压', hint: '高风压时建议内移。' },
]

export const communityBill: Bill = {
  month: '2026-04',
  propertyFee: 320,
  uavServiceFee: 25,
  parkingFee: 0,
  totalFee: 345,
  dueDate: '2026-04-25',
  billStatus: '待支付',
  note: '无车化社区',
}

export const communityAnnouncements: Announcement[] = [
  {
    id: 'a1',
    tag: '设施',
    title: '明日屋顶转运站检修',
    summary: '10:00-12:00 期间高层配送将切换备用路线。',
    time: '今天 18:00',
    isRead: false,
  },
  {
    id: 'a2',
    tag: '活动',
    title: '共享庭院周末开放报名',
    summary: '本周六 19:00 进行邻里放映活动。',
    time: '今天 14:30',
    isRead: false,
  },
  {
    id: 'a3',
    tag: '步道',
    title: '中心水岸步道夜间灯光维护',
    summary: '维护期间南侧步道临时限行。',
    time: '昨天 20:15',
    isRead: true,
  },
]

export const neighborhoodThreads: NeighborThread[] = [
  {
    id: 't1',
    userName: '2203住户',
    content: '今晚共享庭院放映有人一起去吗？',
    time: '5分钟前',
    repliesCount: 3,
  },
  {
    id: 't2',
    userName: 'N3物业',
    content: '明日屋顶转运站检修，请留意高层配送时段变化。',
    time: '20分钟前',
    repliesCount: 1,
  },
]

export const sharedSpaces: SharedSpace[] = [
  {
    id: 'sp1',
    name: '共享庭院',
    status: '可预约',
    nextAvailable: '今天 19:00',
    ctaText: '查看时段',
  },
  {
    id: 'sp2',
    name: '水岸步道活动区',
    status: '维护中',
    nextAvailable: '明天 09:00',
    ctaText: '查看说明',
  },
  {
    id: 'sp3',
    name: '架空层会客区',
    status: '开放中',
    nextAvailable: '当前可用',
    ctaText: '立即进入',
  },
]

export const carbonStats: CarbonStats = {
  carFreeKg: 1.4,
  uavKg: 0.8,
  balconyPlantKg: 0.6,
  totalKg: 2.8,
}
