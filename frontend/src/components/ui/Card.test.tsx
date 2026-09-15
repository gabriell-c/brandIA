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

  it('applies info variant', () => {
    render(<Card variant="info">Info</Card>);
    const card = screen.getByText('Info').parentElement;
    expect(card).toHaveClass('bg-blue-50');
    expect(card).toHaveClass('border-blue-200');
  });

  it('applies success variant', () => {
    render(<Card variant="success">Success</Card>);
    const card = screen.getByText('Success').parentElement;
    expect(card).toHaveClass('bg-green-50');
    expect(card).toHaveClass('border-green-200');
  });

  it('applies warning variant', () => {
    render(<Card variant="warning">Warning</Card>);
    const card = screen.getByText('Warning').parentElement;
    expect(card).toHaveClass('bg-yellow-50');
    expect(card).toHaveClass('border-yellow-200');
  });

  it('applies error variant', () => {
    render(<Card variant="error">Error</Card>);
    const card = screen.getByText('Error').parentElement;
    expect(card).toHaveClass('bg-red-50');
    expect(card).toHaveClass('border-red-200');
  });

  it('applies custom className', () => {
    const { container } = render(<Card className="custom-card">Content</Card>);
    const card = container.querySelector('div');
    expect(card).toHaveClass('custom-card');
  });

  it('has proper border and rounded classes', () => {
    render(<Card>Bordered</Card>);
    const card = screen.getByText('Bordered').parentElement;
    expect(card).toHaveClass('border');
    expect(card).toHaveClass('rounded-xl');
    expect(card).toHaveClass('shadow-sm');
  });
});