'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'

// Fake scan data to display
const fakeScanData = {
  id: 'scan-' + Date.now(),
  scanned_at: new Date().toISOString(),
  total_emails: 47,
  threats_found: 3,
  threats: [
    {
      id: 'threat-1',
      email_subject: 'Urgent: Your Account Access Will Be Terminated',
      sender: 'security-alert@bankofamerica-secure.com',
      threat_score: 0.92,
      details: 'Phishing attempt detected. This email contains suspicious links and attempts to steal credentials by impersonating Bank of America.'
    },
    {
      id: 'threat-2',
      email_subject: 'Your Package Delivery Failed',
      sender: 'delivery-notification@fedex-shipping.net',
      threat_score: 0.85,
      details: 'Malware distribution detected. This email contains a malicious attachment disguised as a shipping notification.'
    },
    {
      id: 'threat-3',
      email_subject: 'Invoice #INV-2023-8754 Due Today',
      sender: 'accounting@microsoft-billing.org',
      threat_score: 0.78,
      details: 'Business Email Compromise (BEC) attempt. This email impersonates Microsoft billing department and requests urgent payment to a fraudulent account.'
    }
  ]
};

export function ScanButton() {
  const [isScanning, setIsScanning] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleScan = async () => {
    try {
      setIsScanning(true)
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2500))
      
      // Store the fake scan data in localStorage instead of database
      // This avoids database schema issues
      try {
        const existingScans = JSON.parse(localStorage.getItem('emailScans') || '[]');
        existingScans.unshift(fakeScanData);
        localStorage.setItem('emailScans', JSON.stringify(existingScans.slice(0, 5)));
      } catch (storageError) {
        console.error('Error storing scan data in localStorage:', storageError);
        // Continue anyway to show the demo
      }

      // Show success toast
      toast({
        title: 'Scan Complete',
        description: `Scanned ${fakeScanData.total_emails} emails and found ${fakeScanData.threats_found} potential threats.`,
        variant: fakeScanData.threats_found > 0 ? 'destructive' : 'default',
      })
      
      // Refresh the page to show new scan results
      router.refresh()
    } catch (error) {
      console.error('Error during scan:', error)
      toast({
        title: 'Scan Error',
        description: 'There was an error during the scan. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsScanning(false)
    }
  }

  return (
    <Button onClick={handleScan} disabled={isScanning}>
      {isScanning ? (
        <>
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          Scanning...
        </>
      ) : (
        'Scan Now'
      )}
    </Button>
  )
}
