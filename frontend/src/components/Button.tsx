import { forwardRef, type ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'inverse' | 'text' | 'ghost-light' | 'outline-light';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: 'md' | 'lg';
  block?: boolean;
}

const VARIANT_CLASS: Record<Variant, string> = {
  primary: 'btn--primary',
  inverse: 'btn--inverse',
  text: 'btn--text',
  'ghost-light': 'btn--ghost-light',
  'outline-light': 'btn--outline-light',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', block = false, className = '', type = 'button', ...rest },
  ref,
) {
  const classes = [
    'btn',
    VARIANT_CLASS[variant],
    size === 'lg' ? 'btn--lg' : '',
    block ? 'btn--block' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <button ref={ref} type={type} className={classes} {...rest} />;
});