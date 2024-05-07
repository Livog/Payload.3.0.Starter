import { z } from 'zod'

export const signUpFormSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  email: z.string().min(1, { message: 'E-mail is required' }).email({ message: 'E-mail is invalid' }),
  password: z.string().min(1, { message: 'Password is required' }).min(6, { message: 'Password must be at least 6 characters long' })
})

export type SignUpFormData = z.infer<typeof signUpFormSchema>
