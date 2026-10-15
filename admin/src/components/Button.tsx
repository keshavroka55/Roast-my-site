import { forwardRef, type ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'outline' | 'danger';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: 'sm' | 'md';
}

const VARIANT: Record<Variant, string> = {
  primary: 'btn--primary',
  outline: 'btn--outline',
  danger: 'btn--danger',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', className = '', type = 'button', ...rest },
  ref,
) {
  const classes = ['btn', VARIANT[variant], size === 'sm' ? 'btn--sm' : '', className].filter(Boolean).join(' ');
  return <button ref={ref} type={type} className={classes} {...rest} />;
});