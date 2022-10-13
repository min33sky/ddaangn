import TabLayout from '@/components/layout/TabLayout';
import Link from 'next/link';

export default function Home() {
  return (
    <TabLayout>
      <div className="text-3xl font-bold underline">
        <h1>안녕하세요</h1>
        <Link href="/auth/signin">
          <a>Login Page</a>
        </Link>
      </div>
    </TabLayout>
  );
}
