<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Redirect;

class LocaleController extends Controller
{
    /**
     * Switch the application locale
     */
    public function switch(Request $request): RedirectResponse
    {
        $locale = $request->input('locale');
        $supportedLocales = array_keys(config('app.supported_locales', []));
        
        // Validate locale
        if (!in_array($locale, $supportedLocales)) {
            return Redirect::back();
        }
        
        // Set cookie
        $cookie = cookie(
            'locale',
            $locale,
            60 * 24 * 365, // 1 year
            '/',
            null,
            null,
            true, // HttpOnly
            false,
            'Lax'
        );
        
        // Get the intended redirect URL or fallback to current page
        $redirectTo = $request->input('redirect_to', $request->headers->get('referer', '/'));
        
        return Redirect::to($redirectTo)->cookie($cookie);
    }
}
