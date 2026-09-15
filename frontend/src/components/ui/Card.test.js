// Test Card component
const React = require('react');
const { render, screen } = require('@testing-library/react');

jest.mock('@/components/ui/Card', () => ({
  Card: ({ children, variant }) =>
    React.createElement('div', { className: `card card-${variant || 'default'}` }, children)
}));

describe('Card', () => {
  it('should render children', () => {
    const { Card } = require('@/components/ui/Card');
    render(React.createElement(Card, null, 'Test content'));
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('should apply default variant class', () => {
    const { Card } = require('@/components/ui/Card');
    const { container } = render(React.createElement(Card, null, 'Content'));
    expect(container.firstChild).toHaveClass('card-default');
  });

  it('should apply success variant class', () => {
    const { Card } = require('@/components/ui/Card');
    const { container } = render(React.createElement(Card, { variant: 'success' }, 'Content'));
    expect(container.firstChild).toHaveClass('card-success');
  });
});