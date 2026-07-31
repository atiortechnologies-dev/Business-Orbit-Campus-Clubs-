import axiosInstance from './axiosInstance';

export const mentorshipApi = {
  getMentors: (filters) => axiosInstance.get('/mentors', { params: filters }),
  getMentorProfile: (mentorId) => axiosInstance.get(`/mentors/${mentorId}`),
  requestMentorship: (mentorId, data) => axiosInstance.post(`/mentors/${mentorId}/request`, data),
  getMentorshipRequests: () => axiosInstance.get('/mentorship/requests'),
  updateRequestStatus: (requestId, status) => axiosInstance.patch(`/mentorship/requests/${requestId}`, { status }),
  getMeetings: () => axiosInstance.get('/mentorship/meetings'),
  scheduleMeeting: (data) => axiosInstance.post('/mentorship/meetings', data),
  filterMentors: (filters) => axiosInstance.post('/mentors/filter', filters),
  getMentorshipRequestStatus: () => axiosInstance.get('/mentorship/request-status'),
};
