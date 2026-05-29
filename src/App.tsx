import { useEffect, useMemo, useState } from 'react'
import './App.css'
import masterplanImage from './assets/masterplan.jpg'
import { defaultAppSnapshot } from './data/defaultSnapshot'
import { appRepository } from './data/repository'
import type {
  Announcement,
  AppDataSnapshot,
  FacadeKey,
  FacadeTone,
  RouteStep,
  SharedSpace,
  TabKey,
} from './types'

function buildHomeBalconyCard(snapshot: AppDataSnapshot, facade: FacadeKey) {
  const facadeData = snapshot.balconyFacades[facade]

  return {
    ...snapshot.homeBalconyCard,
    facade,
    windPressureLevel: facadeData.windPressureLevel,
    suggestion: facadeData.adviceTitle,
    humidity: facadeData.humidity,
    depthM: facadeData.depthM,
  }
}

function formatManualWateringTime() {
  const now = new Date()
  const hour = String(now.getHours()).padStart(2, '0')
  const minute = String(now.getMinutes()).padStart(2, '0')
  return `今天 ${hour}:${minute}`
}

function App() {
  const isEmbedded = typeof window !== 'undefined' && window.self !== window.top
  const [activeTab, setActiveTab] = useState<TabKey>('home')
  const [appData, setAppData] = useState<AppDataSnapshot>(defaultAppSnapshot)
  const [selectedFacade, setSelectedFacade] = useState<FacadeKey>(defaultAppSnapshot.homeBalconyCard.facade)
  const [selectedReceiveOption, setSelectedReceiveOption] = useState(
    defaultAppSnapshot.deliveryPreference.selectedReceiveOption,
  )

  useEffect(() => {
    let active = true

    appRepository.getAppData().then((snapshot) => {
      if (!active) return
      setAppData(snapshot)
      setSelectedFacade(snapshot.homeBalconyCard.facade)
      setSelectedReceiveOption(snapshot.deliveryPreference.selectedReceiveOption)
    })

    return () => {
      active = false
    }
  }, [])

  const syncUiState = (snapshot: AppDataSnapshot) => {
    setSelectedFacade(snapshot.homeBalconyCard.facade)
    setSelectedReceiveOption(snapshot.deliveryPreference.selectedReceiveOption)
  }

  const persistSnapshot = async (snapshot: AppDataSnapshot) => {
    setAppData(snapshot)
    syncUiState(snapshot)

    const savedSnapshot = await appRepository.saveAppData(snapshot)
    setAppData(savedSnapshot)
    syncUiState(savedSnapshot)
  }

  const currentFacade = useMemo(
    () => appData.balconyFacades[selectedFacade],
    [appData.balconyFacades, selectedFacade],
  )

  const handleReceiveOptionChange = async (option: string) => {
    setSelectedReceiveOption(option)
    const savedOption = await appRepository.updateReceiveOption(option)
    setAppData((prev) => ({
      ...prev,
      activeDeliveryOrder: {
        ...prev.activeDeliveryOrder,
        receiveMode: savedOption,
      },
      deliveryPreference: {
        ...prev.deliveryPreference,
        selectedReceiveOption: savedOption,
      },
    }))
  }

  const handleFacadeSelect = async (facade: FacadeKey) => {
    const nextSnapshot = {
      ...appData,
      homeBalconyCard: buildHomeBalconyCard(appData, facade),
    }

    await persistSnapshot(nextSnapshot)
  }

  const handleIrrigationModeChange = async (mode: '自动' | '手动') => {
    const nextSnapshot = {
      ...appData,
      balconyIrrigation: {
        ...appData.balconyIrrigation,
        mode,
      },
    }

    await persistSnapshot(nextSnapshot)
  }

  const handleManualWatering = async () => {
    const nextSnapshot = {
      ...appData,
      balconyIrrigation: {
        ...appData.balconyIrrigation,
        mode: '手动' as const,
        monthlyWaterL: Number((appData.balconyIrrigation.monthlyWaterL + 0.4).toFixed(1)),
        lastManualIrrigation: formatManualWateringTime(),
      },
      balconyPlants: appData.balconyPlants.map((plant) =>
        plant.status === '需补水'
          ? {
              ...plant,
              status: '良好' as const,
              hint: '已完成补水，建议今晚复查盆土湿度。',
            }
          : plant,
      ),
    }

    await persistSnapshot(nextSnapshot)
  }

  const handleBillAction = async () => {
    const isPaid = appData.communityBill.billStatus === '已支付'
    const nextSnapshot = {
      ...appData,
      communityBill: {
        ...appData.communityBill,
        billStatus: isPaid ? ('待支付' as const) : ('已支付' as const),
        note: isPaid ? '无车化社区' : '已完成线上支付',
      },
    }

    await persistSnapshot(nextSnapshot)
  }

  const handleAnnouncementRead = async (announcementId: string) => {
    const nextSnapshot = {
      ...appData,
      communityAnnouncements: appData.communityAnnouncements.map((item) =>
        item.id === announcementId ? { ...item, isRead: true } : item,
      ),
    }

    await persistSnapshot(nextSnapshot)
  }

  const handleSharedSpaceAction = async (spaceId: string) => {
    const nextSnapshot = {
      ...appData,
      sharedSpaces: appData.sharedSpaces.map((space) => {
        if (space.id !== spaceId || space.status === '维护中') return space

        const defaultSpace = defaultAppSnapshot.sharedSpaces.find((item) => item.id === space.id)
        if (space.status === '已预约' && defaultSpace) return { ...defaultSpace }

        if (space.status === '开放中') {
          return {
            ...space,
            status: '已预约' as const,
            nextAvailable: '已加入当前使用',
            ctaText: '取消预约',
          }
        }

        return {
          ...space,
          status: '已预约' as const,
          nextAvailable: `已为您保留 ${space.nextAvailable}`,
          ctaText: '取消预约',
        }
      }),
    }

    await persistSnapshot(nextSnapshot)
  }

  const handleResetDemo = async () => {
    const snapshot = await appRepository.resetAppData()
    setAppData(snapshot)
    syncUiState(snapshot)
  }

  return (
    <div className={`app-shell ${isEmbedded ? 'embedded-mode' : ''}`}>
      <div className={`phone-shell ${isEmbedded ? 'embedded-mode' : ''}`}>
        <PhoneChrome />
        <main className="screen-shell">
          {activeTab === 'home' && (
            <HomeScreen
              data={appData}
              onNavigate={setActiveTab}
              selectedFacade={selectedFacade}
              onResetDemo={handleResetDemo}
            />
          )}
          {activeTab === 'delivery' && (
            <DeliveryScreen
              data={appData}
              selectedReceiveOption={selectedReceiveOption}
              onChangeReceiveOption={handleReceiveOptionChange}
            />
          )}
          {activeTab === 'balcony' && (
            <BalconyScreen
              data={appData}
              selectedFacade={selectedFacade}
              onSelectFacade={handleFacadeSelect}
              currentFacade={currentFacade}
              onChangeIrrigationMode={handleIrrigationModeChange}
              onManualWatering={handleManualWatering}
            />
          )}
          {activeTab === 'community' && (
            <CommunityScreen
              data={appData}
              onToggleBillStatus={handleBillAction}
              onMarkAnnouncementRead={handleAnnouncementRead}
              onToggleSharedSpace={handleSharedSpaceAction}
            />
          )}
        </main>

        <BottomNav activeTab={activeTab} onChange={setActiveTab} />
      </div>
    </div>
  )
}

function PhoneChrome() {
  return (
    <div className="phone-chrome">
      <div className="phone-status-bar">
        <span className="phone-time">9:41</span>
        <div className="phone-status-icons">
          <span className="signal-bars" aria-hidden="true">
            <i></i>
            <i></i>
            <i></i>
            <i></i>
          </span>
          <span className="wifi-icon" aria-hidden="true"></span>
          <span className="battery-icon" aria-hidden="true">
            <b></b>
          </span>
        </div>
      </div>
      <div className="phone-island-safe" aria-hidden="true"></div>
    </div>
  )
}

function HomeScreen({
  data,
  onNavigate,
  selectedFacade,
  onResetDemo,
}: {
  data: AppDataSnapshot
  onNavigate: (tab: TabKey) => void
  selectedFacade: FacadeKey
  onResetDemo: () => void
}) {
  const {
    currentUser,
    homeHero,
    homeSiteMap,
    homeDeliveryCard,
    homeBalconyCard,
    carbonStats,
    homePriorityCard,
    homeCommunityCard,
  } = data

  return (
    <section className="screen-page">
      <div className="home-hero architect-hero">
        <div className="glass-bg"></div>
        <div className="hero-topline">{currentUser.greeting}</div>
        <div className="hero-row">
          <div>
            <h1>{currentUser.communityName}</h1>
            <p>
              {currentUser.buildingCode}栋 {currentUser.floor}层 {currentUser.roomNumber}
              <span className="divider"></span>
              {currentUser.primaryFacade} 主立面
            </p>
          </div>
          <div className="hero-avatar glass-avatar">{currentUser.name.slice(0, 1)}</div>
        </div>
        <div className="hero-weather glass-panel">
          <div className="weather-primary">
            <div className="hero-temp">{homeHero.weatherTemp}°</div>
            <div className="hero-weather-meta">
              {homeHero.weatherCondition} · {homeHero.windDirection}风 {homeHero.windSpeed}m/s
            </div>
          </div>
          <div className="hero-status">
            <span className="chip chip-glass-blue">{homeHero.systemStatus}</span>
            <p>{homeHero.heroHint}</p>
          </div>
        </div>
      </div>

      <div className="content-stack home-stack with-overlap">
        <div className="site-viz-card">
          <SiteMiniMap />
          <div className="site-viz-meta">
            <span>当前楼栋：<strong>{homeSiteMap.highlightBuilding}</strong></span>
            <span className="dot-divider"></span>
            <span>节点：<strong>{homeSiteMap.highlightNode}</strong></span>
            <span className="dot-divider"></span>
            <span>区域：<strong>{homeSiteMap.highlightZone}</strong></span>
          </div>
        </div>

        <div className="home-stat-row">
          <HomeQuickStat
            label="预计到达"
            value={String(homeDeliveryCard.etaMinutes)}
            unit="min"
            subtitle={homeDeliveryCard.currentNode}
            tone="blue"
          />
          <HomeQuickStat
            label="阳台湿度"
            value={String(homeBalconyCard.humidity)}
            unit="%"
            subtitle={homeBalconyCard.suggestion}
            tone="amber"
          />
          <HomeQuickStat
            label="今日碳减排"
            value={carbonStats.totalKg.toFixed(1)}
            unit="kg"
            subtitle="无车化社区"
            tone="green"
          />
        </div>

        <div className="inline-action-bar">
          <div className="card-subtle">当前演示数据会自动保存到本地浏览器。</div>
          <button className="text-action" onClick={onResetDemo}>
            重置演示
          </button>
        </div>

        <div className="priority-banner">
          <div className="priority-banner-icon">!</div>
          <div className="priority-banner-copy">
            <div className="priority-banner-title">{homePriorityCard.title}</div>
            <div className="priority-banner-subtitle">{homePriorityCard.subtitle}</div>
          </div>
          <button className="priority-banner-action" onClick={() => onNavigate(homePriorityCard.targetTab)}>
            {homePriorityCard.ctaText}
          </button>
        </div>

        <CardBase tone="glass">
          <SectionHeader title="立体物流网络" action={{ text: '进入驿站', onClick: () => onNavigate('delivery') }} />
          <div className="card-block">
            <div className="split-row">
              <div className="order-info">
                <div className="card-title">
                  {homeDeliveryCard.orderType} <span className="dot-divider"></span> {homeDeliveryCard.orderTitle}
                </div>
                <div className="card-subtle mono-text">{homeDeliveryCard.orderCode}</div>
              </div>
              <div className="eta-box glass-eta">
                <strong>{homeDeliveryCard.etaMinutes}<span>min</span></strong>
                <span className="eta-label">预计到达</span>
              </div>
            </div>
            <div className="route-preview glass-route">
              <div className="route-path-line"></div>
              {homeDeliveryCard.pathPreview}
            </div>
            <ProgressBar percent={homeDeliveryCard.progressPercent} tone="info" />
            <div className="meta-line architect-meta">
              <span>当前层级: <strong>{homeDeliveryCard.currentNode}</strong></span>
              <span className="arrow-right">→</span>
              <span>目标节点: <strong>{homeDeliveryCard.nextNode}</strong></span>
            </div>
          </div>
        </CardBase>

        <div className="grid-two home-grid-two">
          <CardBase tone="glass">
            <SectionHeader title="立面与庭院" />
            <div className="card-block compact">
              <div className="split-row align-start">
                <div>
                  <div className="card-title">{selectedFacade} 侧阳台</div>
                  <div className="card-subtle">{homeBalconyCard.suggestion}</div>
                </div>
                <StatBadge label={homeBalconyCard.windPressureLevel} tone="high" />
              </div>
              <div className="metric-row">
                <div className="metric-box">
                  <span className="metric-value">{homeBalconyCard.depthM}<span>m</span></span>
                  <span className="metric-label">当前深度</span>
                </div>
                <div className="metric-box">
                  <span className="metric-value">{homeBalconyCard.humidity}<span>%</span></span>
                  <span className="metric-label">土壤湿度</span>
                </div>
              </div>
              <button className="glass-btn-secondary" onClick={() => onNavigate('balcony')}>
                {homeBalconyCard.ctaText}
              </button>
            </div>
          </CardBase>

          <CardBase tone="glass">
            <SectionHeader title="坊巷动态" />
            <div className="card-block compact community-card">
              <div className="community-icon">⚑</div>
              <div className="card-title">{homeCommunityCard.title}</div>
              <div className="card-subtle">{homeCommunityCard.subtitle}</div>
              <button className="glass-btn-secondary mt-auto" onClick={() => onNavigate('community')}>
                {homeCommunityCard.ctaText}
              </button>
            </div>
          </CardBase>
        </div>
      </div>
    </section>
  )
}

function DeliveryScreen({
  data,
  selectedReceiveOption,
  onChangeReceiveOption,
}: {
  data: AppDataSnapshot
  selectedReceiveOption: string
  onChangeReceiveOption: (option: string) => void
}) {
  const {
    currentUser,
    activeDeliveryOrder,
    deliveryRouteSteps,
    deliveryNodeCard,
    deliveryPreference,
    deliveryHistory,
  } = data
  const activeStep = deliveryRouteSteps.find((step) => step.status === 'active')

  return (
    <section className="screen-page">
      <div className="architect-hero delivery-hero">
        <div className="hero-topline">驿 · 立体接驳</div>
        <div className="hero-row">
          <div>
            <h1>{currentUser.buildingCode}栋 {currentUser.floor}层</h1>
            <p>低空物流节点: N3-2206</p>
          </div>
          <div className="hero-avatar glass-avatar">驿</div>
        </div>
      </div>

      <div className="content-stack with-overlap">
        <CardBase tone="glass-primary" >
          <div className="card-block">
            <div className="split-row">
              <div className="order-info">
                <div className="card-title">
                  {activeDeliveryOrder.orderType} <span className="dot-divider"></span> {activeDeliveryOrder.orderTitle}
                </div>
                <div className="card-subtle mono-text">{activeDeliveryOrder.orderCode}</div>
              </div>
              <StatBadge label={activeDeliveryOrder.statusLabel} tone="info" />
            </div>
            <div className="order-meta-grid glass-meta-grid">
              <div>
                <span>预计送达</span>
                <strong>{activeDeliveryOrder.etaText}</strong>
              </div>
              <div>
                <span>接驳网络</span>
                <strong>{activeDeliveryOrder.deliveryMode}</strong>
              </div>
            </div>
            <div className="delivery-dashboard-grid">
              <DeliveryQuickStat
                label="当前节点"
                value={activeStep?.label ?? '待更新'}
                subtitle={activeStep?.heightLabel ?? '--'}
              />
              <DeliveryQuickStat
                label="签收方式"
                value={selectedReceiveOption}
                subtitle={activeDeliveryOrder.receiveMode}
              />
            </div>
          </div>
        </CardBase>

        <CardBase tone="glass">
          <SectionHeader title="路径追踪" />
          <div className="route-section-caption">
            当前包裹正沿立体物流网络接驳，节点顺序与高度层级同步更新。
          </div>
          <div className="route-chain-3d">
            {deliveryRouteSteps.map((step, index) => (
              <RouteStep3DItem
                key={step.id}
                step={step}
                isLast={index === deliveryRouteSteps.length - 1}
              />
            ))}
          </div>
        </CardBase>

        <CardBase tone="glass">
          <SectionHeader title="当前节点状态" />
          <div className="card-block compact">
            <div className="card-title">{deliveryNodeCard.currentStatusTitle}</div>
            <div className="card-subtle">{deliveryNodeCard.currentStatusDesc}</div>
            <div className="hint-box">{deliveryNodeCard.nextStatusHint}</div>
          </div>
        </CardBase>

        <CardBase tone="glass">
          <SectionHeader title="签收偏好" />
          <div className="option-list">
            {deliveryPreference.receiveOptions.map((option) => (
              <button
                key={option}
                className={`option-chip ${selectedReceiveOption === option ? 'selected' : ''}`}
                onClick={() => onChangeReceiveOption(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </CardBase>

        <CardBase tone="glass">
          <SectionHeader title="最近签收记录" />
          <div className="list-stack">
            {deliveryHistory.map((item) => (
              <div key={item.id} className="list-item">
                <div>
                  <div className="card-title">
                    {item.type} <span className="dot-divider"></span> {item.title}
                  </div>
                  <div className="card-subtle">
                    {item.date} · {item.finalNode}
                  </div>
                </div>
                <div className="list-meta">
                  <strong>{item.status}</strong>
                  <span>{item.receiveMode}</span>
                </div>
              </div>
            ))}
          </div>
        </CardBase>
      </div>
    </section>
  )
}

function HomeQuickStat({
  label,
  value,
  unit,
  subtitle,
  tone,
}: {
  label: string
  value: string
  unit: string
  subtitle: string
  tone: 'blue' | 'amber' | 'green' | 'purple'
}) {
  return (
    <div className={`home-quick-stat ${tone}`}>
      <div className="home-quick-label">{label}</div>
      <div className="home-quick-value">
        {value}
        <span>{unit}</span>
      </div>
      <div className="home-quick-subtitle">{subtitle}</div>
    </div>
  )
}

function DeliveryQuickStat({
  label,
  value,
  subtitle,
}: {
  label: string
  value: string
  subtitle: string
}) {
  return (
    <div className="delivery-quick-stat">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{subtitle}</small>
    </div>
  )
}

function BalconyScreen({
  data,
  selectedFacade,
  onSelectFacade,
  currentFacade,
  onChangeIrrigationMode,
  onManualWatering,
}: {
  data: AppDataSnapshot
  selectedFacade: FacadeKey
  onSelectFacade: (facade: FacadeKey) => void
  currentFacade: AppDataSnapshot['balconyFacades'][FacadeKey]
  onChangeIrrigationMode: (mode: '自动' | '手动') => void
  onManualWatering: () => void
}) {
  const { balconyPlants, currentUser, balconyIrrigation } = data
  const plantAlertCount = balconyPlants.filter((plant) => plant.status !== '良好').length

  return (
    <section className="screen-page">
      <HeaderBlock
        tone="green"
        eyebrow="庭"
        title="我的空中庭院"
        description={`${currentUser.buildingCode}栋 ${currentUser.floor}层 | 四向阳台状态`}
      />

      <div className="content-stack">
        <FacadeSelector selected={selectedFacade} onSelect={onSelectFacade} />

        <div className="home-stat-row balcony-stat-row">
          <HomeQuickStat
            label="当前深度"
            value={currentFacade.depthM.toFixed(2)}
            unit="m"
            subtitle={`${selectedFacade} 侧`}
            tone="blue"
          />
          <HomeQuickStat
            label="土壤湿度"
            value={String(currentFacade.humidity)}
            unit="%"
            subtitle="建议补水参考"
            tone="amber"
          />
          <HomeQuickStat
            label="植物提醒"
            value={String(plantAlertCount)}
            unit="项"
            subtitle={currentFacade.plantHint}
            tone="green"
          />
        </div>

        <CardBase tone={toneToCardTone(currentFacade.statusTone)}>
          <SectionHeader title="朝向总览" />
          <div className="card-block">
            <div className="split-row align-start">
              <div>
                <div className="card-title">{selectedFacade} 侧阳台</div>
                <div className="card-subtle">方位角 {currentFacade.bearingDeg}°</div>
              </div>
              <StatBadge label={currentFacade.windPressureLevel} tone={currentFacade.statusTone} />
            </div>
            <div className="metric-row large">
              <div>
                <span className="metric-value">{currentFacade.depthM}m</span>
                <span className="metric-label">当前深度</span>
              </div>
              <div>
                <span className="metric-value">{currentFacade.windPressurePa}Pa</span>
                <span className="metric-label">实时风压</span>
              </div>
            </div>
            <DepthBar min={0.6} max={1.75} current={currentFacade.depthM} tone={currentFacade.statusTone} />
          </div>
        </CardBase>

        <CardBase tone={toneToCardTone(currentFacade.statusTone)}>
          <SectionHeader title="今日建议" />
          <div className="card-block compact">
            <div className="card-title">{currentFacade.adviceTitle}</div>
            <div className="card-subtle">{currentFacade.adviceDesc}</div>
            <div className="hint-box">{currentFacade.plantHint}</div>
          </div>
        </CardBase>

        <CardBase>
          <SectionHeader title="环境传感器" />
          <div className="sensor-grid">
            <SensorCard label="湿度" value={`${currentFacade.humidity}%`} hint="土壤状态" />
            <SensorCard label="光照" value={`${currentFacade.lightKlx} klx`} hint="日照强度" />
            <SensorCard label="温度" value={`${currentFacade.temperature}°C`} hint="环境温度" />
            <SensorCard label="风速" value={`${currentFacade.windSpeed}m/s`} hint="局部风速" />
          </div>
        </CardBase>

        <CardBase>
          <SectionHeader title="灌溉控制" />
          <div className="card-block">
            <div className="split-row align-start">
              <div>
                <div className="card-title">当前模式：{balconyIrrigation.mode}</div>
                <div className="card-subtle">
                  下次灌溉 {balconyIrrigation.nextIrrigationTime} · 本月用水 {balconyIrrigation.monthlyWaterL}L
                </div>
              </div>
              <StatBadge label={balconyIrrigation.mode === '自动' ? '自动执行' : '手动维护'} tone="done" />
            </div>
            <div className="option-list">
              <button
                className={`option-chip ${balconyIrrigation.mode === '自动' ? 'selected' : ''}`}
                onClick={() => onChangeIrrigationMode('自动')}
              >
                自动灌溉
              </button>
              <button
                className={`option-chip ${balconyIrrigation.mode === '手动' ? 'selected' : ''}`}
                onClick={() => onChangeIrrigationMode('手动')}
              >
                手动灌溉
              </button>
              <button className="primary-btn green full-width-btn" onClick={onManualWatering}>
                立即补水
              </button>
            </div>
            <div className="hint-box">上次手动补水：{balconyIrrigation.lastManualIrrigation}</div>
          </div>
        </CardBase>

        <CardBase>
          <SectionHeader title="植物状态" />
          <div className="list-stack">
            {balconyPlants.map((plant) => (
              <div key={plant.name} className="list-item">
                <div>
                  <div className="card-title">{plant.name}</div>
                  <div className="card-subtle">{plant.hint}</div>
                </div>
                <StatBadge
                  label={plant.status}
                  tone={plant.status === '良好' ? 'low' : plant.status === '需补水' ? 'mid' : 'high'}
                />
              </div>
            ))}
          </div>
        </CardBase>
      </div>
    </section>
  )
}

function CommunityScreen({
  data,
  onToggleBillStatus,
  onMarkAnnouncementRead,
  onToggleSharedSpace,
}: {
  data: AppDataSnapshot
  onToggleBillStatus: () => void
  onMarkAnnouncementRead: (id: string) => void
  onToggleSharedSpace: (id: string) => void
}) {
  const {
    communityAnnouncements,
    communityBill,
    carbonStats,
    neighborhoodThreads,
    sharedSpaces,
  } = data
  const featuredAnnouncement = communityAnnouncements.find((item) => !item.isRead) ?? communityAnnouncements[0]
  const unreadCount = communityAnnouncements.filter((item) => !item.isRead).length

  return (
    <section className="screen-page">
      <HeaderBlock
        tone="purple"
        eyebrow="巷"
        title="社区 · 巷"
        description="围合住区、共享空间与无车化生活"
      />

      <div className="content-stack">
        <div className="home-stat-row community-stat-row">
          <HomeQuickStat
            label="本月账单"
            value={String(communityBill.totalFee)}
            unit="元"
            subtitle={communityBill.dueDate}
            tone="purple"
          />
          <HomeQuickStat
            label="今日减排"
            value={carbonStats.totalKg.toFixed(1)}
            unit="kg"
            subtitle="社区总计"
            tone="green"
          />
        </div>

        <div className="priority-banner community-banner">
          <div className="priority-banner-icon community-banner-icon">巷</div>
          <div className="priority-banner-copy">
            <div className="priority-banner-title">{featuredAnnouncement.title}</div>
            <div className="priority-banner-subtitle">
              {featuredAnnouncement.summary} {unreadCount > 0 ? `· 还有 ${unreadCount} 条未读` : '· 公告已全部查看'}
            </div>
          </div>
        </div>

        <CardBase>
          <SectionHeader title="本月账单" />
          <div className="card-block">
            <div className="bill-total">¥{communityBill.totalFee}</div>
            <div className="bill-note">
              物业费 ¥{communityBill.propertyFee} · 低空物流服务费 ¥{communityBill.uavServiceFee} · 停车费 ¥
              {communityBill.parkingFee}
            </div>
            <div className="meta-line">
              <span>到期日：{communityBill.dueDate}</span>
              <span>{communityBill.note}</span>
            </div>
            <div className="split-row">
              <StatBadge label={communityBill.billStatus} tone={communityBill.billStatus === '已支付' ? 'low' : 'mid'} />
              <button className="primary-btn purple" onClick={onToggleBillStatus}>
                {communityBill.billStatus === '已支付' ? '恢复未支付' : '立即支付'}
              </button>
            </div>
          </div>
        </CardBase>

        <CardBase tone="success">
          <SectionHeader title="绿色积分" />
          <div className="stats-stack">
            <StatLine label="无车化减排" value={`${carbonStats.carFreeKg}kg`} />
            <StatLine label="低空配送减排" value={`${carbonStats.uavKg}kg`} />
            <StatLine label="阳台植物碳汇" value={`${carbonStats.balconyPlantKg}kg`} />
            <StatLine label="总计" value={`${carbonStats.totalKg}kg`} />
          </div>
        </CardBase>

        <CardBase>
          <SectionHeader title="社区公告" />
          <div className="list-stack">
            {communityAnnouncements.map((item) => (
              <AnnouncementItem key={item.id} item={item} onRead={onMarkAnnouncementRead} />
            ))}
          </div>
        </CardBase>

        <CardBase>
          <SectionHeader title="坊邻消息" />
          <div className="list-stack">
            {neighborhoodThreads.map((thread) => (
              <div key={thread.id} className="list-item">
                <div>
                  <div className="card-title">{thread.userName}</div>
                  <div className="card-subtle">{thread.content}</div>
                </div>
                <div className="list-meta">
                  <strong>{thread.time}</strong>
                  <span>{thread.repliesCount}条回复</span>
                </div>
              </div>
            ))}
          </div>
        </CardBase>

        <CardBase>
          <SectionHeader title="共享空间" />
          <div className="list-stack">
            {sharedSpaces.map((space) => (
              <SharedSpaceItem key={space.id} item={space} onAction={onToggleSharedSpace} />
            ))}
          </div>
        </CardBase>
      </div>
    </section>
  )
}

function HeaderBlock({
  tone,
  eyebrow,
  title,
  description,
}: {
  tone: 'blue' | 'green' | 'purple'
  eyebrow: string
  title: string
  description: string
}) {
  return (
    <div className={`screen-header ${tone}`}>
      <div className="hero-topline">{eyebrow}</div>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  )
}

function CardBase({
  children,
  tone = 'default',
}: {
  children: React.ReactNode
  tone?: 'default' | 'info' | 'info-soft' | 'success' | 'warn' | 'glass' | 'glass-primary'
}) {
  return <div className={`card-base ${tone}`}>{children}</div>
}

function SectionHeader({
  title,
  action,
}: {
  title: string
  action?: { text: string; onClick: () => void }
}) {
  return (
    <div className="section-header">
      <h3>{title}</h3>
      {action && (
        <button className="text-action" onClick={action.onClick}>
          {action.text}
        </button>
      )}
    </div>
  )
}

function StatBadge({
  label,
  tone,
}: {
  label: string
  tone: 'high' | 'mid' | 'low' | 'info' | 'done'
}) {
  return <span className={`stat-badge ${tone}`}>{label}</span>
}

function ProgressBar({
  percent,
  tone,
}: {
  percent: number
  tone: 'info' | 'success'
}) {
  return (
    <div className="progress-track">
      <div className={`progress-fill ${tone}`} style={{ width: `${percent}%` }} />
    </div>
  )
}

function FacadeSelector({
  selected,
  onSelect,
}: {
  selected: FacadeKey
  onSelect: (facade: FacadeKey) => void
}) {
  const facades: FacadeKey[] = ['SSE', 'NNW', 'ENE', 'WSW']

  return (
    <div className="facade-selector">
      {facades.map((facade) => (
        <button
          key={facade}
          className={`facade-chip ${selected === facade ? 'active' : ''}`}
          onClick={() => onSelect(facade)}
        >
          {facade}
        </button>
      ))}
    </div>
  )
}

function DepthBar({
  min,
  max,
  current,
  tone,
}: {
  min: number
  max: number
  current: number
  tone: FacadeTone
}) {
  const left = `${((current - min) / (max - min)) * 100}%`

  return (
    <div className="depth-wrap">
      <div className={`depth-track ${tone}`}>
        <div className="depth-marker" style={{ left }} />
      </div>
      <div className="meta-line">
        <span>{min.toFixed(2)}m</span>
        <span>当前深度 {current.toFixed(2)}m</span>
        <span>{max.toFixed(2)}m</span>
      </div>
    </div>
  )
}

function RouteStep3DItem({
  step,
  isLast,
}: {
  step: RouteStep
  isLast: boolean
}) {
  const isDone = step.status === 'done'
  const isActive = step.status === 'active'
  const isUpcoming = step.status === 'upcoming'

  return (
    <div className={`route-step-3d ${step.status}`}>
      <div className="route-rail-3d">
        <span className={`route-dot-3d ${step.status}`}></span>
        {!isLast && <span className={`route-line-3d ${isDone ? 'done' : ''}`}></span>}
      </div>
      <div className="route-copy-3d">
        <div className="route-card-3d">
          <div className="split-row align-start">
            <div className="route-text-area">
              <div className="card-title">{step.label}</div>
              {isActive && (
                <div className="active-pulse-bg">
                  <div className="card-subtle">{step.description}</div>
                </div>
              )}
              {isUpcoming && !isActive && <div className="card-subtle route-upcoming-note">{step.description}</div>}
            </div>
            <span className={`height-pill-3d ${isActive ? 'active' : ''}`}>{step.heightLabel}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function SensorCard({
  label,
  value,
  hint,
}: {
  label: string
  value: string
  hint: string
}) {
  return (
    <div className="sensor-card">
      <span className="sensor-label">{label}</span>
      <strong>{value}</strong>
      <small>{hint}</small>
    </div>
  )
}

function StatLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="stat-line">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

function AnnouncementItem({
  item,
  onRead,
}: {
  item: Announcement
  onRead: (id: string) => void
}) {
  const toneMap: Record<Announcement['tag'], 'mid' | 'low' | 'info' | 'high'> = {
    设施: 'mid',
    活动: 'low',
    步道: 'info',
    安全: 'high',
  }

  return (
    <div className={`list-item ${item.isRead ? 'is-read' : ''}`}>
      <div>
        <StatBadge label={item.tag} tone={toneMap[item.tag]} />
        <div className="card-title with-gap">{item.title}</div>
        <div className="card-subtle">{item.summary}</div>
      </div>
      <div className="list-meta">
        <strong>{item.time}</strong>
        {item.isRead ? (
          <span>已读</span>
        ) : (
          <button className="text-action" onClick={() => onRead(item.id)}>
            标记已读
          </button>
        )}
      </div>
    </div>
  )
}

function SharedSpaceItem({
  item,
  onAction,
}: {
  item: SharedSpace
  onAction: (id: string) => void
}) {
  const tone =
    item.status === '开放中'
      ? 'low'
      : item.status === '维护中'
        ? 'mid'
        : item.status === '已预约'
          ? 'done'
          : 'info'

  return (
    <div className="list-item">
      <div>
        <div className="card-title">{item.name}</div>
        <div className="card-subtle">下次可用：{item.nextAvailable}</div>
      </div>
      <div className="list-meta">
        <StatBadge label={item.status} tone={tone} />
        {item.status === '维护中' ? (
          <span>{item.ctaText}</span>
        ) : (
          <button className="text-action" onClick={() => onAction(item.id)}>
            {item.ctaText}
          </button>
        )}
      </div>
    </div>
  )
}

function SiteMiniMap() {
  return (
    <div className="site-map">
      <img className="site-map-image" src={masterplanImage} alt="项目总平图" />
    </div>
  )
}

function BottomNav({
  activeTab,
  onChange,
}: {
  activeTab: TabKey
  onChange: (tab: TabKey) => void
}) {
  const items: Array<{ key: TabKey; label: string; icon: string }> = [
    { key: 'home', label: '坊', icon: '坊' },
    { key: 'delivery', label: '驿', icon: '驿' },
    { key: 'balcony', label: '庭', icon: '庭' },
    { key: 'community', label: '巷', icon: '巷' },
  ]

  return (
    <nav className="bottom-nav">
      {items.map((item) => (
        <button
          key={item.key}
          className={`nav-item ${activeTab === item.key ? 'active' : ''}`}
          onClick={() => onChange(item.key)}
        >
          <span className="nav-icon">{item.icon}</span>
          <span className="nav-label">{item.label}</span>
        </button>
      ))}
    </nav>
  )
}

function toneToCardTone(tone: FacadeTone): 'warn' | 'success' | 'info-soft' {
  if (tone === 'high') return 'warn'
  if (tone === 'low') return 'success'
  return 'info-soft'
}

export default App
