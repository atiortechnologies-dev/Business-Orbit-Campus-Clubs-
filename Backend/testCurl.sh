#!/bin/bash
# 1. Login to get tokens and save cookies
curl -s -c cookies.txt -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d '{"email":"admin@bocc.com","password":"admin@123"}' > /dev/null

# 2. Make request to /api/admin/overview using cookies and print headers/status
curl -s -i -b cookies.txt -X GET http://localhost:5000/api/admin/overview
