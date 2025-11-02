<?php

namespace App\Http\Requests;

use App\Enums\NotificationMode;
use App\Enums\Priority;
use App\Enums\UserRole;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreEventTypeRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() && $this->user()->role === UserRole::ADMIN;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'system_event_title' => ['required', 'string', 'max:255', 'unique:event_types,system_event_title'],
            'priority' => ['required', Rule::enum(Priority::class)],
            'title_display_translation' => ['required', 'array'],
            'title_display_translation.en' => ['required', 'string', 'max:255'],
            'title_display_translation.es' => ['required', 'string', 'max:255'],
            'title_display_translation.ru' => ['required', 'string', 'max:255'],
            'notify_to' => ['nullable', 'array'],
            'notify_to.type' => ['required_with:notify_to', 'string', 'in:email,sms,webhook'],
            'notify_to.data' => ['required_with:notify_to', 'string'],
            'notification_mode' => ['required', Rule::enum(NotificationMode::class)],
            'moderated_by' => ['nullable', 'exists:users,id'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'system_event_title.required' => 'Event title is required',
            'system_event_title.unique' => 'This event type already exists',
            'title_display_translation.*.required' => 'Translation is required for all languages',
            'notify_to.type.in' => 'Notification type must be email, sms, or webhook',
        ];
    }
}
