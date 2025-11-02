<?php

namespace App\Enums;

enum NotificationMode: string
{
    case IMMEDIATE = 'immediate';
    case ON_MODERATION = 'on-moderation';
    case NONE = 'none';
}

