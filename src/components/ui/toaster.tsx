import { Toaster as SonnerToaster } from 'sonner'

export default function Toaster() {
  return (
    <SonnerToaster
      position="top-center"
      richColors
      closeButton
      toastOptions={{
        duration: 4000,
        classNames: {
          toast: 'font-sans',
          title: 'font-medium',
          description: 'text-sm',
        },
      }}
    />
  )
}
