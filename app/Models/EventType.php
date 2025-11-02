<?php

namespace App\Models;

use App\Enums\NotificationMode;
use App\Enums\Priority;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EventType extends Model
{
    use HasFactory;
    protected $fillable = [
        'system_event_title',
        'priority',
        'title_display_translation',
        'notify_to',
        'notification_mode',
        'moderated_by',
    ];

    protected $casts = [
        'priority' => Priority::class,
        'title_display_translation' => 'array',
        'notify_to' => 'array',
        'notification_mode' => NotificationMode::class,
    ];

    /**
     * Get the user who moderates this event type.
     */
    public function moderator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'moderated_by');
    }
}
