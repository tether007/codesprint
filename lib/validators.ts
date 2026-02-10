// for validating the inputs when signin till flag 

import { z } from 'zod';

// Signup validation
export const signupSchema = z.object({
  email: z.email('Invalid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  password: z.string().min(8, 'Password must be at least 8 characters').max(100),
});

// Login validation
export const loginSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Team creation validation
export const createTeamSchema = z.object({
  teamName: z.string().min(3, 'Team name must be at least 3 characters').max(50),
});

// Join team validation
export const joinTeamSchema = z.object({
  teamCode: z.string().length(10, 'Invalid team code format'),
});

// Flag submission validation
export const submitFlagSchema = z.object({
  challengeId: z.number().int().positive(),
  flag: z.string().min(1, 'Flag cannot be empty').max(255),
});
