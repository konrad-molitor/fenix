import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\LocaleController::switchMethod
* @see app/Http/Controllers/LocaleController.php:14
* @route '/locale/switch'
*/
export const switchMethod = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: switchMethod.url(options),
    method: 'post',
})

switchMethod.definition = {
    methods: ["post"],
    url: '/locale/switch',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\LocaleController::switchMethod
* @see app/Http/Controllers/LocaleController.php:14
* @route '/locale/switch'
*/
switchMethod.url = (options?: RouteQueryOptions) => {
    return switchMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LocaleController::switchMethod
* @see app/Http/Controllers/LocaleController.php:14
* @route '/locale/switch'
*/
switchMethod.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: switchMethod.url(options),
    method: 'post',
})

const locale = {
    switch: switchMethod,
}

export default locale