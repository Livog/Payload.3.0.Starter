import { Field } from 'payload/types'
import * as HiIcons from 'react-icons/hi2'

const iconOptions = Object.entries(HiIcons)
  .filter(([key, value]) => typeof value === 'function')
  .map(([key]) => ({
    value: key,
    label: key.replace(/([a-z])([A-Z])/g, '$1 $2')
  }))

export const iconField: Field = {
  type: 'select',
  name: 'icon',
  label: 'Icon',
  options: iconOptions
}
