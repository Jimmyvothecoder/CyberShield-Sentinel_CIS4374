# CyberShield Sentinel

CyberShield Sentinel is a modern cybersecurity monitoring application designed to help users protect their digital assets through email security scanning, malware detection, and network monitoring.

![CyberShield Sentinel Logo](https://via.placeholder.com/150x150?text=CyberShield)

## Features

### User Authentication
- Secure sign-up and login functionality
- User session management with Supabase
- Protected routes for authenticated users

### Email Security
- Email scanning for phishing attempts and malicious content
- Detection of common email-based threats:
  - Phishing emails impersonating trusted organizations
  - Malware distribution via attachments
  - Business Email Compromise (BEC) attempts
- Visual threat scoring and detailed analysis
- Support for connecting multiple email providers

### Malware Scanner
- File scanning capabilities
- Threat detection and analysis
- Detailed reporting of potential security issues

### Network Monitor
- Network traffic analysis
- Anomaly detection
- Security event logging and alerting

## Technology Stack

- **Frontend**: Next.js, React, TypeScript
- **UI Components**: Custom components with responsive design
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Jimmyvothecoder/CyberShield-Sentinel_CIS4374.git
   cd cybershield-sentinel
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

1. **Sign Up/Login**: Create an account or log in with existing credentials
2. **Dashboard**: View your security overview and access different security modules
3. **Email Security**: Connect your email accounts and scan for threats
4. **Malware Scanner**: Upload files to scan for malicious content
5. **Network Monitor**: Monitor your network for suspicious activities

## Demo Data

The application includes demo data to showcase functionality without requiring actual email connections or file uploads. This allows you to explore the features and interface without setting up real security scanning.

## Project Structure

```
cybershield-sentinel/
├── public/             # Static assets
├── src/
│   ├── app/            # Next.js app router pages
│   ├── components/     # React components
│   │   ├── dashboard/  # Dashboard components
│   │   ├── email-security/ # Email security components
│   │   ├── malware-scanner/ # Malware scanner components
│   │   ├── network-monitor/ # Network monitor components
│   │   └── ui/         # UI components
│   ├── contexts/       # React contexts
│   ├── lib/            # Utility functions and types
│   └── types/          # TypeScript type definitions
├── .env.local          # Environment variables (create this file)
└── README.md           # Project documentation
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built for CIS 4374 course project
- Uses fake data for demonstration purposes
- Icons provided by Lucide React
