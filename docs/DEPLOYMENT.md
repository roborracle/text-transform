# Text Transform - Production Deployment Checklist

**Version:** 1.0.0
**Target Platform:** Railway / Vercel / Similar

---

## Pre-Deployment Checklist

### 1. Code Quality
- [ ] All TypeScript errors resolved (`npm run build`)
- [ ] ESLint passes with no errors (`npm run lint`)
- [ ] All tests passing (`npm test`)
- [ ] No `console.log` statements in production code
- [ ] No hardcoded development URLs

### 2. Environment Variables
```bash
# Required
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://texttransform.dev

# Optional - Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Optional - Rate Limiting (defaults work for most cases)
RATE_LIMIT_STANDARD=100
RATE_LIMIT_GENEROUS=300
```

### 3. Build Verification
```bash
# Clean install and build
rm -rf node_modules .next
npm ci
npm run build

# Verify output
# Expected: 118 static pages, 4 API routes
```

---

## Deployment Steps

### Railway Deployment

1. **Connect Repository**
   ```bash
   # Ensure clean git state
   git status
   git push origin main
   ```

2. **Configure Railway Project**
   - Create new project from GitHub repo
   - Set build command: `npm run build`
   - Set start command: `npm start`
   - Add environment variables

3. **Custom Domain**
   - Add `texttransform.dev` in Railway settings
   - Configure DNS with CNAME record
   - Wait for SSL certificate provisioning

### Vercel Deployment (Alternative)

1. **Connect Repository**
   - Import from GitHub
   - Framework preset: Next.js (auto-detected)

2. **Configure**
   - Build command: `npm run build`
   - Output directory: `.next`
   - Add environment variables

---

## Post-Deployment Verification

### 1. Core Functionality
- [ ] Homepage loads correctly
- [ ] All 8 category pages accessible
- [ ] Tool pages work (test one from each category)
- [ ] Dark mode toggle works
- [ ] Search (Cmd/Ctrl+K) works
- [ ] Copy to clipboard works

### 2. API Endpoints
```bash
# Health check
curl https://texttransform.dev/api/health

# List tools
curl https://texttransform.dev/api/tools

# Test transformation
curl -X POST https://texttransform.dev/api/transform/naming/camel \
  -H "Content-Type: application/json" \
  -d '{"input": "hello world"}'

# OpenAPI docs
curl https://texttransform.dev/api/docs
```

### 3. Performance
- [ ] Lighthouse Performance > 90
- [ ] Lighthouse Accessibility > 90
- [ ] Lighthouse Best Practices > 90
- [ ] Lighthouse SEO > 90
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3s

### 4. SEO
- [ ] Sitemap accessible at /sitemap.xml
- [ ] robots.txt accessible at /robots.txt
- [ ] Meta tags render correctly (use social card validators)
- [ ] Submit sitemap to Google Search Console

---

## Monitoring

### Recommended Services
- **Uptime:** UptimeRobot, Pingdom, or similar
- **Analytics:** Google Analytics 4 (optional, respects DNT)
- **Error Tracking:** Sentry (optional)

### Health Check Endpoint
```
GET /api/health

Response:
{
  "status": "healthy",
  "timestamp": "2026-01-20T12:00:00.000Z",
  "version": "1.0.0"
}
```

---

## Rollback Procedure

If deployment fails or critical issues are found:

1. **Railway**
   - Use Railway dashboard to roll back to previous deployment
   - Or push revert commit to trigger new deployment

2. **Manual Rollback**
   ```bash
   git revert HEAD
   git push origin main
   ```

---

## Security Checklist

- [ ] HTTPS enforced (automatic with Railway/Vercel)
- [ ] No sensitive data in client-side code
- [ ] Rate limiting active on API endpoints
- [ ] CSP headers configured
- [ ] No exposed API keys or secrets

---

## CLI Distribution (Optional)

To publish the CLI tool to npm:

```bash
# Ensure logged in to npm
npm login

# Publish
npm publish

# Users can then install globally
npm install -g text-transform
txtx --help
```

---

## Browser Extension (Optional)

To publish to Chrome Web Store:

1. Create ZIP of `extension/` directory
2. Go to Chrome Web Store Developer Dashboard
3. Create new item and upload ZIP
4. Fill in store listing details
5. Submit for review

---

## Final Steps

- [ ] Update DNS records
- [ ] Verify SSL certificate
- [ ] Test all critical user flows
- [ ] Monitor error rates for first 24 hours
- [ ] Announce launch!

---

*Deployment checklist for Text Transform v1.0.0*
