import AuthBrandLayout from '@/layouts/auth/AuthBrandLayout';

export default function AuthLayout({
    title = '',
    description = '',
    children,
}: {
    title?: string;
    description?: string;
    children: React.ReactNode;
}) {
    return (
        <AuthBrandLayout title={title} description={description}>
            {children}
        </AuthBrandLayout>
    );
}
