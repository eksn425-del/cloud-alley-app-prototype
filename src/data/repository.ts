import { localRepository } from './localRepository'
import type { AppDataRepository } from '../types'

// Public-clean release: local demo mode only.
export const appRepository: AppDataRepository = localRepository

