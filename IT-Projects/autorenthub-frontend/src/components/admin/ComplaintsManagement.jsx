import React, { useEffect, useState } from 'react';
import { complaintService } from '../../services/complaintService';
import LoadingSpinner from '../common/LoadingSpinner';
import { toast } from 'react-toastify';

const ComplaintsManagement = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('all');
  const [complaints, setComplaints] = useState([]);
  const [respondingId, setRespondingId] = useState(null);
  const [responseText, setResponseText] = useState('');
  const [responseStatus, setResponseStatus] = useState('resolved');

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const res = await complaintService.all({ status });
      setComplaints(res.data || []);
    } catch (e) {
      toast.error('Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const startRespond = (c) => {
    setRespondingId(c._id);
    setResponseText(c.adminResponse || '');
    setResponseStatus(c.status === 'open' ? 'in_progress' : c.status);
  };

  const submitResponse = async (id) => {
    try {
      await complaintService.respond(id, { status: responseStatus, adminResponse: responseText });
      toast.success('Response saved');
      setRespondingId(null);
      setResponseText('');
      fetchComplaints();
    } catch (e) {
      toast.error('Failed to save response');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Complaints Management</h3>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border rounded-md px-3 py-2 text-sm"
        >
          {['all','open','in_progress','resolved','rejected'].map(s => (
            <option key={s} value={s}>{s.replace('_',' ')}</option>
          ))}
        </select>
      </div>
      {loading ? (
        <div className="flex justify-center py-12"><LoadingSpinner /></div>
      ) : complaints.length === 0 ? (
        <div className="text-center text-gray-600 py-8">No complaints</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left text-sm font-semibold text-gray-700 px-3 py-2 border-b">Date</th>
                <th className="text-left text-sm font-semibold text-gray-700 px-3 py-2 border-b">Customer</th>
                <th className="text-left text-sm font-semibold text-gray-700 px-3 py-2 border-b">Booking</th>
                <th className="text-left text-sm font-semibold text-gray-700 px-3 py-2 border-b">Subject</th>
                <th className="text-left text-sm font-semibold text-gray-700 px-3 py-2 border-b">Status</th>
                <th className="text-left text-sm font-semibold text-gray-700 px-3 py-2 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((c) => (
                <tr key={c._id} className="border-b hover:bg-gray-50">
                  <td className="px-3 py-2 text-sm">{new Date(c.createdAt).toLocaleString()}</td>
                  <td className="px-3 py-2 text-sm">{c.user?.name} <span className="text-gray-500">({c.user?.email})</span></td>
                  <td className="px-3 py-2 text-sm">{c.booking?.bookingId}</td>
                  <td className="px-3 py-2 text-sm">
                    <div className="font-medium">{c.subject}</div>
                    <div className="text-gray-600 text-xs line-clamp-2">{c.message}</div>
                  </td>
                  <td className="px-3 py-2 text-sm capitalize">{c.status.replace('_',' ')}</td>
                  <td className="px-3 py-2 text-sm">
                    {respondingId === c._id ? (
                      <div className="space-y-2">
                        <select
                          value={responseStatus}
                          onChange={(e) => setResponseStatus(e.target.value)}
                          className="border rounded-md px-2 py-1 text-sm"
                        >
                          {['open','in_progress','resolved','rejected'].map(s => (
                            <option key={s} value={s}>{s.replace('_',' ')}</option>
                          ))}
                        </select>
                        <textarea
                          rows={3}
                          value={responseText}
                          onChange={(e) => setResponseText(e.target.value)}
                          className="w-full border rounded-md px-2 py-1 text-sm"
                          placeholder="Write response to customer"
                        />
                        <div className="flex gap-2">
                          <button onClick={() => submitResponse(c._id)} className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm">Save</button>
                          <button onClick={() => setRespondingId(null)} className="px-3 py-1 border rounded-md text-sm">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <button onClick={() => startRespond(c)} className="px-3 py-1 border rounded-md text-sm">Respond</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ComplaintsManagement;


