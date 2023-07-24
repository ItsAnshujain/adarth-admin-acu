import http from '../http';

export const createProposal = data => http.post('/proposal', data);

export const fetchProposals = query => http.get(`/proposal?${query}`);

export const fetchProposalById = proposalId => http.get(`/proposal/${proposalId}`);

export const updateProposal = (proposalId, data) => http.patch(`/proposal/${proposalId}`, data);

export const deleteProposal = proposalId => http.delete(`/proposal/${proposalId}`);

export const shareProposal = (id, queries, data) =>
  http.post(`/proposal/${id}/share?${queries}`, data);

export const generateProposalPdf = (id, queries) => http.get(`/proposal/${id}/gen-pdf?${queries}`);
