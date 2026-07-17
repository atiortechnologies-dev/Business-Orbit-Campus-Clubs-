# Narrative Test Report

This document is a plain-language walkthrough that mirrors the integration test suite in execution order. Each section represents a distinct user journey.

## User Onboarding

**Scene 1: Valid Registration**
A student opens the signup form and submits a valid registration request.
*   **Request Payload**: 
    ```json
    {
      "role": "student",
      "full_name": "John Doe",
      "email": "john@example.com",
      "password": "Password123!",
      "confirm_password": "Password123!",
      "college": "Test University",
      "degree": "B.Tech",
      "graduation_year": 2025
    }
    ```
*   **API Response**: `201 Created`
    ```json
    {
      "success": true,
      "message": "Registration successful. Please verify your email.",
      "data": {
        "userId": "6a5a836e077fee045a8186a7",
        "role": "student",
        "redirect_to": "welcome_to_your_chapter"
      }
    }
    ```
*   **Resulting DB State**:
    ```json
    {
      "user": {
        "email": "john@example.com",
        "role": "student",
        "account_status": "pending_verification",
        "email_verified": false
      },
      "profileCreated": false,
      "otpCreated": true
    }
    ```

**Scene 2: Invalid Registration**
A student submits an invalid email and missing required fields.
*   **Request Payload**: 
    ```json
    {
      "role": "student",
      "email": "not-an-email"
    }
    ```
*   **API Response**: `400 Bad Request`
    ```json
    {
      "success": false,
      "message": "Validation failed",
      "errors": [
        { "field": "full_name", "message": "Invalid input: expected string, received undefined" },
        { "field": "email", "message": "Invalid email format" },
        { "field": "password", "message": "Invalid input: expected string, received undefined" },
        { "field": "confirm_password", "message": "Invalid input: expected string, received undefined" },
        { "field": "college", "message": "Invalid input: expected string, received undefined" },
        { "field": "degree", "message": "Invalid input: expected string, received undefined" },
        { "field": "graduation_year", "message": "Invalid input: expected number, received NaN" }
      ]
    }
    ```
*   **Resulting DB State**:
    ```json
    {
      "usersCount": 0
    }
    ```

**Scene 3: OTP Verification**
The student receives an OTP and submits it to verify their account.
*   **Request Payload**: 
    ```json
    {
      "email": "jane@example.com",
      "otp": "123456"
    }
    ```
*   **API Response**: `200 OK`
    ```json
    {
      "success": true,
      "message": "Email verified successfully",
      "data": {
        "userId": "6a5a836f077fee045a8186aa",
        "role": "student",
        "token": "eyJhbGci...",
        "redirect_to": "/student-dashboard"
      }
    }
    ```
*   **Resulting DB State**:
    ```json
    {
      "user": {
        "email_verified": true,
        "account_status": "active"
      }
    }
    ```

> **Summary**: Verified that registration properly enforces validation rules, initializes a user, and successfully transitions their account to active upon OTP verification.

## User Login

**Scene 1: Verified Login**
The verified student logs into the platform.
*   **Request Payload**: 
    ```json
    {
      "email": "bob@example.com",
      "password": "Password123!"
    }
    ```
*   **API Response**: `200 OK`
    ```json
    {
      "success": true,
      "hasToken": true
    }
    ```

**Scene 2: Unverified Login**
A user attempts to log in before verifying their email.
*   **Request Payload**: 
    ```json
    {
      "email": "alice@example.com",
      "password": "Password123!"
    }
    ```
*   **API Response**: `403 Forbidden`
    ```json
    {
      "success": false,
      "message": "Please verify your email"
    }
    ```

> **Summary**: Verified that the login endpoint properly authenticates verified users while successfully blocking accounts that are still pending email verification.

## Content Management

**Scene 1: Unauthorized Admin Access**
An unauthorized user attempts to create an FAQ without an API key.
*   **Request Payload**: 
    ```json
    {
      "question": "What?",
      "answer": "This",
      "pageType": "Student"
    }
    ```
*   **API Response**: `401 Unauthorized`
    ```json
    {
      "success": false,
      "message": "Unauthorized: Invalid or missing Admin API Key"
    }
    ```
*   **Resulting DB State**:
    ```json
    {
      "faqsCount": 0
    }
    ```

**Scene 2: Valid Admin Access**
An admin submits a valid FAQ creation request.
*   **Request Payload**: 
    ```json
    {
      "question": "What is Business Orbit?",
      "answer": "A club",
      "pageType": "Student"
    }
    ```
*   **API Response**: `201 Created`
    ```json
    {
      "success": true,
      "data": {
        "question": "What is Business Orbit?",
        "answer": "A club",
        "pageType": "Student",
        "_id": "6a5a8371077fee045a8186b3",
        "createdAt": "2026-07-17T19:33:05.285Z",
        "updatedAt": "2026-07-17T19:33:05.285Z",
        "__v": 0
      }
    }
    ```
*   **Resulting DB State**:
    ```json
    {
      "faqDoc": {
        "question": "What is Business Orbit?",
        "pageType": "Student"
      }
    }
    ```

> **Summary**: Verified that admin routes securely block requests missing the API key, and successfully parse valid payloads into database documents.

## Browsing Landing Pages

**Scene 1: Reading Content**
A student visits the landing page to view FAQs.
*   **Request Payload**: 
    ```json
    {
      "query": {
        "pageType": "Student"
      }
    }
    ```
*   **API Response**: `200 OK`
    ```json
    {
      "success": true,
      "count": 1
    }
    ```
*   **Resulting DB State**: *Read-only.*

> **Summary**: Verified that public endpoints correctly handle filtering queries to retrieve landing page specific content.

## Public Enquiry

**Scene 1: Submitting a Form**
A visitor submits a partnership enquiry form.
*   **Request Payload**: 
    ```json
    {
      "companyName": "Test Corp",
      "contactPerson": "Mr. Test",
      "email": "test@corp.com",
      "message": "I want to partner with Business Orbit"
    }
    ```
*   **API Response**: `201 Created`
    ```json
    {
      "success": true,
      "message": "Enquiry submitted successfully",
      "data": {
        "companyName": "Test Corp",
        "contactPerson": "Mr. Test",
        "email": "test@corp.com",
        "message": "I want to partner with Business Orbit",
        "_id": "6a5a8371077fee045a8186b5",
        "createdAt": "2026-07-17T19:33:05.668Z",
        "updatedAt": "2026-07-17T19:33:05.668Z",
        "__v": 0
      }
    }
    ```
*   **Resulting DB State**:
    ```json
    {
      "enquiryDoc": {
        "companyName": "Test Corp",
        "status": "Pending"
      }
    }
    ```

> **Summary**: Verified that external users can successfully submit forms which are securely stored as pending documents.
