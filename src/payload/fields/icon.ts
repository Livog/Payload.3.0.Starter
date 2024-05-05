import type { Field, FieldHook } from 'payload/types'
import deepMerge from 'deepmerge'
import * as HiIcons from 'react-icons/hi2'

const iconOptions = Object.entries(HiIcons)
  .filter(([key, value]) => typeof value === 'function')
  .map(([key]) => ({
    value: key,
    label: key.replace(/([a-z])([A-Z])/g, '$1 $2')
  }))

type IconField = (overrides?: Partial<Field>) => Field

const iconField: IconField = (overrides = {}) => {
  return deepMerge<Field, Partial<Field>>(
    {
      type: 'select',
      name: 'icon',
      label: 'Icon',
      options: iconOptions
    },
    overrides
  )
}

export default iconField
