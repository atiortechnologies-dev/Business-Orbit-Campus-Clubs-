# Phase 2 API Contract: Applications & Document Uploads API

## POST /api/student/freelancing/applications
- Auth required: Yes (Student)
- Request body: { opportunity_id: string (required) }
- Success: 201 { data: { application: { _id, opportunity_id, student_id, application_status, submitted_at, updated_at } } }
- Errors: 400 (validation), 401, 404, 409 (duplicate application), 500

## GET /api/student/freelancing/applications
- Auth required: Yes (Student)
- Query parameters: status, page, limit
- Success: 200 { data: { applications: [...], pagination: {...} } }
- Errors: 401, 500

## GET /api/student/freelancing/applications/{applicationId}
- Auth required: Yes (Student)
- Path parameters: applicationId
- Success: 200 { data: { application: {...} } }
- Errors: 401, 404, 500

## PUT /api/student/freelancing/applications/{applicationId}
- Auth required: Yes (Student)
- Path parameters: applicationId
- Request body: { resume_url: string, cover_letter: string, portfolio_url: string, availability: string, joining_date: string }
- Success: 200 { data: { application: {...} } }
- Errors: 400, 401, 403 (cannot edit submitted), 404, 500

## POST /api/student/freelancing/applications/upload-resume
- Auth required: Yes (Student)
- Request type: multipart/form-data
- Form field: resume (file)
- Success: 200 { data: { file_url: string, file_name: string } }
- Errors: 400, 401, 500

## POST /api/student/freelancing/applications/upload-document
- Auth required: Yes (Student)
- Request type: multipart/form-data
- Form field: document (file)
- Request form fields: document_type (string, required)
- Success: 200 { data: { document_id: string, file_url: string, file_name: string } }
- Errors: 400, 401, 500

## POST /api/student/freelancing/applications/{applicationId}/submit
- Auth required: Yes (Student)
- Path parameters: applicationId
- Success: 200 { data: { application: {...} }, message: "Application submitted successfully" }
- Errors: 400 (validation failed), 401, 403, 404, 500

## DELETE /api/student/freelancing/applications/{applicationId}/withdraw
- Auth required: Yes (Student)
- Path parameters: applicationId
- Success: 200 { message: "Application withdrawn successfully" }
- Errors: 400, 401, 403, 404, 500
