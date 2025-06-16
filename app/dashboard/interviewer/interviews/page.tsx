import { fetchInterviews } from '@/lib/api/interviews';
import Link from 'next/link';

export default async function InterviewListPage() {
  const interviews = await fetchInterviews();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#050d25] to-[#0d1021] px-6 py-10 text-white flex items-center justify-center">
      <div className="max-w-7xl w-full mx-auto bg-[#0e101c] rounded-3xl shadow-[0_0_40px_#00f7ff30] border border-[#2e314d] p-8 md:p-12">
        <h1 className="text-3xl font-bold text-gray-100 mb-8">Interviews</h1>
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {interviews.length === 0 ? (
            <li className="col-span-full text-center text-gray-400 text-lg font-semibold py-16">
              No interviews scheduled.
            </li>
          ) : null}
          {interviews.map((interview) => (
            <li
              key={interview.id}
              className="bg-[#181b2e] rounded-2xl shadow-[0_0_30px_#00f7ff30] border border-[#2e314d] p-8 flex flex-col gap-2 justify-center text-lg font-semibold text-cyan-100"
            >
              <div className="text-xl font-bold text-cyan-200 mb-1">
                {interview.candidateName || interview.candidateId}
              </div>
              <div className="text-sm text-cyan-300">
                {new Date(interview.scheduledAt).toLocaleString()}
              </div>
              <div className="text-sm text-cyan-400">
                Panel: {interview.panelMembers?.join(', ')}
              </div>
              <div
                className={`text-xs font-medium rounded px-2 py-1 mt-2 w-fit ${
                  interview.status === 'Completed'
                    ? 'bg-emerald-900/30 text-emerald-300'
                    : 'bg-amber-900/30 text-amber-200'
                }`}
              >
                {interview.status}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}