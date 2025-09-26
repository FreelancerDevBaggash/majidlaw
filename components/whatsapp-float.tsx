"use client"

import { Icons } from "./icons"
import { Button } from "@/components/ui/button"

export function WhatsAppFloat() {
  const handleWhatsAppClick = () => {
    const phoneNumber = "+967123456789" // Replace with actual number
    const message = "مرحباً، أود الحصول على استشارة قانونية"
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(url, "_blank")
  }

  return (
    <Button
      onClick={handleWhatsAppClick}
      className="whatsapp-float bg-green-500 hover:bg-green-600 text-white rounded-full w-14 h-14 shadow-lg"
      size="icon"
    >
      <div className="w-6 h-6">
        <Icons.MessageCircle />
      </div>
    </Button>
  )
}
