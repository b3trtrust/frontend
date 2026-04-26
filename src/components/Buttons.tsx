import { type ButtonHTMLAttributes } from "react"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

export const PrimaryButton = ({ children, className = "", ...props }: ButtonProps) => (
  <button
    className={`bg-orange-500 text-white font-bold rounded-3xl p-4 px-9 cursor-pointer ${className}`}
    {...props}
  >
    {children}
  </button>
)

export const SecondaryButton = ({ children, className = "", ...props }: ButtonProps) => (
  <button
    className={`bg-black text-white border border-gray-500/50 rounded-3xl p-4 px-9 cursor-pointer ${className}`}
    {...props}
  >
    {children}
  </button>
)
