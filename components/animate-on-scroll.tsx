"use client"

import { useEffect, useRef, useState } from "react"

type AnimationType =
  | "fade-up"
  | "fade-down"
  | "fade-left"
  | "fade-right"
  | "fade-in"
  | "zoom-in"

interface AnimateOnScrollProps {
  children: React.ReactNode
  animation?: AnimationType
  delay?: number        // ms
  duration?: number     // ms
  threshold?: number    // 0–1, how much of element must be visible
  className?: string
  once?: boolean        // animate only once (default true)
}

export default function AnimateOnScroll({
  children,
  animation = "fade-up",
  delay = 0,
  duration = 600,
  threshold = 0.15,
  className = "",
  once = true,
}: AnimateOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          if (once) observer.unobserve(el)
        } else if (!once) {
          setVisible(false)
        }
      },
      { threshold }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [once, threshold])

  const baseStyle: React.CSSProperties = {
    transitionDuration: `${duration}ms`,
    transitionDelay: `${delay}ms`,
    transitionTimingFunction: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    transitionProperty: "opacity, transform",
    willChange: "opacity, transform",
  }

  const hiddenStyles: Record<AnimationType, React.CSSProperties> = {
    "fade-up":    { opacity: 0, transform: "translateY(40px)" },
    "fade-down":  { opacity: 0, transform: "translateY(-40px)" },
    "fade-left":  { opacity: 0, transform: "translateX(40px)" },
    "fade-right": { opacity: 0, transform: "translateX(-40px)" },
    "fade-in":    { opacity: 0 },
    "zoom-in":    { opacity: 0, transform: "scale(0.92)" },
  }

  const visibleStyle: React.CSSProperties = {
    opacity: 1,
    transform: "translate(0,0) scale(1)",
  }

  const currentStyle = {
    ...baseStyle,
    ...(visible ? visibleStyle : hiddenStyles[animation]),
  }

  return (
    <div ref={ref} style={currentStyle} className={className}>
      {children}
    </div>
  )
}
