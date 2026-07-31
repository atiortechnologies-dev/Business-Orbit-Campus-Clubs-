import React, { useEffect, useState } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import { adminChapterApi } from '@/api/admin/adminApi';

export default function ChapterChangeRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const data = await adminChapterApi.getChangeRequests();
      setRequests(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await adminChapterApi.approveChangeRequest(id);
      fetchRequests();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (id) => {
    try {
      await adminChapterApi.rejectChangeRequest(id);
      fetchRequests();
    } catch (err) {
      console.error(err);
    }
  };

  const handleBulkApprove = async () => {
    const ids = requests.map(r => r.id); // Assuming simple logic for bulk
    try {
      await adminChapterApi.bulkApproveRequests({ requestIds: ids });
      fetchRequests();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AdminShell>
      <div className="mb-8">
        <h1 className="font-poppins font-semibold text-page text-text-heading">Chapter Change Requests</h1>
        <button onClick={handleBulkApprove} className="mt-4 bg-brand-black text-white px-4 py-2 rounded">
          Bulk Approve All
        </button>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid gap-4">
          {requests.length === 0 ? <p>No change requests found.</p> : requests.map((req) => (
            <div key={req.id || req._id} className="p-4 border rounded shadow-sm bg-white">
              <p><strong>Chapter:</strong> {req.chapterName}</p>
              <p><strong>Status:</strong> {req.status}</p>
              <div className="flex gap-2 mt-2">
                <button onClick={() => handleApprove(req.id || req._id)} className="text-green-600">Approve</button>
                <button onClick={() => handleReject(req.id || req._id)} className="text-red-600">Reject</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
