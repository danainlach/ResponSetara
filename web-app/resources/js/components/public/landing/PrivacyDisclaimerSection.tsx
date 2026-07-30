import React from 'react';

export default function PrivacyDisclaimerSection() {
    return (
        <section id="privacy" aria-labelledby="privacy-disclaimer-heading" className="py-10 border-t border-border-subtle scroll-mt-20">
            <div className="rounded-3xl border border-navy-800 bg-gradient-to-br from-navy-900 to-navy-800 text-white p-6 sm:p-10 lg:p-12 shadow-xl">
                <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
                    <span aria-hidden="true" className="inline-block rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 px-4 py-1 text-xs sm:text-sm font-extrabold uppercase tracking-wider">
                        Komitmen Keamanan &amp; Etika
                    </span>
                    <h2 id="privacy-disclaimer-heading" className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
                        Privasi Mutlak &amp; Disclaimer Resmi
                    </h2>
                    <p className="text-base sm:text-lg text-slate-200 font-medium leading-relaxed">
                        Keamanan data pribadi dan transparansi layanan adalah fondasi utama arsitektur ResponSetara.
                    </p>
                </div>

                {/* 3 Pillars of Trust */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 mb-10">
                    <div className="rounded-2xl bg-navy-900/90 p-6 border border-teal-500/30 shadow-sm flex flex-col justify-between">
                        <div>
                            <span aria-hidden="true" className="h-12 w-12 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-2xl mb-4 text-teal-300">
                                🛡️
                            </span>
                            <h3 className="text-lg font-bold text-white mb-2">
                                1. Pesan Tidak Disimpan
                            </h3>
                            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                                Server ResponSetara menerapkan Zero-Retention Policy. Tidak ada riwayat pesan darurat, audio, transkripsi, atau koordinat lokasi yang disimpan di database atau log server kami.
                            </p>
                        </div>
                    </div>

                    <div className="rounded-2xl bg-navy-900/90 p-6 border border-teal-500/30 shadow-sm flex flex-col justify-between">
                        <div>
                            <span aria-hidden="true" className="h-12 w-12 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-2xl mb-4 text-teal-300">
                                ⚡
                            </span>
                            <h3 className="text-lg font-bold text-white mb-2">
                                2. Tidak Perlu Akun Pengguna
                            </h3>
                            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                                Situasi krisis menuntut kecepatan seketika. Masyakat dapat langsung memanfaatkan seluruh fitur komunikasi dan penyusunan pesan tanpa proses pendaftaran atau login.
                            </p>
                        </div>
                    </div>

                    <div className="rounded-2xl bg-navy-900/90 p-6 border border-teal-500/30 shadow-sm flex flex-col justify-between">
                        <div>
                            <span aria-hidden="true" className="h-12 w-12 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-2xl mb-4 text-teal-300">
                                📚
                            </span>
                            <h3 className="text-lg font-bold text-white mb-2">
                                3. Cadangan Template Tersedia
                            </h3>
                            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                                Jika layanan penyempurnaan AI tidak tersedia, sistem langsung mengaktifkan susunan pesan berdasarkan template terstruktur yang aman secara otomatis.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Legal Position & Disclaimer Box */}
                <div className="rounded-2xl bg-navy-900 p-6 sm:p-8 border border-coral-500/40 shadow-inner text-left flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    <span aria-hidden="true" className="h-14 w-14 rounded-2xl bg-coral-600/20 border border-coral-500/30 flex items-center justify-center text-3xl shrink-0 text-coral-400">
                        ⚖️
                    </span>
                    <div>
                        <h3 className="text-lg font-extrabold text-white mb-2 flex items-center">
                            <span>Posisi Layanan Komunikasi Kedaruratan</span>
                        </h3>
                        <p className="text-base font-bold text-coral-300 mb-2">
                            &ldquo;ResponSetara membantu komunikasi dan tidak menggantikan layanan darurat resmi.&rdquo;
                        </p>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                            Platform ini dirancang khusus sebagai jembatan komunikasi inklusif bagi penyandang disabilitas (Tuli dan Nonverbal) serta penolong di sekitarnya. Untuk mendapatkan tindakan penyelamatan fisik seketika, tetap panggil otoritas gawat darurat atau tenaga medis resmi di wilayah Anda.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
