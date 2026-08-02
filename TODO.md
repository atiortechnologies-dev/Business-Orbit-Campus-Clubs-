# Pending Implementation Tasks (TODO)

This document tracks unimplemented features, mocked data endpoints, and pending system integrations across the application. 

## 1. Investor Capital (Admin Dashboard)
- **Problem**: The dashboard currently returns a hardcoded `$24.8M` for total investor capital in `adminDashboard.controller.js`. The database lacks a consolidated tracking mechanism for aggregate funding across the platform.
- **Recommended Solution**: Introduce a `FundingRound` or `InvestmentTransaction` schema. Update the `/api/admin/overview` endpoint to execute an aggregation pipeline using `$sum` on deployed capital, and remove the hardcoded string.

## 2. System Integrity Metric
- **Problem**: The `Admin.jsx` UI statically renders `99.98%` uptime. There is no active health-checking service or infrastructure monitoring endpoint.
- **Recommended Solution**: Implement a dedicated `/api/admin/system-health` endpoint. Integrate a lightweight monitoring library (like `os-utils`) or hook into your deployment's metrics API (e.g., AWS CloudWatch or PM2) to return live uptime and memory usage.

## 3. Upcoming Cycle & Calendar Events
- **Problem**: The dashboard contains a static event (`Investor Showcase Review — Tomorrow, 10:30 AM`). The backend does not currently serve admin-specific calendar events.
- **Recommended Solution**: Create a generic `Event` schema (or expand the existing `ChapterEvent`) that supports an `admin_visible` flag. Build a `/api/admin/calendar/upcoming` endpoint to fetch the next 5 chronological events and wire it to the frontend calendar module.

## 4. Monthly Funnel View Data
- **Problem**: The backend (`getOverview`) accurately aggregates `Daily` funnel views based on active startup stages, but intentionally fakes the `Monthly` data using a math multiplier (`item.count * 4 + random`). Historical snapshotting is missing.
- **Recommended Solution**: Implement a daily cron job that snapshots the `Startup` stage counts into a time-series collection (e.g., `PlatformAnalytics`). Modify the overview controller to query this collection for true monthly historical data.

## 5. Demographic Map
- **Problem**: The user distribution map in `Admin.jsx` is wrapped in a `<ComingSoon>` placeholder. 
- **Recommended Solution**: Ensure the `User` schema captures geolocation data (City/Country) upon registration. Integrate a mapping library like `react-simple-maps` or `leaflet`, and expose an endpoint returning clustered coordinate data for the userbase.
