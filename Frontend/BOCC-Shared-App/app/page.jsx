import { redirect } from 'next/navigation';

/** Root path → redirect to /login */
export default function RootPage() {
  redirect('/login');
}
