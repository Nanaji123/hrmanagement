export type Interview = {
  id: string;
  candidateId: string;
  scheduledAt: string;
  panelMembers: string[];
  status: string;
  feedbackGiven?: boolean;
  candidateName?: string;
};

export async function fetchInterviews(): Promise<Interview[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_MS2_API}/interviews`, {
    cache: 'no-store',
  });

  if (!res.ok) throw new Error('Failed to fetch interviews');
  return res.json();
}
