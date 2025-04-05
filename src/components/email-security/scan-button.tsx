'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'
import { useRouter } from 'next/navigation'

export function ScanButton() {
  const [isScanning, setIsScanning] = useState(false)
  const router = useRouter()

  const handleScan = async () => {
    try {
      setIsScanning(true)
      const response = await fetch('/api/email-scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error('Failed to start scan')
      }

      const data = await response.json()
      router.refresh() // Refresh the page to show new scan results
    } catch (error) {
      console.error('Error starting scan:', error)
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
