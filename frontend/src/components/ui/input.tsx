import { InputHTMLAttributes, forwardRef } from "react"

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string
  label?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", error, label, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label 
            htmlFor={id} 
            className="block text-sm font-medium text-derive-grey mb-1"
          >
            {label}
          </label>
        )}
        <input
          id={id}
          className={`input w-full ${error ? 'border-derive-bright-red focus:ring-derive-bright-red' : ''} ${className}`}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-derive-bright-red">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = "Input"

export interface FormFieldProps {
  label?: string
  error?: string
  className?: string
  children: React.ReactNode
  required?: boolean
  description?: string
}

export function FormField({
  label,
  error,
  className = "",
  children,
  required = false,
  description,
}: FormFieldProps) {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-derive-grey">
          {label}
          {required && <span className="text-derive-bright-red ml-1">*</span>}
        </label>
      )}
      {description && (
        <p className="text-xs text-gray-500">{description}</p>
      )}
      {children}
      {error && (
        <p className="text-sm text-derive-bright-red">{error}</p>
      )}
    </div>
  )
} 