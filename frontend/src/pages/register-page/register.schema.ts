import { z } from 'zod';

export const RegisterSchema = z.object({
  name: z.string().optional(),
  email: z
    .string()
    .min(1, { message: 'Ввод эл. почты является обязательным' })
    .email({ message: 'Адрес эл. почты указан некорректно' }),
  password: z
    .string()
    .min(6, { message: 'Пароль должен содержать не менее 6-ти символов' }),
});

export type Register = z.infer<typeof RegisterSchema>;
