import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center gap-1 whitespace-nowrap border px-2 py-0.5 text-[11px] font-semibold uppercase leading-4 tracking-[0.08em] [&>svg]:size-3",
  {
    variants: {
      variant: {
        default: "border-[var(--color-neutral-900)] bg-[var(--color-neutral-900)] text-[var(--color-bg)]",
        outline: "border-[var(--color-divider)] bg-transparent text-[var(--color-text-muted)]",
        accent: "border-[var(--color-accent)] bg-transparent text-[var(--color-accent-700)]",
      },
    },
    defaultVariants: { variant: "outline" },
  }
)

function Badge({
  className,
  variant = "outline",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
