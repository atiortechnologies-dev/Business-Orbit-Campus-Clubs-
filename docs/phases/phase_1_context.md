# Phase 1 Context: Database Setup and Core Opportunities API

## Global Project Guidelines
Shared Backend Logic
When a student enters the Freelancing module:
Verify student authentication. 
Load published opportunities. 
Load student's profile and resume status. 
Load previously submitted applications. 
Load saved filters and search preferences. 
Load notifications related to applications.

## Phase-Specific Requirements
Screen 1 – Freelancing Opportunities
Backend Logic
Display all active opportunities posted by approved companies.
Each opportunity should display:
Opportunity Title 
Company Name 
Company Logo 
Opportunity Type (Internship/Freelance/Part-time) 
Work Mode (Remote/Hybrid/On-site) 
Experience Level 
Location 
Salary/Stipend (if applicable) 
Posted Date 
Application Deadline 
Short Description 

Support
Search opportunities 
Filter by: 
Opportunity Type 
Work Mode 
Industry 
Experience Level 
Sorting (Latest, Deadline, Relevance) 
Pagination 

Actions
View Opportunity 
Save Opportunity (optional) 
Apply 

Database Structure
Opportunities
opportunity_id 
company_id 
title 
description 
type 
work_mode 
industry 
experience_level 
location 
salary_range 
application_deadline 
status 
created_at 
updated_at 

Business Rules
Display only active and approved opportunities. 
Expired opportunities cannot accept applications. 
Students cannot view unpublished opportunities. 
Search, filters, and sorting should work together. 

Screen 2 – Opportunity Detail
Backend Logic
Display complete opportunity information.
Show:
Company Information
Company Name 
Logo 
Industry 
Website 
Company Overview 
Opportunity Information
Title 
Description 
Responsibilities 
Required Skills 
Eligibility Criteria 
Preferred Qualifications 
Location 
Duration 
Salary/Stipend 
Application Deadline 
Actions
Apply Now 
Save Opportunity 
Share Opportunity (optional) 

Business Rules
Only active opportunities are accessible. 
Students cannot edit opportunity details. 
Company information is read-only. 

APIs Required
Freelancing Opportunities
GET /api/student/freelancing/opportunities
GET /api/student/freelancing/opportunities/{opportunityId}
GET /api/student/freelancing/opportunities/search
POST /api/student/freelancing/opportunities/filter

Opportunity Details
GET /api/student/freelancing/opportunities/{opportunityId}/details
POST /api/student/freelancing/opportunities/{opportunityId}/save
DELETE /api/student/freelancing/opportunities/{opportunityId}/save

## Resolved Clarifications (Relevant to This Phase)
None

## Schema Context
Schema map not yet generated. This phase will create it.

## Shared Utilities Available
No shared utilities registered yet.

## API Contracts from Previous Phases
None
