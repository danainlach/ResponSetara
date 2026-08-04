import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
/* @chisel-passkeys */
import PasskeyVerify from '@/components/passkey-verify';
/* @end-chisel-passkeys */

type Props = {
    status?: string;
    canResetPassword: boolean;
};

export default function Login({ status, canResetPassword }: Props) {
    return (
        <>
            <Head title="Masuk Admin" />

            {/* @chisel-passkeys */}
            <PasskeyVerify 
                label="Verifikasi Kunci Keamanan (Passkey)"
                loadingLabel="Memverifikasi Kunci..."
                separator="Atau lanjutkan dengan alamat email"
            />
            {/* @end-chisel-passkeys */}

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                             <div className="grid gap-2">
                                 <Label htmlFor="email" className="text-text-primary text-base font-extrabold">Alamat Email</Label>
                                 <Input
                                     id="email"
                                     type="email"
                                     name="email"
                                     required
                                     autoFocus
                                     tabIndex={1}
                                     autoComplete="email"
                                     placeholder="nama@responsetara.id"
                                     className="w-full min-h-[56px] h-14 bg-white border-border-strong text-text-primary focus:border-teal-primary focus:ring-[3px] focus:ring-teal-primary/30 px-5 text-base rounded-xl transition-all"
                                 />
                                 <InputError message={errors.email} />
                             </div>

                             <div className="grid gap-2">
                                 <div className="flex items-center">
                                     <Label htmlFor="password" className="text-text-primary text-base font-extrabold">Kata Sandi</Label>
                                     {canResetPassword && (
                                         <TextLink
                                             href={request()}
                                             className="ml-auto text-sm text-teal-primary hover:text-teal-hover hover:underline font-extrabold"
                                             tabIndex={5}
                                         >
                                             Lupa kata sandi?
                                         </TextLink>
                                     )}
                                 </div>
                                 <PasswordInput
                                     id="password"
                                     name="password"
                                     required
                                     tabIndex={2}
                                     autoComplete="current-password"
                                     placeholder="Masukkan kata sandi"
                                     className="w-full min-h-[56px] h-14 bg-white border-border-strong text-text-primary focus:border-teal-primary focus:ring-[3px] focus:ring-teal-primary/30 px-5 text-base rounded-xl transition-all"
                                 />
                                 <InputError message={errors.password} />
                             </div>

                             <div className="flex items-center space-x-3">
                                 <Checkbox
                                     id="remember"
                                     name="remember"
                                     tabIndex={3}
                                     className="border-border-strong text-teal-primary focus:ring-[3px] focus:ring-teal-primary/30 h-5 w-5 rounded cursor-pointer animate-none transition-none"
                                 />
                                 <Label htmlFor="remember" className="text-text-secondary text-base font-semibold cursor-pointer">Ingat saya di perangkat ini</Label>
                             </div>

                             <Button
                                 type="submit"
                                 className="mt-6 w-full min-h-[56px] h-14 bg-teal-primary hover:bg-teal-hover text-white font-black text-lg rounded-xl transition-all duration-200 shadow-lg flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0"
                                 tabIndex={4}
                                 disabled={processing}
                                 data-test="login-button"
                             >
                                 {processing && <Spinner className="text-white" />}
                                 Masuk ke Dashboard
                             </Button>
                         </div>
                     </>
                 )}
             </Form>

             {status && (
                 <div className="mb-4 text-center text-sm font-bold text-green-600">
                     {status}
                 </div>
             )}

             <div className="mt-8 pt-6 border-t border-[var(--border)] text-center">
                 <a
                     href="/"
                     className="inline-flex items-center gap-2 text-sm sm:text-base font-extrabold text-teal-primary hover:text-teal-hover transition-colors focus:outline-none focus:underline"
                 >
                     &larr; Kembali ke Halaman Publik
                 </a>
             </div>
        </>
    );
}

Login.layout = {
    title: 'Masuk Administrasi',
    description: 'Masukkan alamat email dan kata sandi terdaftar untuk mengelola platform.',
};
