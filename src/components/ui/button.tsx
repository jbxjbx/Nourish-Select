import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-black uppercase tracking-wide transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:scale-[1.05] active:scale-[0.95] shadow-stark hover:shadow-stark-hover active:shadow-stark-active",
  {
    variants: {
      variant: {
        default: "bg-black text-white hover:bg-stone-900 border-2 border-black",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90",
        outline:
          "border-2 border-black bg-white text-black hover:bg-stone-100",
        secondary:
          "bg-stone-200 text-stone-900 hover:bg-stone-300",
        ghost:
          "hover:bg-accent hover:text-accent-foreground shadow-none hover:shadow-none translate-0",
        link: "text-primary underline-offset-4 hover:underline shadow-none py-0 h-auto",
        neon: "bg-primary text-black border-2 border-primary hover:bg-primary/90 hover:border-primary",
        punk: "bg-gradient-to-r from-pink-600 to-purple-600 text-white border-none",
      },
      size: {
        default: "h-11 px-6 py-2 has-[>svg]:px-4",
        sm: "h-9 rounded-full px-4 text-xs",
        lg: "h-14 rounded-full px-8 text-base",
        icon: "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
