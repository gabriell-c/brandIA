import React from 'react';
import { render, screen } from '@testing-library/react';
import { Card } from './Card';

describe('Card', () => {
  it('renders children correctly', () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('applies default variant', () => {
    render(<Card>Default</Card>);
    const card = screen.getByText('Default').parentElement;
    expect(card).toHaveClass('bg-white');
    expect(card).toHaveClass('border-gray-200');
  });

  it('applies success variant', () => {
    render(<Card variant="success">Success</Card>);
    const card = screen.getByText('Success').parentElement;
    expect(card).toHaveClass('bg-green-50');
    expect(card).toHaveClass('border-green-200');
  });

  it('applies error variant', () => {
    render(<Card variant="error">Error</Card>);
    const card = screen.getByText('Error').parentElement;
    expect(card).toHaveClass('bg-red-50');
    expect(card).toHaveClass('border-red-200');
  });
});