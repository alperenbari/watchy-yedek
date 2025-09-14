import { render, screen } from '@testing-library/react';
import App from './App';

test('renders hero banner login button', () => {
  render(<App />);
  const loginButton = screen.getByText(/Giriş Yap/i);
  expect(loginButton).toBeInTheDocument();
});
