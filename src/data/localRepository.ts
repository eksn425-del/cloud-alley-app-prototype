import { defaultAppSnapshot } from './defaultSnapshot'
import type { AppDataRepository, AppDataSnapshot } from '../types'

const STORAGE_KEY = 'yunduanfangxiang-app-data'

function cloneSnapshot(snapshot: AppDataSnapshot): AppDataSnapshot {
  return JSON.parse(JSON.stringify(snapshot)) as AppDataSnapshot
}

function canUseStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

function readStoredSnapshot() {
  if (!canUseStorage()) return null

  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw) as AppDataSnapshot
  } catch {
    return null
  }
}

function writeStoredSnapshot(snapshot: AppDataSnapshot) {
  if (!canUseStorage()) return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot))
}

async function getMutableSnapshot() {
  const snapshot = readStoredSnapshot()
  if (snapshot) return snapshot

  const fallback = cloneSnapshot(defaultAppSnapshot)
  writeStoredSnapshot(fallback)
  return fallback
}

export const localRepository: AppDataRepository = {
  async getAppData() {
    const snapshot = await getMutableSnapshot()
    return cloneSnapshot(snapshot)
  },

  async updateReceiveOption(option: string) {
    const snapshot = await getMutableSnapshot()
    snapshot.deliveryPreference.selectedReceiveOption = option
    snapshot.activeDeliveryOrder.receiveMode = option
    writeStoredSnapshot(snapshot)
    return option
  },

  async saveAppData(snapshot: AppDataSnapshot) {
    const nextSnapshot = cloneSnapshot(snapshot)
    writeStoredSnapshot(nextSnapshot)
    return nextSnapshot
  },

  async resetAppData() {
    const snapshot = cloneSnapshot(defaultAppSnapshot)
    writeStoredSnapshot(snapshot)
    return snapshot
  },
}
