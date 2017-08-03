#!/bin/bash
npm install --production
. ./deploy.env
NODE_ENV=production node backend/app.server.js 
