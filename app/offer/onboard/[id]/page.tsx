// Onboard form for a selected offer
import React from 'react';

interface OfferPageProps {
  params: { id: string }
}

export default async function OnboardPage({ params }: OfferPageProps) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_MS3_API}/offers/${params.id}`, { cache: 'no-store' });
  const offer = await res.json();

  // You can expand this form as needed
  return (
    <div className="min-h-screen bg-[#050d25] p-8">
      <div className="max-w-lg mx-auto bg-[#0e101c] rounded-xl shadow-lg border border-[#2e314d] p-8">
        <h1 className="text-3xl font-bold mb-8 text-white">Onboard Candidate</h1>
        <div className="mb-4 text-white">Offer ID: {offer.id}</div>
        <div className="mb-4 text-white">Candidate: {offer.candidate_id}</div>
        <form method="POST" action={`${process.env.NEXT_PUBLIC_MS3_API}/onboard`}>
          <input type="hidden" name="offer_id" value={offer.id} />
          <label className="block mb-2 text-white">Onboarding Date</label>
          <input type="date" name="onboarding_date" className="border border-[#2e314d] bg-[#181b2e] text-white px-2 py-1 mb-4 w-full rounded" required />
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition">Onboard</button>
        </form>
      </div>
    </div>
  );
}
