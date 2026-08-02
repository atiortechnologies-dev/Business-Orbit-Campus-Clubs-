#!/bin/bash
curl -s -c cookies.txt -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d '{"email":"admin@bocc.com","password":"admin@123"}' > /dev/null

echo "Testing /api/admin/users:"
curl -s -o /dev/null -w "%{http_code}\n" -b cookies.txt http://localhost:5000/api/admin/users

echo "Testing /api/admin/chapters:"
curl -s -o /dev/null -w "%{http_code}\n" -b cookies.txt http://localhost:5000/api/admin/chapters
