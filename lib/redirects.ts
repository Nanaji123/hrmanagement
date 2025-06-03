export const getDashboardUrl = (role: string) => {
  switch (role) {
    case 'hr_manager':
      return '/dashboard/hiring_manager';
    case 'hr_recruiter':
      return '/dashboard/HR_RECRUiTER';
    case 'interviewer':
      return '/dashboard/interviewer';
    default:
      return '/dashboard/hiring_manager';
  }
};