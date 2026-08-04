import { Head } from '@inertiajs/react';
import Heading from '@/components/heading';
import { edit as editAppearance } from '@/routes/appearance';
import { AppearanceToggleTab } from '@/components/appearance-tabs';

export default function Appearance() {
    return (
        <>
            <Head title="Pengaturan Tampilan" />

            <h1 className="sr-only">Pengaturan Tampilan</h1>

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="Pengaturan Tampilan"
                    description="Atur tampilan portal administrator. Pengaturan ini hanya berlaku pada area admin dan tidak mengubah halaman publik ResponSetara."
                />

                <div className="space-y-4 rounded-2xl border border-[var(--border)] bg-card p-6 shadow-sm">
                    <div className="space-y-1">
                        <h2 className="text-sm font-medium text-foreground">Tema Portal</h2>
                        <p className="text-sm text-muted-foreground">Pilih tema terang, gelap, atau sesuaikan dengan sistem Anda.</p>
                    </div>
                    <AppearanceToggleTab />
                </div>
            </div>
        </>
    );
}

Appearance.layout = {
    breadcrumbs: [
        {
            title: 'Appearance settings',
            href: editAppearance(),
        },
    ],
};
