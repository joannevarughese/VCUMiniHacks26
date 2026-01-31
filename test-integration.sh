#!/bin/bash

echo "Testing AI Agent Integration..."
echo ""

# Test health endpoint
echo "1. Health Check:"
curl -s http://localhost:8000/health | python3 -m json.tool
echo ""
echo ""

# Test recipe generation
echo "2. Recipe Generation Test (pasta, tomato, cheese):"
curl -s -X POST http://localhost:8000/agent/recipes \
  -H "Content-Type: application/json" \
  -d '{"ingredients": ["pasta", "tomato", "cheese"]}' | python3 -m json.tool
echo ""
echo ""

echo "3. Full Stack Test (chicken, rice, vegetables):"
curl -s -X POST http://localhost:3001/api/recipes \
  -H "Content-Type: application/json" \
  -d '{"ingredients": ["chicken", "rice", "vegetables"]}' | python3 -m json.tool
