import OperatorLayoutClient from './OperatorLayoutClient';

export const metadata = {
  title: 'Celestial Tours Operations | Dashboard',
  description: 'Manage tours, bookings, and alerts.'
};

export default function OperatorLayout({ children }) {
  return <OperatorLayoutClient>{children}</OperatorLayoutClient>;
}
