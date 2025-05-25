import { z } from 'zod';

export const feedbackSchema = z.object({
  technicalSkills: z.number()
    .min(1, 'Technical skills rating is required')
    .max(5, 'Rating must be between 1 and 5'),
  problemSolving: z.number()
    .min(1, 'Problem solving rating is required')
    .max(5, 'Rating must be between 1 and 5'),
  communication: z.number()
    .min(1, 'Communication rating is required')
    .max(5, 'Rating must be between 1 and 5'),
  cultureFit: z.number()
    .min(1, 'Culture fit rating is required')
    .max(5, 'Rating must be between 1 and 5'),
  strengths: z.string()
    .min(10, 'Please provide at least 10 characters for strengths')
    .max(500, 'Strengths cannot exceed 500 characters'),
  weaknesses: z.string()
    .min(10, 'Please provide at least 10 characters for weaknesses')
    .max(500, 'Weaknesses cannot exceed 500 characters'),
  notes: z.string()
    .max(1000, 'Notes cannot exceed 1000 characters')
    .optional(),
  recommendation: z.enum(['Strong Hire', 'Hire', 'Hold', 'No Hire'], {
    required_error: 'Please select a recommendation',
  }),
});

export type FeedbackFormData = z.infer<typeof feedbackSchema>;

export const validateFeedback = (data: unknown) => {
  try {
    return { 
      success: true, 
      data: feedbackSchema.parse(data) 
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      };
    }
    return {
      success: false,
      errors: [{ field: 'unknown', message: 'An unexpected error occurred' }]
    };
  }
}; 