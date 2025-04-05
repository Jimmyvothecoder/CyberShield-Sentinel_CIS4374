# App Blueprint: CyberShield Sentinel

## 1. Project Breakdown

**App Name:** CyberShield Sentinel  
**Platform:** Web application (responsive design)  
**Summary:** CyberShield Sentinel is an all-in-one cybersecurity solution for small businesses and individuals that provides automated protection against phishing, malware, and network threats. The app simplifies enterprise-grade security through an intuitive interface and AI-powered scanning, requiring no technical expertise from users.  

**Primary Use Case:**  
- Small business owners without dedicated IT staff  
- Freelancers handling sensitive client data  
- Remote teams needing simple security solutions  

**Authentication Requirements:**  
- Email/password authentication  
- Google OAuth (via Supabase)  
- Microsoft OAuth (via Supabase)  
- Session management with JWT tokens  

## 2. Tech Stack Overview

**Frontend:**  
- React + Next.js (App Router)  
- TypeScript for type safety  
- Server Components for initial load performance  

**UI Layer:**  
- Tailwind CSS for utility-first styling  
- ShadCN for accessible, pre-built components  
- Radix UI primitives for headless component logic  

**Backend Services:**  
- Supabase for:  
  - PostgreSQL database  
  - Authentication  
  - Real-time threat alerts  
  - File storage (for malware scans)  

**Deployment:**  
- Vercel for:  
  - Next.js optimized hosting  
  - Serverless function execution  
  - Edge network caching  

## 3. Core Features

**1. Email Security Module**  
- OAuth integration with Gmail/Outlook  
- IMAP configuration for custom domains  
- Real-time phishing detection (Supabase triggers)  
- Historical email scan (Next.js API route processing)  

**2. Malware Analysis**  
- Drag-and-drop file scanning UI (ShadCN upload component)  
- Desktop agent installer (EXE/MSI for Windows, bash for Mac/Linux)  
- Real-time scan results via Supabase subscriptions  

**3. Network Monitoring**  
- IP-based threat detection  
- Device fingerprinting  
- Traffic heatmaps (using Chart.js with Tailwind styling)  

**4. AI Security Assistant**  
- In-app chat interface (Supabase vector embeddings)  
- Threat explanation cards  
- Actionable remediation steps  

**5. Reporting Dashboard**  
- Weekly threat summaries  
- Interactive data visualizations  
- Exportable PDF reports (generated via Next.js API routes)  

## 4. User Flow

1. **Landing Page (Next.js static page)**  
   - Hero section with CTA ("Start Free Trial")  
   - Trust indicators (logos, testimonials)  

2. **Authentication (Supabase auth)**  
   - Signup modal with email/OAuth options  
   - Post-signup redirect to onboarding flow  

3. **Guided Onboarding (Multi-step form)**  
   - Progress indicator (ShadCN component)  
   - Email connection (OAuth popup → Supabase session)  
   - Optional malware agent download  
   - Network scan configuration  

4. **Main Dashboard**  
   - Real-time threat status cards  
   - Navigation sidebar (ShadCN)  
   - Quick action buttons  

5. **Threat Investigation**  
   - Email thread viewer  
   - Malware analysis reports  
   - Network activity timelines  

## 5. Design Guidelines

**Visual Style:**  
- Color Palette:  
  - Primary: Indigo-600 (security/trust)  
  - Danger: Rose-500 (alerts)  
  - Success: Emerald-500 (all-clear)  

**Typography:**  
- Headings: Inter (semi-bold)  
- Body: Inter (regular)  
- Code: JetBrains Mono  

**UI Components (ShadCN):**  
- Customized card components for threat displays  
- Animated progress bars for scans  
- Toast notifications for alerts  

**Accessibility:**  
- WCAG AA compliance  
- Keyboard navigable interface  
- Reduced motion preferences respected  

## 6. Technical Implementation

**1. Authentication Flow**  
```typescript
// Using Supabase auth helpers for Next.js
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Google OAuth handler
const handleGoogleLogin = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: '/onboarding' }
  })
  if (error) showToast(error.message)
}
```

**2. Real-time Threat Updates**  
```typescript
// Supabase channel subscription
const threatsChannel = supabase
  .channel('threat_updates')
  .on(
    'postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'threats' },
    (payload) => updateDashboard(payload.new)
  )
  .subscribe()
```

**3. File Scanning API**  
```typescript
// Next.js API route
export async function POST(req: Request) {
  const formData = await req.formData()
  const file = formData.get('file') as File
  
  // Store in Supabase storage
  const { data, error } = await supabase.storage
    .from('malware-scans')
    .upload(`user/${userId}/${file.name}`, file)

  // Process scan (mock implementation)
  return NextResponse.json({ 
    status: 'clean', 
    details: 'No threats detected' 
  })
}
```

**4. Dashboard Layout**  
```tsx
// Using ShadCN components
<Card>
  <CardHeader>
    <CardTitle>Email Protection</CardTitle>
    <CardDescription>Last scan: 5 minutes ago</CardDescription>
  </CardHeader>
  <CardContent>
    <Progress value={scanProgress} />
    <ThreatList threats={threats} />
  </CardContent>
</Card>
```

## 7. Development Setup

**Requirements:**  
- Node.js 18+  
- Supabase account  
- Vercel account  

**Setup Instructions:**  

1. Clone repository:  
   ```bash
   git clone https://github.com/yourrepo/cybershield-sentinel.git
   cd cybershield-sentinel
   ```

2. Install dependencies:  
   ```bash
   npm install
   ```

3. Configure environment:  
   ```bash
   cp .env.example .env.local
   # Fill in Supabase and Next.js vars
   ```

4. Database setup:  
   - Run Supabase migration scripts  
   - Enable Row Level Security  
   - Configure storage buckets  

5. Development:  
   ```bash
   npm run dev
   ```

6. Deployment:  
   - Connect Vercel to GitHub repo  
   - Set environment variables  
   - Enable Edge Functions  

**Recommended VSCode Extensions:**  
- Tailwind CSS IntelliSense  
- Supabase Toolkit  
- Next.js Snippets  

This blueprint provides a comprehensive foundation for implementing CyberShield Sentinel using only the specified tech stack while addressing all functional requirements through modern web development patterns.