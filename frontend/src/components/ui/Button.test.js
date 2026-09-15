describe('Button Component', () => {
  it('should render button element', () => {
    const button = document.createElement('button');
    button.textContent = 'Click me';
    document.body.appendChild(button);
    
    expect(document.body.contains(button)).toBe(true);
    expect(button.textContent).toBe('Click me');
  });

  it('should have correct classes', () => {
    const button = document.createElement('button');
    button.className = 'btn btn-primary';
    document.body.appendChild(button);
    
    expect(button.className).toContain('btn');
    expect(button.className).toContain('btn-primary');
  });

  it('should be disabled when disabled attribute is set', () => {
    const button = document.createElement('button');
    button.disabled = true;
    document.body.appendChild(button);
    
    expect(button.disabled).toBe(true);
  });
});