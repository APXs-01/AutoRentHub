import api from './api';

export const complaintService = {
  create: async ({ bookingId, subject, message }) => {
    const res = await api.post('/complaints', { bookingId, subject, message });
    return res.data;
  },
  myComplaints: async () => {
    const res = await api.get('/complaints/me');
    return res.data;
  },
  all: async (params = {}) => {
    const res = await api.get('/complaints', { params });
    return res.data;
  },
  respond: async (id, { status, adminResponse }) => {
    const res = await api.put(`/complaints/${id}/respond`, { status, adminResponse });
    return res.data;
  }
};


