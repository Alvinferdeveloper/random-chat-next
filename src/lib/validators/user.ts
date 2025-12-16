import { z } from 'zod';

export const ProfileFormSchema = z.object({
    username: z.string().min(3, 'El nombre de usuario debe tener al menos 3 caracteres').max(20, 'El nombre de usuario no puede tener más de 20 caracteres'),
    age: z.string().optional(),
    location: z.string().optional(),
    selectedHobbies: z.array(z.string()).min(1, 'Debes seleccionar al menos una afición'),
    conversationType: z.string().min(1, 'Debes seleccionar un tipo de conversación'),
    bio: z.string().max(200, 'La biografía no puede tener más de 200 caracteres').optional(),
});

export type ProfileFormValues = z.infer<typeof ProfileFormSchema>;
