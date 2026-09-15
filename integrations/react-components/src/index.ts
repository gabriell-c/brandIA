import React from 'react';
import styled from 'styled-components';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: ButtonProps) => {
  const baseStyles = `
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-weight: 500;
    border-radius: 0.5rem;
    transition: all 0.2s ease;
    cursor: pointer;
    border: none;
    font-family: var(--font-body, system-ui, sans-serif);
  `;

  const variantStyles = {
    primary: `
      background-color: var(--color-primary, #3B82F6);
      color: white;
      &:hover { background-color: var(--color-primary-dark, #2563EB); }
    `,
    secondary: `
      background-color: var(--color-secondary, #10B981);
      color: white;
      &:hover { background-color: var(--color-secondary-dark, #059669); }
    `,
    outline: `
      background-color: transparent;
      border: 1px solid var(--color-primary, #3B82F6);
      color: var(--color-primary, #3B82F6);
      &:hover { background-color: var(--color-primary, #3B82F6); color: white; }
    `,
    ghost: `
      background-color: transparent;
      color: var(--color-primary, #3B82F6);
      &:hover { background-color: var(--color-primary-light, #DBEAFE); }
    `
  };

  const sizeStyles = {
    sm: 'padding: 0.375rem 0.75rem; font-size: 0.875rem;',
    md: 'padding: 0.5rem 1rem; font-size: 1rem;',
    lg: 'padding: 0.75rem 1.5rem; font-size: 1.125rem;'
  };

  const StyledButton = styled.button`
    ${baseStyles}
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${className}
  `;

  return <StyledButton {...props}>{children}</StyledButton>;
};

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card = ({
  children,
  className = '',
  padding = 'md'
}: CardProps) => {
  const paddingStyles = {
    none: '',
    sm: 'padding: 0.75rem;',
    md: 'padding: 1.5rem;',
    lg: 'padding: 2rem;'
  };

  const StyledCard = styled.div`
    background-color: white;
    border-radius: 0.75rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
    border: 1px solid var(--color-border, #E5E7EB);
    ${paddingStyles[padding]}
    ${className}
  `;

  return <StyledCard>{children}</StyledCard>;
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = ({
  label,
  error,
  helperText,
  className = '',
  ...props
}: InputProps) => {
  const StyledInput = styled.input`
    width: 100%;
    padding: 0.5rem 0.75rem;
    font-size: 1rem;
    border: 1px solid ${error ? 'var(--color-error, #EF4444)' : 'var(--color-border, #D1D5DB)'};
    border-radius: 0.375rem;
    background-color: white;
    color: var(--color-text, #111827);
    font-family: var(--font-body, system-ui, sans-serif);
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
    
    &:focus {
      outline: none;
      border-color: var(--color-primary, #3B82F6);
      box-shadow: 0 0 0 3px var(--color-primary-light, #DBEAFE);
    }
    
    &::placeholder {
      color: var(--color-placeholder, #9CA3AF);
    }
    
    ${className}
  `;

  const StyledLabel = styled.label`
    display: block;
    margin-bottom: 0.375rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-text, #111827);
  `;

  const StyledError = styled.p`
    margin-top: 0.375rem;
    font-size: 0.75rem;
    color: var(--color-error, #EF4444);
  `;

  const StyledHelperText = styled.p`
    margin-top: 0.375rem;
    font-size: 0.75rem;
    color: var(--color-text-muted, #6B7280);
  `;

  return (
    <div>
      {label && <StyledLabel htmlFor={props.id}>{label}</StyledLabel>}
      <StyledInput {...props} />
      {error && <StyledError>{error}</StyledError>}
      {helperText && !error && <StyledHelperText>{helperText}</StyledHelperText>}
    </div>
  );
};

export const Index = {
  Button,
  Card,
  Input
};