import React from 'react';
const variantStyles = {
  primary: `bg-primary text-white border border-primary/50 hover:bg-primary/90 hover:border-primary hover:shadow-[0_0_24px_rgba(93,92,222,0.45)]`,
  ghost: `bg-transparent text-softText border border-white/10 hover:border-white/30 hover:text-white hover:bg-white/5`,
  accent: `bg-accent text-background font-semibold border border-accent/80 hover:bg-accent/90 hover:shadow-[0_0_24px_rgba(250,204,21,0.35)]`,
};
const sizeStyles = { sm: 'px-4 py-2 text-sm', md: 'px-6 py-3 text-base', lg: 'px-8 py-4 text-lg' };
export default function Button({ children, variant = 'primary', size = 'md', className = '', onClick, type = 'button', disabled = false }) {
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`inline-flex items-center justify-center gap-2 rounded-sm font-sans tracking-wide transition-all duration-300 ease-out disabled:opacity-40 disabled:cursor-not-allowed ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}>
      {children}
    </button>
  );
}
