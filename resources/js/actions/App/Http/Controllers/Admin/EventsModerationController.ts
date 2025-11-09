import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\EventsModerationController::stats
* @see app/Http/Controllers/Admin/EventsModerationController.php:18
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
* @see app/Http/Controllers/Admin/EventsModerationController.php:18
* @route '/admin/events/stats'
*/
stats.url = (options?: RouteQueryOptions) => {
    return stats.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\EventsModerationController::stats
* @see app/Http/Controllers/Admin/EventsModerationController.php:18
* @route '/admin/events/stats'
*/
stats.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stats.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\EventsModerationController::stats
* @see app/Http/Controllers/Admin/EventsModerationController.php:18
* @route '/admin/events/stats'
*/
stats.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: stats.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\EventsModerationController::stats
* @see app/Http/Controllers/Admin/EventsModerationController.php:18
* @route '/admin/events/stats'
*/
const statsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: stats.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\EventsModerationController::stats
* @see app/Http/Controllers/Admin/EventsModerationController.php:18
* @route '/admin/events/stats'
*/
statsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: stats.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\EventsModerationController::stats
* @see app/Http/Controllers/Admin/EventsModerationController.php:18
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
* @see app/Http/Controllers/Admin/EventsModerationController.php:34
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
* @see app/Http/Controllers/Admin/EventsModerationController.php:34
* @route '/admin/events'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\EventsModerationController::index
* @see app/Http/Controllers/Admin/EventsModerationController.php:34
* @route '/admin/events'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\EventsModerationController::index
* @see app/Http/Controllers/Admin/EventsModerationController.php:34
* @route '/admin/events'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\EventsModerationController::index
* @see app/Http/Controllers/Admin/EventsModerationController.php:34
* @route '/admin/events'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\EventsModerationController::index
* @see app/Http/Controllers/Admin/EventsModerationController.php:34
* @route '/admin/events'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\EventsModerationController::index
* @see app/Http/Controllers/Admin/EventsModerationController.php:34
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
* @see app/Http/Controllers/Admin/EventsModerationController.php:147
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
* @see app/Http/Controllers/Admin/EventsModerationController.php:147
* @route '/admin/events/event-types'
*/
eventTypes.url = (options?: RouteQueryOptions) => {
    return eventTypes.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\EventsModerationController::eventTypes
* @see app/Http/Controllers/Admin/EventsModerationController.php:147
* @route '/admin/events/event-types'
*/
eventTypes.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: eventTypes.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\EventsModerationController::eventTypes
* @see app/Http/Controllers/Admin/EventsModerationController.php:147
* @route '/admin/events/event-types'
*/
eventTypes.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: eventTypes.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\EventsModerationController::eventTypes
* @see app/Http/Controllers/Admin/EventsModerationController.php:147
* @route '/admin/events/event-types'
*/
const eventTypesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: eventTypes.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\EventsModerationController::eventTypes
* @see app/Http/Controllers/Admin/EventsModerationController.php:147
* @route '/admin/events/event-types'
*/
eventTypesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: eventTypes.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\EventsModerationController::eventTypes
* @see app/Http/Controllers/Admin/EventsModerationController.php:147
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

/**
* @see \App\Http\Controllers\Admin\EventsModerationController::show
* @see app/Http/Controllers/Admin/EventsModerationController.php:166
* @route '/admin/events/{point}'
*/
export const show = (args: { point: number | { id: number } } | [point: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin/events/{point}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\EventsModerationController::show
* @see app/Http/Controllers/Admin/EventsModerationController.php:166
* @route '/admin/events/{point}'
*/
show.url = (args: { point: number | { id: number } } | [point: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { point: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { point: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            point: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        point: typeof args.point === 'object'
        ? args.point.id
        : args.point,
    }

    return show.definition.url
            .replace('{point}', parsedArgs.point.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\EventsModerationController::show
* @see app/Http/Controllers/Admin/EventsModerationController.php:166
* @route '/admin/events/{point}'
*/
show.get = (args: { point: number | { id: number } } | [point: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\EventsModerationController::show
* @see app/Http/Controllers/Admin/EventsModerationController.php:166
* @route '/admin/events/{point}'
*/
show.head = (args: { point: number | { id: number } } | [point: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\EventsModerationController::show
* @see app/Http/Controllers/Admin/EventsModerationController.php:166
* @route '/admin/events/{point}'
*/
const showForm = (args: { point: number | { id: number } } | [point: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\EventsModerationController::show
* @see app/Http/Controllers/Admin/EventsModerationController.php:166
* @route '/admin/events/{point}'
*/
showForm.get = (args: { point: number | { id: number } } | [point: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\EventsModerationController::show
* @see app/Http/Controllers/Admin/EventsModerationController.php:166
* @route '/admin/events/{point}'
*/
showForm.head = (args: { point: number | { id: number } } | [point: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

/**
* @see \App\Http\Controllers\Admin\EventsModerationController::updateEventType
* @see app/Http/Controllers/Admin/EventsModerationController.php:211
* @route '/admin/events/{point}/event-type'
*/
export const updateEventType = (args: { point: number | { id: number } } | [point: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateEventType.url(args, options),
    method: 'patch',
})

updateEventType.definition = {
    methods: ["patch"],
    url: '/admin/events/{point}/event-type',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Admin\EventsModerationController::updateEventType
* @see app/Http/Controllers/Admin/EventsModerationController.php:211
* @route '/admin/events/{point}/event-type'
*/
updateEventType.url = (args: { point: number | { id: number } } | [point: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { point: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { point: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            point: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        point: typeof args.point === 'object'
        ? args.point.id
        : args.point,
    }

    return updateEventType.definition.url
            .replace('{point}', parsedArgs.point.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\EventsModerationController::updateEventType
* @see app/Http/Controllers/Admin/EventsModerationController.php:211
* @route '/admin/events/{point}/event-type'
*/
updateEventType.patch = (args: { point: number | { id: number } } | [point: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateEventType.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Admin\EventsModerationController::updateEventType
* @see app/Http/Controllers/Admin/EventsModerationController.php:211
* @route '/admin/events/{point}/event-type'
*/
const updateEventTypeForm = (args: { point: number | { id: number } } | [point: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateEventType.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\EventsModerationController::updateEventType
* @see app/Http/Controllers/Admin/EventsModerationController.php:211
* @route '/admin/events/{point}/event-type'
*/
updateEventTypeForm.patch = (args: { point: number | { id: number } } | [point: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateEventType.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

updateEventType.form = updateEventTypeForm

/**
* @see \App\Http\Controllers\Admin\EventsModerationController::approve
* @see app/Http/Controllers/Admin/EventsModerationController.php:229
* @route '/admin/events/{point}/approve'
*/
export const approve = (args: { point: number | { id: number } } | [point: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

approve.definition = {
    methods: ["post"],
    url: '/admin/events/{point}/approve',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\EventsModerationController::approve
* @see app/Http/Controllers/Admin/EventsModerationController.php:229
* @route '/admin/events/{point}/approve'
*/
approve.url = (args: { point: number | { id: number } } | [point: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { point: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { point: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            point: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        point: typeof args.point === 'object'
        ? args.point.id
        : args.point,
    }

    return approve.definition.url
            .replace('{point}', parsedArgs.point.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\EventsModerationController::approve
* @see app/Http/Controllers/Admin/EventsModerationController.php:229
* @route '/admin/events/{point}/approve'
*/
approve.post = (args: { point: number | { id: number } } | [point: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\EventsModerationController::approve
* @see app/Http/Controllers/Admin/EventsModerationController.php:229
* @route '/admin/events/{point}/approve'
*/
const approveForm = (args: { point: number | { id: number } } | [point: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: approve.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\EventsModerationController::approve
* @see app/Http/Controllers/Admin/EventsModerationController.php:229
* @route '/admin/events/{point}/approve'
*/
approveForm.post = (args: { point: number | { id: number } } | [point: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: approve.url(args, options),
    method: 'post',
})

approve.form = approveForm

/**
* @see \App\Http\Controllers\Admin\EventsModerationController::decline
* @see app/Http/Controllers/Admin/EventsModerationController.php:250
* @route '/admin/events/{point}/decline'
*/
export const decline = (args: { point: number | { id: number } } | [point: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: decline.url(args, options),
    method: 'post',
})

decline.definition = {
    methods: ["post"],
    url: '/admin/events/{point}/decline',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\EventsModerationController::decline
* @see app/Http/Controllers/Admin/EventsModerationController.php:250
* @route '/admin/events/{point}/decline'
*/
decline.url = (args: { point: number | { id: number } } | [point: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { point: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { point: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            point: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        point: typeof args.point === 'object'
        ? args.point.id
        : args.point,
    }

    return decline.definition.url
            .replace('{point}', parsedArgs.point.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\EventsModerationController::decline
* @see app/Http/Controllers/Admin/EventsModerationController.php:250
* @route '/admin/events/{point}/decline'
*/
decline.post = (args: { point: number | { id: number } } | [point: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: decline.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\EventsModerationController::decline
* @see app/Http/Controllers/Admin/EventsModerationController.php:250
* @route '/admin/events/{point}/decline'
*/
const declineForm = (args: { point: number | { id: number } } | [point: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: decline.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\EventsModerationController::decline
* @see app/Http/Controllers/Admin/EventsModerationController.php:250
* @route '/admin/events/{point}/decline'
*/
declineForm.post = (args: { point: number | { id: number } } | [point: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: decline.url(args, options),
    method: 'post',
})

decline.form = declineForm

/**
* @see \App\Http\Controllers\Admin\EventsModerationController::clearImageModeration
* @see app/Http/Controllers/Admin/EventsModerationController.php:270
* @route '/admin/events/{point}/images/{image}/clear-moderation'
*/
export const clearImageModeration = (args: { point: number | { id: number }, image: number | { id: number } } | [point: number | { id: number }, image: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: clearImageModeration.url(args, options),
    method: 'post',
})

clearImageModeration.definition = {
    methods: ["post"],
    url: '/admin/events/{point}/images/{image}/clear-moderation',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\EventsModerationController::clearImageModeration
* @see app/Http/Controllers/Admin/EventsModerationController.php:270
* @route '/admin/events/{point}/images/{image}/clear-moderation'
*/
clearImageModeration.url = (args: { point: number | { id: number }, image: number | { id: number } } | [point: number | { id: number }, image: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            point: args[0],
            image: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        point: typeof args.point === 'object'
        ? args.point.id
        : args.point,
        image: typeof args.image === 'object'
        ? args.image.id
        : args.image,
    }

    return clearImageModeration.definition.url
            .replace('{point}', parsedArgs.point.toString())
            .replace('{image}', parsedArgs.image.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\EventsModerationController::clearImageModeration
* @see app/Http/Controllers/Admin/EventsModerationController.php:270
* @route '/admin/events/{point}/images/{image}/clear-moderation'
*/
clearImageModeration.post = (args: { point: number | { id: number }, image: number | { id: number } } | [point: number | { id: number }, image: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: clearImageModeration.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\EventsModerationController::clearImageModeration
* @see app/Http/Controllers/Admin/EventsModerationController.php:270
* @route '/admin/events/{point}/images/{image}/clear-moderation'
*/
const clearImageModerationForm = (args: { point: number | { id: number }, image: number | { id: number } } | [point: number | { id: number }, image: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: clearImageModeration.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\EventsModerationController::clearImageModeration
* @see app/Http/Controllers/Admin/EventsModerationController.php:270
* @route '/admin/events/{point}/images/{image}/clear-moderation'
*/
clearImageModerationForm.post = (args: { point: number | { id: number }, image: number | { id: number } } | [point: number | { id: number }, image: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: clearImageModeration.url(args, options),
    method: 'post',
})

clearImageModeration.form = clearImageModerationForm

const EventsModerationController = { stats, index, eventTypes, show, updateEventType, approve, decline, clearImageModeration }

export default EventsModerationController