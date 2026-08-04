import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { update } from '@/routes/password';

type Props = {
    token: string;
    email: string;
    passwordRules: string;
};

export default function ResetPassword({ token, email, passwordRules }: Props) {
    return (
        <>
            <Head title="Atur Ulang Kata Sandi" />

            <Form
                {...update.form()}
                transform={(data) => ({ ...data, token, email })}
                resetOnSuccess={['password', 'password_confirmation']}
            >
                {({ processing, errors }) => (
                    <div className="grid gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="email" className="text-text-primary text-sm font-bold">Alamat Email</Label>
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                autoComplete="email"
                                value={email}
                                className="mt-1 block w-full bg-white border-border-strong text-text-primary rounded-xl h-12 px-4"
                                readOnly
                            />
                            <InputError
                                message={errors.email}
                                className="mt-2"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password" className="text-text-primary text-sm font-bold">Kata Sandi Baru</Label>
                            <PasswordInput
                                id="password"
                                name="password"
                                autoComplete="new-password"
                                className="mt-1 block w-full bg-white border-border-strong text-text-primary focus:border-teal-primary focus:ring-[3px] focus:ring-teal-primary/30 rounded-xl h-12 px-4"
                                autoFocus
                                placeholder="Masukkan kata sandi baru"
                                passwordrules={passwordRules}
                            />
                            <InputError message={errors.password} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password_confirmation" className="text-text-primary text-sm font-bold">
                                Konfirmasi Kata Sandi
                            </Label>
                            <PasswordInput
                                id="password_confirmation"
                                name="password_confirmation"
                                autoComplete="new-password"
                                className="mt-1 block w-full bg-white border-border-strong text-text-primary focus:border-teal-primary focus:ring-[3px] focus:ring-teal-primary/30 rounded-xl h-12 px-4"
                                placeholder="Konfirmasi kata sandi"
                                passwordrules={passwordRules}
                            />
                            <InputError
                                message={errors.password_confirmation}
                                className="mt-2"
                            />
                        </div>

                        <Button
                            type="submit"
                            className="mt-4 w-full bg-teal-primary hover:bg-teal-hover text-white font-black py-3 rounded-xl transition-all duration-200 shadow-md min-h-[48px]"
                            disabled={processing}
                            data-test="reset-password-button"
                        >
                            {processing && <Spinner className="text-white" />}
                            Atur Ulang Kata Sandi
                        </Button>
                    </div>
                )}
            </Form>
        </>
    );
}

ResetPassword.layout = {
    title: 'Atur Ulang Kata Sandi',
    description: 'Silakan masukkan kata sandi baru Anda di bawah ini.',
};
