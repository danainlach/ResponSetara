<?php

namespace App\Enums;

enum CommunicationMode: string
{
    case GENERAL = 'general';
    case NONVERBAL = 'nonverbal';
    case DEAF = 'deaf';

    public function label(): string
    {
        return match ($this) {
            self::GENERAL => 'Umum',
            self::NONVERBAL => 'Tidak Dapat Berbicara',
            self::DEAF => 'Tidak Dapat Mendengar',
        };
    }
}
