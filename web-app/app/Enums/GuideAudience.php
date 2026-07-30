<?php

namespace App\Enums;

enum GuideAudience: string
{
    case GENERAL = 'general';
    case NONVERBAL = 'nonverbal';
    case DEAF = 'deaf';

    public function label(): string
    {
        return match ($this) {
            self::GENERAL => 'Masyakat Umum / Penolong',
            self::NONVERBAL => 'Pengguna Nonverbal',
            self::DEAF => 'Pengguna Tuli',
        };
    }
}
