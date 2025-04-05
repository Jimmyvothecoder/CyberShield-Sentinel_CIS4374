'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Icons } from '@/components/ui/icons'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

const mockResponses = {
  'help': 'I can help you with email security, malware scanning, and network monitoring. What would you like to know?',
  'email': 'Our email security feature scans your emails for phishing attempts, suspicious links, and malicious attachments.',
  'malware': 'The malware scanner checks files for viruses, trojans, and other malicious code. Simply upload a file to get started.',
  'network': 'Network monitoring tracks your network traffic and alerts you of any suspicious activity or potential threats.',
  'default': 'I\'m your CyberShield AI assistant. I can help you understand security threats and protect your systems.'
}

export function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hi! I\'m your CyberShield AI assistant. How can I help you today?'
    }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const response = getResponse(input.toLowerCase())
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response
      }
      setMessages(prev => [...prev, assistantMessage])
      setIsTyping(false)
    }, 1000)
  }

  const getResponse = (input: string): string => {
    if (input.includes('help')) return mockResponses.help
    if (input.includes('email')) return mockResponses.email
    if (input.includes('malware')) return mockResponses.malware
    if (input.includes('network')) return mockResponses.network
    return mockResponses.default
  }

  return (
    <Card className="fixed bottom-4 right-4 w-96 h-[500px] flex flex-col shadow-lg">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2">
          <Icons.shield className="h-5 w-5" />
          AI Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto p-4 space-y-4">
        <div className="space-y-4">
          {messages.map(message => (
            <div
              key={message.id}
              className={cn(
                'flex w-max max-w-[80%] rounded-lg px-3 py-2',
                message.role === 'user'
                  ? 'ml-auto bg-primary text-primary-foreground'
                  : 'bg-muted'
              )}
            >
              {message.content}
            </div>
          ))}
          {isTyping && (
            <div className="flex items-center gap-2 text-muted-foreground w-max rounded-lg px-3 py-2 bg-muted">
              <Icons.spinner className="h-4 w-4 animate-spin" />
              Typing...
            </div>
          )}
        </div>
      </CardContent>
      <div className="p-4 border-t">
        <form
          onSubmit={e => {
            e.preventDefault()
            handleSend()
          }}
          className="flex gap-2"
        >
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button type="submit" size="icon">
            <Icons.arrowRight className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </Card>
  )
}
