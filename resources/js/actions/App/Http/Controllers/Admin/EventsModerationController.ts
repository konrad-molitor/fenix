import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\EventsModerationController::stats
* @see app/Http/Controllers/Admin/EventsModerationController.php:17
* @route '/admin/events/stats'
*/
export const stats = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stats.url(options),
    method: 'get',
})

stats.definition = {
    methods: ["get","head"],
    url: '/admin/events/stats',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\EventsModerationController::stats
* @see app/Http/Controllers/Admin/EventsModerationController.php:17
* @route '/admin/events/stats'
*/
stats.url = (options?: RouteQueryOptions) => {
    return stats.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\EventsModerationController::stats
* @see app/Http/Controllers/Admin/EventsModerationController.php:17
* @route '/admin/events/stats'
*/
stats.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stats.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\EventsModerationController::stats
* @see app/Http/Controllers/Admin/EventsModerationController.php:17
* @route '/admin/events/stats'
*/
stats.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: stats.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\EventsModerationController::stats
* @see app/Http/Controllers/Admin/EventsModerationController.php:17
* @route '/admin/events/stats'
*/
const statsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: stats.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\EventsModerationController::stats
* @see app/Http/Controllers/Admin/EventsModerationController.php:17
* @route '/admin/events/stats'
*/
statsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: stats.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\EventsModerationController::stats
* @see app/Http/Controllers/Admin/EventsModerationController.php:17
* @route '/admin/events/stats'
*/
statsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: stats.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

stats.form = statsForm

/**
* @see \App\Http\Controllers\Admin\EventsModerationController::index
* @see app/Http/Controllers/Admin/EventsModerationController.php:33
* @route '/admin/events'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/events',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\EventsModerationController::index
* @see app/Http/Controllers/Admin/EventsModerationController.php:33
* @route '/admin/events'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\EventsModerationController::index
* @see app/Http/Controllers/Admin/EventsModerationController.php:33
* @route '/admin/events'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\EventsModerationController::index
* @see app/Http/Controllers/Admin/EventsModerationController.php:33
* @route '/admin/events'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\EventsModerationController::index
* @see app/Http/Controllers/Admin/EventsModerationController.php:33
* @route '/admin/events'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\EventsModerationController::index
* @see app/Http/Controllers/Admin/EventsModerationController.php:33
* @route '/admin/events'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\EventsModerationController::index
* @see app/Http/Controllers/Admin/EventsModerationController.php:33
* @route '/admin/events'
*/
indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

/**
* @see \App\Http\Controllers\Admin\EventsModerationController::eventTypes
* @see app/Http/Controllers/Admin/EventsModerationController.php:146
* @route '/admin/events/event-types'
*/
export const eventTypes = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: eventTypes.url(options),
    method: 'get',
})

eventTypes.definition = {
    methods: ["get","head"],
    url: '/admin/events/event-types',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\EventsModerationController::eventTypes
* @see app/Http/Controllers/Admin/EventsModerationController.php:146
* @route '/admin/events/event-types'
*/
eventTypes.url = (options?: RouteQueryOptions) => {
    return eventTypes.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\EventsModerationController::eventTypes
* @see app/Http/Controllers/Admin/EventsModerationController.php:146
* @route '/admin/events/event-types'
*/
eventTypes.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: eventTypes.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\EventsModerationController::eventTypes
* @see app/Http/Controllers/Admin/EventsModerationController.php:146
* @route '/admin/events/event-types'
*/
eventTypes.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: eventTypes.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\EventsModerationController::eventTypes
* @see app/Http/Controllers/Admin/EventsModerationController.php:146
* @route '/admin/events/event-types'
*/
const eventTypesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: eventTypes.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\EventsModerationController::eventTypes
* @see app/Http/Controllers/Admin/EventsModerationController.php:146
* @route '/admin/events/event-types'
*/
eventTypesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: eventTypes.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\EventsModerationController::eventTypes
* @see app/Http/Controllers/Admin/EventsModerationController.php:146
* @route '/admin/events/event-types'
*/
eventTypesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: eventTypes.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

eventTypes.form = eventTypesForm

const EventsModerationController = { stats, index, eventTypes }

export default EventsModerationController