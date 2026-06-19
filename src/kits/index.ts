import type { KitDef } from './types'
import { beatsKit } from './beats'
import { animalIslandKit } from './animal-island'
import { holoKit } from './holo'
import { pixeliumKit } from './pixelium'
import { shuimoKit } from './shuimo'
import { cyberpunkKit } from './cyberpunk'
import { pixelUiKit } from './pixel-ui'

export type { KitDef }

/** 所有可用的组件套件 */
export const kits: KitDef[] = [
  beatsKit,
  animalIslandKit,
  holoKit,
  pixeliumKit,
  shuimoKit,
  cyberpunkKit,
  pixelUiKit,
]

/** 默认套件 */
export const defaultKit = kits[0]

/** 根据 id 查找套件 */
export function getKit(id: string): KitDef | undefined {
  return kits.find(k => k.id === id)
}
