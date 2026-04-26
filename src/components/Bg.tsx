import { type ReactNode } from "react"

type BgProps = {
  image: string
  children: ReactNode
  className?: string
}

const Bg = ({ image, children, className = "" }: BgProps) => {
  return (
    <div className={`relative z-0 ${className}`}>
      <div className="h-full w-full absolute top-0 left-0 -z-10">
        <img src={image} className="h-full w-full object-cover opacity-15" />
      </div>
      {children}
    </div>
  )
}

export default Bg
