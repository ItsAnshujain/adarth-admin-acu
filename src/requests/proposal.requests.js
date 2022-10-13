import http from '../utils/http';

export const createProposal = data => http.post('/proposal', data);

export const fetchProposals = query => http.get(`/proposal?${query}`);

export const fetchProposalById = proposalId => http.get(`/proposal/${proposalId}`);

export const updateProposal = (proposalId, data) => http.patch(`/proposal/${proposalId}`, data);

export const deleteProposal = proposalId => http.delete(`/proposal/${proposalId}`);
