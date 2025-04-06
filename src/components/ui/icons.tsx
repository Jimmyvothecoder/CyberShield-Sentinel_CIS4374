"use client"

import { LucideIcon, LucideProps } from "lucide-react"
import {
  AlertCircle,
  Check,
  Loader2,
  Mail,
  Minimize,
  Maximize,
  Shield,
  Send,
  Upload,
  X,
  Network,
  File,
  TrendingUp,
  AlertTriangle,
  Loader,
  AtSign,
  Inbox,
  MailQuestion
} from "lucide-react"

export const Icons = {
  alert: AlertCircle,
  check: Check as LucideIcon,
  loader: Loader2,
  loading: Loader2,
  mail: Mail,
  shield: Shield,
  send: Send,
  upload: Upload,
  warning: AlertTriangle,
  close: X,
  network: Network,
  file: File,
  success: TrendingUp,
  spinner: Loader,
  minimize: Minimize,
  maximize: Maximize,
  // Email provider icons
  gmail: AtSign,
  outlook: Inbox,
  yahoo: MailQuestion
} as const
