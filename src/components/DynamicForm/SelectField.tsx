import { FormControl } from '@/components/ui/Form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import type { Form } from '~/payload-types'

type SelectField = Extract<NonNullable<Form['fields']>[number], { blockType: 'select' }>

export default function SelectField({ field, payloadField }: { field: any; payloadField: SelectField }) {
  return (
    <Select onValueChange={field.onChange} defaultValue={field.value}>
      <FormControl>
        <SelectTrigger>
          <SelectValue placeholder={`Select ${payloadField.label}`} />
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        {payloadField?.options &&
          payloadField.options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  )
}
