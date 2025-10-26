<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UploadPointImageRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $point = $this->route('point');
        return $this->user() && $this->user()->id === $point->user_id;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $maxSizeKb = config('uploads.max_file_size') / 1024;
        
        return [
            'image' => [
                'required',
                'image',
                'mimes:jpeg,png,jpg',
                "max:{$maxSizeKb}",
            ],
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     */
    public function messages(): array
    {
        return [
            'image.required' => 'Image is required',
            'image.image' => 'File must be an image',
            'image.mimes' => 'Only JPEG and PNG formats are allowed',
            'image.max' => 'Maximum file size is 5MB',
        ];
    }
}
