'use client'

import React, { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

// Type definitions
type RGB = {
  r: number
  g: number
  b: number
}

type HSL = {
  h: number
  s: number
  l: number
}

type ColorResult = {
  hex: string
  rgb: RGB
  hsl: HSL
}

interface ChromePickerProps {
  color?: string
  onChange?: (result: ColorResult) => void
  onChangeComplete?: (result: ColorResult) => void
  className?: string
}

// Color conversion utilities
const hexToRgb = (hex: string): RGB | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

const rgbToHex = ({ r, g, b }: RGB): string => {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }).join('')
}

const rgbToHsl = ({ r, g, b }: RGB): HSL => {
  r /= 255
  g /= 255
  b /= 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      case b: h = (r - g) / d + 4; break
    }
    h /= 6
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  }
}

const hslToRgb = ({ h, s, l }: HSL): RGB => {
  s /= 100
  l /= 100
  h /= 360

  let r: number, g: number, b: number

  if (s === 0) {
    r = g = b = l
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1/6) return p + (q - p) * 6 * t
      if (t < 1/2) return q
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
      return p
    }

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q

    r = hue2rgb(p, q, h + 1/3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1/3)
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  }
}

export const ChromePicker: React.FC<ChromePickerProps> = ({
  color = '#000000',
  onChange,
  onChangeComplete,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const pickerRef = useRef<HTMLDivElement>(null)
  const saturationRef = useRef<HTMLDivElement>(null)
  const hueRef = useRef<HTMLDivElement>(null)

  // Initialize all color states
  const [currentColor, setCurrentColor] = useState<ColorResult>(() => {
    const rgb = hexToRgb(color) || { r: 0, g: 0, b: 0 }
    const hsl = rgbToHsl(rgb)
    return { hex: color, rgb, hsl }
  })

  // Input value state
  const [inputValue, setInputValue] = useState(color)

  // Handle dragging state
  const [isDragging, setIsDragging] = useState<'hue' | 'saturation' | null>(null)

  useEffect(() => {
    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(null)
        onChangeComplete?.(currentColor)
      }
    }

    const handleMouseMove = (event: MouseEvent) => {
      if (!isDragging) return

      if (isDragging === 'hue' && hueRef.current) {
        const rect = hueRef.current.getBoundingClientRect()
        const x = Math.max(0, Math.min(event.clientX - rect.left, rect.width))
        const hue = Math.round((x / rect.width) * 360)
        updateColor({ ...currentColor.hsl, h: hue })
      } else if (isDragging === 'saturation' && saturationRef.current) {
        const rect = saturationRef.current.getBoundingClientRect()
        const x = Math.max(0, Math.min(event.clientX - rect.left, rect.width))
        const y = Math.max(0, Math.min(event.clientY - rect.top, rect.height))
        
        const s = Math.round((x / rect.width) * 100)
        const l = Math.round(100 - (y / rect.height) * 100)
        updateColor({ ...currentColor.hsl, s, l })
      }
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, currentColor, onChangeComplete])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

   // Update input value when color changes externally
   useEffect(() => {
    setInputValue(currentColor.hex)
  }, [currentColor.hex])

  const updateColor = (hsl: HSL) => {
    const rgb = hslToRgb(hsl)
    const hex = rgbToHex(rgb)
    const newColor = { hex, rgb, hsl }
    setCurrentColor(newColor)
    onChange?.(newColor)
  }

  const handleHexInput = (input: string) => {
    // Allow typing by updating the input value immediately
    setInputValue(input)

    // Remove any spaces and ensure '#' prefix
    let hex = input.trim()
    if (!hex.startsWith('#')) {
      hex = '#' + hex
    }

    // Convert to uppercase for consistency
    hex = hex.toUpperCase()

    // Check if it's a valid hex color
    if (/^#[0-9A-F]{6}$/i.test(hex)) {
      const rgb = hexToRgb(hex)!
      const hsl = rgbToHsl(rgb)
      const newColor = { hex, rgb, hsl }
      setCurrentColor(newColor)
      onChange?.(newColor)
    }
  }

  const renderHueSlider = () => {
    const hueGradient = Array.from({ length: 360 }, (_, i) => 
      `hsl(${i}, 100%, 50%)`
    ).join(',')

    return (
      <div 
        ref={hueRef}
        className="w-full h-4 rounded-full relative cursor-pointer"
        onMouseDown={(e) => {
          setIsDragging('hue')
          const rect = hueRef.current!.getBoundingClientRect()
          const x = e.clientX - rect.left
          const hue = Math.round((x / rect.width) * 360)
          updateColor({ ...currentColor.hsl, h: hue })
        }}
      >
        <div 
          className="absolute inset-0 rounded-full"
          style={{
            background: `linear-gradient(to right, ${hueGradient})`,
          }}
        >
          <div 
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full border shadow-md"
            style={{ left: `${(currentColor.hsl.h / 360) * 100}%` }}
          />
        </div>
      </div>
    )
  }

  const renderSaturationPicker = () => {
    return (
      <div 
        ref={saturationRef}
        className="w-full h-24 rounded-md relative cursor-pointer"
        style={{
          background: `linear-gradient(to right, white, hsl(${currentColor.hsl.h}, 100%, 50%))`
        }}
        onMouseDown={(e) => {
          setIsDragging('saturation')
          const rect = saturationRef.current!.getBoundingClientRect()
          const x = e.clientX - rect.left
          const y = e.clientY - rect.top
          const s = Math.round((x / rect.width) * 100)
          const l = Math.round(100 - (y / rect.height) * 100)
          updateColor({ ...currentColor.hsl, s, l })
        }}
      >
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to top, black, transparent)'
          }}
        >
          <div 
            className="absolute w-4 h-4 bg-white rounded-full border shadow-md -translate-x-1/2 -translate-y-1/2"
            style={{ 
              left: `${currentColor.hsl.s}%`, 
              top: `${100 - currentColor.hsl.l}%` 
            }}
          />
        </div>
      </div>
    )
  }

  return (
    <div ref={pickerRef} className={cn('relative w-64', className)}>
      <div 
        className="w-full h-10 rounded-md border flex items-center px-2 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
        style={{ backgroundColor: currentColor.hex }}
      >
        <span className={`text-sm ${currentColor.hsl.l > 50 ? 'text-black' : 'text-white'}`}>
          {currentColor.hex}
        </span>
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-64 p-4 bg-white border rounded-md shadow-lg">
          <div className="space-y-4">
            {renderHueSlider()}
            {renderSaturationPicker()}
            
            <div className="flex space-x-2">
            <input 
                type="text" 
                value={inputValue}
                className="flex-1 border rounded-md px-2 py-1"
                onChange={(e) => handleHexInput(e.target.value)}
                onBlur={() => {
                  // Restore valid color on blur if input is invalid
                  if (!/^#[0-9A-F]{6}$/i.test(inputValue)) {
                    setInputValue(currentColor.hex)
                  }
                }}
                spellCheck={false}
                />
              <button 
                className="bg-blue-500 text-white px-4 py-1 rounded-md"
                onClick={() => {
                  onChangeComplete?.(currentColor)
                  setIsOpen(false)
                }}
              >
                Select
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}