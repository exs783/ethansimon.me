import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/*
 * shadcn Button, restyled for ethansimon.me: flat, zero radius, ruled edges, one accent for focus.
 * Colors carry "!" because the site's own stylesheet is unlayered and would otherwise win on anchors.
 */
const buttonVariants = cva(
  "inline-flex shrink-0 cursor-pointer select-none items-center justify-center gap-2 whitespace-nowrap border font-semibold no-underline outline-none transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "border-[var(--color-neutral-900)] bg-[var(--color-neutral-900)] text-[var(--color-bg)]! hover:bg-black hover:text-[var(--color-bg)]!",
        outline:
          "border-[var(--color-neutral-900)] bg-transparent text-[var(--color-text)]! hover:bg-[var(--color-surface)] hover:text-[var(--color-text)]!",
        subtle:
          "border-[var(--color-divider)] bg-transparent text-[var(--color-text)]! hover:border-[var(--color-neutral-900)] hover:text-[var(--color-text)]!",
        light:
          "border-[var(--color-bg)] bg-[var(--color-bg)] text-[var(--color-neutral-900)]! hover:bg-[var(--color-neutral-200)] hover:text-[var(--color-neutral-900)]!",
        ghostLight:
          "border-[color-mix(in_srgb,var(--color-bg)_60%,transparent)] bg-transparent text-[var(--color-bg)]! hover:border-[var(--color-bg)] hover:bg-[color-mix(in_srgb,var(--color-bg)_12%,transparent)] hover:text-[var(--color-bg)]!",
        ghost:
          "border-transparent bg-transparent text-[var(--color-text)]! hover:bg-[var(--color-surface)] hover:text-[var(--color-text)]!",
      },
      size: {
        default: "min-h-[44px] px-4 text-[14px]",
        lg: "min-h-[48px] px-5 text-[15px]",
        icon: "size-11",
        "icon-sm": "size-9",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}

export { Button, buttonVariants }
