import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the main heading after loading', async () => {
  render(<App />);
  const headingElement = await screen.findByRole('heading', { name: /Hello, I'm Sudharsana Rajasekaran/i, level: 2 }, { timeout: 3000 });
  expect(headingElement).toBeInTheDocument();
});
