const request = require('supertest');
const express = require('express');
const { getOpportunities, getOpportunityDetails, approveOpportunity, rejectOpportunity, requestChanges, addNote, bulkApprove } = require('../../controllers/admin/opportunity.controller');
const FreelanceOpportunity = require('../../models/FreelanceOpportunity');
const OpportunityNote = require('../../models/OpportunityNote');

jest.mock('../../models/FreelanceOpportunity');
jest.mock('../../models/OpportunityNote');
jest.mock('../../services/auditLoggerService', () => ({
  logAudit: jest.fn()
}));

const app = express();
app.use(express.json());
// Mock user
app.use((req, res, next) => { req.user = { _id: 'adminid' }; next(); });
app.get('/api/admin/opportunities', getOpportunities);
app.get('/api/admin/opportunities/:id', getOpportunityDetails);
app.post('/api/admin/opportunities/:id/approve', approveOpportunity);
app.post('/api/admin/opportunities/:id/reject', rejectOpportunity);
app.post('/api/admin/opportunities/:id/request-changes', requestChanges);
app.post('/api/admin/opportunities/:id/notes', addNote);
app.post('/api/admin/opportunities/bulk-approve', bulkApprove);

describe('Opportunity Moderation Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should list opportunities', async () => {
    FreelanceOpportunity.countDocuments.mockResolvedValue(1);
    FreelanceOpportunity.find.mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue([{ title: 'Job 1' }])
    });

    const res = await request(app).get('/api/admin/opportunities');
    expect(res.status).toBe(200);
  });

  it('should get opportunity details', async () => {
    FreelanceOpportunity.findById.mockReturnValue({
      populate: jest.fn().mockResolvedValue({ title: 'Job 1', company_id: 'c1' })
    });
    OpportunityNote.find.mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      sort: jest.fn().mockResolvedValue([{ note_text: 'note 1' }])
    });

    const res = await request(app).get('/api/admin/opportunities/123');
    expect(res.status).toBe(200);
  });

  it('should approve opportunity', async () => {
    const mockSave = jest.fn();
    FreelanceOpportunity.findById.mockResolvedValue({ _id: '123', status: 'PENDING', save: mockSave, title: 'Job 1' });
    const res = await request(app).post('/api/admin/opportunities/123/approve');
    expect(res.status).toBe(200);
    expect(mockSave).toHaveBeenCalled();
  });

  it('should reject opportunity', async () => {
    const mockSave = jest.fn();
    FreelanceOpportunity.findById.mockResolvedValue({ _id: '123', status: 'PENDING', save: mockSave });
    const res = await request(app).post('/api/admin/opportunities/123/reject').send({ reason: 'spam' });
    expect(res.status).toBe(200);
    expect(mockSave).toHaveBeenCalled();
  });

  it('should request changes', async () => {
    const mockSave = jest.fn();
    FreelanceOpportunity.findById.mockResolvedValue({ _id: '123', status: 'PENDING', save: mockSave });
    const res = await request(app).post('/api/admin/opportunities/123/request-changes').send({ changes_requested: 'fix typo' });
    expect(res.status).toBe(200);
    expect(mockSave).toHaveBeenCalled();
  });

  it('should add note', async () => {
    FreelanceOpportunity.findById.mockResolvedValue({ _id: '123' });
    OpportunityNote.create.mockResolvedValue({ note_text: 'hello' });
    const res = await request(app).post('/api/admin/opportunities/123/notes').send({ note_text: 'hello' });
    expect(res.status).toBe(201);
  });

  it('should bulk approve', async () => {
    FreelanceOpportunity.updateMany.mockResolvedValue({ modifiedCount: 2 });
    const res = await request(app).post('/api/admin/opportunities/bulk-approve').send({ opportunity_ids: ['123', '456'] });
    expect(res.status).toBe(200);
  });
});
