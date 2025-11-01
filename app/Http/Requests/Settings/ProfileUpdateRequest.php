<?php

namespace App\Http\Requests\Settings;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Enum;

class ProfileUpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $rules = [
            'name' => ['required', 'string', 'max:255'],

            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique(User::class)->ignore($this->user()->id),
            ],
            
            'locale' => [
                'nullable',
                'string',
                Rule::in(array_keys(config('app.supported_locales', []))),
            ],
        ];

        // Only admins can change role
        if ($this->user()->isAdmin()) {
            $rules['role'] = ['required', new Enum(UserRole::class)];
        }

        return $rules;
    }
}
