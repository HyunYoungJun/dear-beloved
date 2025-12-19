import AuthForm from '@/components/auth/AuthForm';

export default function LoginPage() {
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-gray-50 px-4">
            <AuthForm mode="login" />
        </div>
    );
}
