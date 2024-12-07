"use client";

import React from 'react'

type DialogProviderProps = {
    children: React.ReactNode
}

const DialogProvider : React.FC<DialogProviderProps> = ({
    children
}) => {
    const [mounted, setMounted] = React.useState(false)
    React.useEffect(() => {
        setMounted(true)
    }, [])
    if (!mounted) return null
  return (
    <>
        {children}  
    </>
  )
}

export default DialogProvider