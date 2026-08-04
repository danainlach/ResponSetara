import React from 'react';

export default function PrivacyDisclaimerSection() {
    return (
        <section id="privacy" aria-labelledby="privacy-disclaimer-heading" className="py-10 border-t border-border-subtle scroll-mt-20">
            <div className="rounded-3xl border border-teal-primary/35 bg-[var(--teal-soft)]/30 p-6 sm:p-10 lg:p-12 shadow-card">
                <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
                    <span aria-hidden="true" className="inline-block rounded-full bg-teal-primary/25 text-text-primary border border-teal-primary/40 px-4 py-1 text-xs sm:text-sm font-extrabold uppercase tracking-wider">
                        Komitmen Keamanan &amp; Etika
                    </span>
                    <h2 id="privacy-disclaimer-heading" className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-text-primary">
                        Privasi Mutlak &amp; Disclaimer Resmi
                    </h2>
                    <p className="text-base sm:text-lg text-text-secondary font-medium leading-relaxed">
                        Keamanan data pribadi dan transparansi layanan adalah fondasi utama arsitektur ResponSetara.
                    </p>
                </div>

                {/* 3 Pillars of Trust */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 mb-10">
                    <div className="rounded-2xl bg-white p-6 border border-teal-primary/30 shadow-sm flex flex-col justify-between hover:border-teal-primary transition-all duration-200">
                        <div>
                            <span aria-hidden="true" className="h-12 w-12 rounded-xl bg-teal-primary/10 border border-teal-primary/20 flex items-center justify-center text-2xl mb-4 text-teal-primary">
                                🛡️
                            </span>
                            <h3 className="text-lg font-extrabold text-text-primary mb-2">
                                1. Pesan Tidak Disimpan
                            </h3>
                            <p className="text-sm sm:text-base text-text-secondary leading-relaxed font-semibold">
                                ResponSetara hanya menyimpan hitungan aktivitas harian secara agregat. Sistem tidak menyimpan identitas pengguna, isi pesan, lokasi, audio, maupun transkripsi.
                            </p>
                        </div>
                    </div>

                    <div className="rounded-2xl bg-white p-6 border border-teal-primary/30 shadow-sm flex flex-col justify-between hover:border-teal-primary transition-all duration-200">
                        <div>
                            <span aria-hidden="true" className="h-12 w-12 rounded-xl bg-teal-primary/10 border border-teal-primary/20 flex items-center justify-center text-2xl mb-4 text-teal-primary">
                                ⚡
                            </span>
                            <h3 className="text-lg font-extrabold text-text-primary mb-2">
                                2. Tidak Perlu Akun Pengguna
                            </h3>
                            <p className="text-sm sm:text-base text-text-secondary leading-relaxed font-semibold">
                                Situasi krisis menuntut kecepatan seketika. Masyarakat dapat langsung memanfaatkan seluruh fitur komunikasi dan penyusunan pesan tanpa proses pendaftaran atau login.
                            </p>
                        </div>
                    </div>

                    <div className="rounded-2xl bg-white p-6 border border-teal-primary/30 shadow-sm flex flex-col justify-between hover:border-teal-primary transition-all duration-200">
                        <div>
                            <span aria-hidden="true" className="h-12 w-12 rounded-xl bg-teal-primary/10 border border-teal-primary/20 flex items-center justify-center text-2xl mb-4 text-teal-primary">
                                📚
                            </span>
                            <h3 className="text-lg font-extrabold text-text-primary mb-2">
                                3. Cadangan Template Tersedia
                            </h3>
                            <p className="text-sm sm:text-base text-text-secondary leading-relaxed font-semibold">
                                Jika layanan penyempurnaan AI tidak tersedia, sistem langsung mengaktifkan susunan pesan berdasarkan template terstruktur yang aman secara otomatis.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Legal Position & Disclaimer Box */}
                <div className="rounded-2xl bg-white p-6 sm:p-8 border border-coral-emergency/35 shadow-sm text-left flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    <span aria-hidden="true" className="h-14 w-14 rounded-2xl bg-coral-emergency/10 border border-coral-emergency/20 flex items-center justify-center text-3xl shrink-0 text-coral-emergency">
                        ⚖️
                    </span>
                    <div>
                        <h3 className="text-lg font-extrabold text-text-primary mb-2 flex items-center">
                            <span>Posisi Layanan Komunikasi Kedaruratan</span>
                        </h3>
                        <p className="text-base font-extrabold text-coral-emergency mb-2">
                            &ldquo;ResponSetara membantu komunikasi dan tidak menggantikan layanan darurat resmi.&rdquo;
                        </p>
                        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed font-semibold">
                            Platform ini dirancang khusus sebagai jembatan komunikasi inklusif bagi penyandang disabilitas (Tuli dan Nonverbal) serta penolong di sekitarnya. Untuk mendapatkan tindakan penyelamatan fisik seketika, tetap panggil otoritas gawat darurat atau tenaga medis resmi di wilayah Anda.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
