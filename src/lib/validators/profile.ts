import { z } from 'zod';

export const ProfileSchema = z.object({
    username: z.string().min(3, 'El nombre de usuario debe tener al menos 3 caracteres').max(20, 'El nombre de usuario no puede tener más de 20 caracteres'),
    bio: z.string().max(200, 'La biografía no puede tener más de 200 caracteres').optional(),
    location: z.string().optional(),
    profileImage: z.string().url('La URL de la imagen de perfil no es válida').optional().nullable(),
    ageRange: z.string().optional(),
    conversationType: z.string().optional(),
    hobbies: z.array(z.object({ id: z.string(), name: z.string(), icon: z.string().nullable() })).optional(),
    email: z.string().email('El correo electrónico no es válido').optional(),
});

export type ProfileData = z.infer<typeof ProfileSchema>;
