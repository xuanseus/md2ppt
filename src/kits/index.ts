import type { KitDef } from './types'
import { beatsKit } from './beats'
import { animalIslandKit } from './animal-island'

export type { KitDef }

/** 所有可用的组件套件 */
export const kits: KitDef[] = [
  beatsKit,
  animalIslandKit,
]

/** 默认套件 */
export const defaultKit = kits[0]

/** 根据 id 查找套件 */
export function getKit(id: string): KitDef | undefined {
  return kits.find(k => k.id === id)
}
