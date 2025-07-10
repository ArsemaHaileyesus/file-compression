"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Modal {
  id: string
  title: string
  content: ReactNode
  size?: "sm" | "md" | "lg" | "xl"
}

interface ModalContextType {
  modals: Modal[]
  openModal: (modal: Omit<Modal, "id">) => string
  closeModal: (id: string) => void
  closeAllModals: () => void
}

const ModalContext = createContext<ModalContextType | undefined>(undefined)

export function useModal() {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider")
  }
  return context
}

export function ModalProvider({ children }: { children: ReactNode }) {
  const [modals, setModals] = useState<Modal[]>([])

  const openModal = (modal: Omit<Modal, "id">) => {
    const id = Math.random().toString(36).substr(2, 9)
    setModals((prev) => [...prev, { ...modal, id }])
    return id
  }

  const closeModal = (id: string) => {
    setModals((prev) => prev.filter((modal) => modal.id !== id))
  }

  const closeAllModals = () => {
    setModals([])
  }

  const getSizeClass = (size?: string) => {
    switch (size) {
      case "sm":
        return "max-w-md"
      case "lg":
        return "max-w-4xl"
      case "xl":
        return "max-w-6xl"
      default:
        return "max-w-2xl"
    }
  }

  return (
    <ModalContext.Provider value={{ modals, openModal, closeModal, closeAllModals }}>
      {children}
      {modals.map((modal, index) => (
        <Dialog key={modal.id} open={true} onOpenChange={() => closeModal(modal.id)}>
          <DialogContent
            className={`${getSizeClass(modal.size)} z-[${1000 + index * 10}]`}
            style={{ zIndex: 1000 + index * 10 }}
          >
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                {modal.title}
                <Button variant="ghost" size="icon" onClick={() => closeModal(modal.id)} className="h-6 w-6">
                  <X className="h-4 w-4" />
                </Button>
              </DialogTitle>
            </DialogHeader>
            {modal.content}
          </DialogContent>
        </Dialog>
      ))}
    </ModalContext.Provider>
  )
}
