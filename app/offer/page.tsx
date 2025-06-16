"use client";

// List all offers from MS3
import React, { useState } from 'react';

export default function OfferPage() {
  const [offers, setOffers] = React.useState<any[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [candidateId, setCandidateId] = React.useState('');
  const [createStatus, setCreateStatus] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetchOffers();
  }, []);

  async function fetchOffers() {
    try {
      setError(null);
      const res = await fetch(`${process.env.NEXT_PUBLIC_MS3_API}/offers`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch offers');
      setOffers(await res.json());
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function handleCreateOffer(e: React.FormEvent) {
    e.preventDefault();
    setCreateStatus(null);
    setError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_MS3_API}/offers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidate_id: candidateId })
      });
      if (!res.ok) throw new Error('Failed to create offer');
      setCreateStatus('Offer created successfully!');
      setCandidateId('');
      fetchOffers();
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function updateStatus(id: string, status: string) {
    setError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_MS3_API}/offers/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error('Failed to update status');
      fetchOffers();
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <div className="min-h-screen bg-[#050d25] p-8">
      <div className="max-w-5xl mx-auto bg-[#0e101c] rounded-xl shadow-lg border border-[#2e314d] p-8">
        <h1 className="text-3xl font-bold mb-8 text-white">All Offers</h1>
        {error && <div className="mb-4 text-red-400">{error}</div>}
        {createStatus && <div className="mb-4 text-green-400">{createStatus}</div>}
        <form onSubmit={handleCreateOffer} className="mb-8 flex gap-4 items-end">
          <div>
            <label className="block text-white mb-1">Candidate ID</label>
            <input type="text" value={candidateId} onChange={e => setCandidateId(e.target.value)} required className="border border-[#2e314d] bg-[#181b2e] text-white px-2 py-1 rounded" />
          </div>
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">Create Offer</button>
        </form>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-[#2e314d] bg-[#181b2e] text-white rounded-lg">
            <thead>
              <tr className="bg-[#1e223a]">
                <th className="border-b border-[#2e314d] px-4 py-3 text-left">ID</th>
                <th className="border-b border-[#2e314d] px-4 py-3 text-left">Candidate</th>
                <th className="border-b border-[#2e314d] px-4 py-3 text-left">Status</th>
                <th className="border-b border-[#2e314d] px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {offers.map((offer: any, idx: number) => (
                <tr key={offer.id} className={idx % 2 === 0 ? 'bg-[#181b2e]' : 'bg-[#23263a]'}
                >
                  <td className="border-b border-[#2e314d] px-4 py-2">{offer.id}</td>
                  <td className="border-b border-[#2e314d] px-4 py-2">{offer.candidate_id}</td>
                  <td className="border-b border-[#2e314d] px-4 py-2">{offer.status}</td>
                  <td className="border-b border-[#2e314d] px-4 py-2 flex gap-2">
                    <a href={`/offer/onboard/${offer.id}`} className="text-blue-400 hover:underline">Onboard</a>
                    <button onClick={() => updateStatus(offer.id, 'Accepted')} className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs">Accept</button>
                    <button onClick={() => updateStatus(offer.id, 'Rejected')} className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs">Reject</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
