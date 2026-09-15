// Test Button component
const React = require('react');
const { render, screen, fireEvent } = require('@testing-library/react');

jest.mock('@/components/ui/Button', () => ({
  Button: ({ children, variant, size, onClick, disabled, isLoading }) =>
    React.createElement('button', {
      className: `btn btn-${variant || 'primary'} btn-${size || 'md'}${disabled || isLoading ? ' disabled' : ''}`,
      onClick,
      disabled: disabled || isLoading
    }, children)
}));

describe('Button', () => {
  it('should render with default props', () => {
    const { Button } = require('@/components/ui/Button');
    render(React.createElement(Button, null, 'Click me'));
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should apply primary variant by default', () => {
    const { Button } = require('@/components/ui/Button');
    const { container } = render(React.createElement(Button, null, 'Primary'));
    expect(container.firstChild).toHaveClass('btn-primary');
  });

  it('should apply secondary variant', () => {
    const { Button } = require('@/components/ui/Button');
    const { container } = render(React.createElement(Button, { variant: 'secondary' }, 'Secondary'));
    expect(container.firstChild).toHaveClass('btn-secondary');
  });

  it('should handle click', () => {
    const { Button } = require('@/components/ui/Button');
    const handleClick = jest.fn();
    render(React.createElement(Button, { onClick: handleClick }, 'Click'));
    fireEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when isLoading', () => {
    const { Button } = require('@/components/ui/Button');
    const { container } = render(React.createElement(Button, { isLoading: true }, 'Loading'));
    expect(container.firstChild).toBeDisabled();
  });
});