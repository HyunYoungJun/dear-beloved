import AuthForm from '@/components/auth/AuthForm';

export default function SignUpPage() {
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-gray-50 px-4">
            <AuthForm mode="signup" />
        </div>
    );
}
