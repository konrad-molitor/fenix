<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class HandleLocalization
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $locale = $this->determineLocale($request);
        
        // Set application locale
        App::setLocale($locale);
        
        // Set initial cookie for guests if not exists
        $this->setInitialCookieIfNeeded($request, $locale);
        
        // Share data with Inertia
        $this->shareInertiaData($locale);
        
        return $next($request);
    }
    
    /**
     * Determine the locale based on priority:
     * 1. users.locale (for authenticated users)
     * 2. cookie locale (for guests/before login)
     * 3. Accept-Language header (normalized)
     * 4. fallback_locale from config
     */
    private function determineLocale(Request $request): string
    {
        $supportedLocales = array_keys(config('app.supported_locales', []));
        $fallbackLocale = config('app.fallback_locale', 'en');
        
        // 1. Check authenticated user's locale
        if (Auth::check() && Auth::user()->locale) {
            $userLocale = Auth::user()->locale;
            if (in_array($userLocale, $supportedLocales)) {
                return $userLocale;
            }
        }
        
        // 2. Check cookie locale
        $cookieLocale = $request->cookie('locale');
        if ($cookieLocale && in_array($cookieLocale, $supportedLocales)) {
            return $cookieLocale;
        }
        
        // 3. Check Accept-Language header (normalized)
        $browserLocale = $this->getBrowserLocale($request, $supportedLocales);
        if ($browserLocale) {
            return $browserLocale;
        }
        
        // 4. Fallback locale
        return in_array($fallbackLocale, $supportedLocales) ? $fallbackLocale : 'en';
    }
    
    /**
     * Get browser locale from Accept-Language header
     */
    private function getBrowserLocale(Request $request, array $supportedLocales): ?string
    {
        $acceptLanguage = $request->header('Accept-Language');
        if (!$acceptLanguage) {
            return null;
        }
        
        // Parse Accept-Language header
        $languages = [];
        foreach (explode(',', $acceptLanguage) as $lang) {
            $parts = explode(';', trim($lang));
            $locale = trim($parts[0]);
            
            // Normalize locale code (en-US -> en)
            $locale = substr($locale, 0, 2);
            
            if (in_array($locale, $supportedLocales)) {
                return $locale;
            }
        }
        
        return null;
    }
    
    /**
     * Set initial cookie for guests if not exists
     */
    private function setInitialCookieIfNeeded(Request $request, string $locale): void
    {
        $currentCookie = $request->cookie('locale');
        
        // Only set cookie if it doesn't exist (first visit)
        if (!$currentCookie) {
            cookie()->queue(cookie(
                'locale',
                $locale,
                60 * 24 * 365, // 1 year
                '/',
                null,
                null,
                true, // HttpOnly
                false,
                'Lax'
            ));
        }
    }
    
    /**
     * Share data with Inertia
     */
    private function shareInertiaData(string $locale): void
    {
        $translations = $this->loadTranslations($locale);
        
        Inertia::share([
            'locale' => $locale,
            'availableLocales' => config('app.supported_locales', []),
            'translations' => $translations,
        ]);
    }
    
    /**
     * Load translations for the given locale
     */
    private function loadTranslations(string $locale): array
    {
        $translationFile = resource_path("lang/{$locale}.json");
        
        if (File::exists($translationFile)) {
            $content = File::get($translationFile);
            return json_decode($content, true) ?: [];
        }
        
        return [];
    }
}
