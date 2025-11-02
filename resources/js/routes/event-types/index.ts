import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\EventTypeController::index
* @see app/Http/Controllers/EventTypeController.php:18
* @route '/api/event-types'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/event-types',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EventTypeController::index
* @see app/Http/Controllers/EventTypeController.php:18
* @route '/api/event-types'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EventTypeController::index
* @see app/Http/Controllers/EventTypeController.php:18
* @route '/api/event-types'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EventTypeController::index
* @see app/Http/Controllers/EventTypeController.php:18
* @route '/api/event-types'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\EventTypeController::autocomplete
* @see app/Http/Controllers/EventTypeController.php:119
* @route '/api/event-types/autocomplete'
*/
export const autocomplete = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: autocomplete.url(options),
    method: 'get',
})

autocomplete.definition = {
    methods: ["get","head"],
    url: '/api/event-types/autocomplete',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EventTypeController::autocomplete
* @see app/Http/Controllers/EventTypeController.php:119
* @route '/api/event-types/autocomplete'
*/
autocomplete.url = (options?: RouteQueryOptions) => {
    return autocomplete.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EventTypeController::autocomplete
* @see app/Http/Controllers/EventTypeController.php:119
* @route '/api/event-types/autocomplete'
*/
autocomplete.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: autocomplete.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EventTypeController::autocomplete
* @see app/Http/Controllers/EventTypeController.php:119
* @route '/api/event-types/autocomplete'
*/
autocomplete.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: autocomplete.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\EventTypeController::show
* @see app/Http/Controllers/EventTypeController.php:80
* @route '/api/event-types/{eventType}'
*/
export const show = (args: { eventType: number | { id: number } } | [eventType: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/event-types/{eventType}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EventTypeController::show
* @see app/Http/Controllers/EventTypeController.php:80
* @route '/api/event-types/{eventType}'
*/
show.url = (args: { eventType: number | { id: number } } | [eventType: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { eventType: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { eventType: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            eventType: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        eventType: typeof args.eventType === 'object'
        ? args.eventType.id
        : args.eventType,
    }

    return show.definition.url
            .replace('{eventType}', parsedArgs.eventType.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EventTypeController::show
* @see app/Http/Controllers/EventTypeController.php:80
* @route '/api/event-types/{eventType}'
*/
show.get = (args: { eventType: number | { id: number } } | [eventType: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EventTypeController::show
* @see app/Http/Controllers/EventTypeController.php:80
* @route '/api/event-types/{eventType}'
*/
show.head = (args: { eventType: number | { id: number } } | [eventType: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\EventTypeController::store
* @see app/Http/Controllers/EventTypeController.php:66
* @route '/api/event-types'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/event-types',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EventTypeController::store
* @see app/Http/Controllers/EventTypeController.php:66
* @route '/api/event-types'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EventTypeController::store
* @see app/Http/Controllers/EventTypeController.php:66
* @route '/api/event-types'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\EventTypeController::update
* @see app/Http/Controllers/EventTypeController.php:91
* @route '/api/event-types/{eventType}'
*/
export const update = (args: { eventType: number | { id: number } } | [eventType: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/api/event-types/{eventType}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\EventTypeController::update
* @see app/Http/Controllers/EventTypeController.php:91
* @route '/api/event-types/{eventType}'
*/
update.url = (args: { eventType: number | { id: number } } | [eventType: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { eventType: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { eventType: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            eventType: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        eventType: typeof args.eventType === 'object'
        ? args.eventType.id
        : args.eventType,
    }

    return update.definition.url
            .replace('{eventType}', parsedArgs.eventType.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EventTypeController::update
* @see app/Http/Controllers/EventTypeController.php:91
* @route '/api/event-types/{eventType}'
*/
update.put = (args: { eventType: number | { id: number } } | [eventType: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\EventTypeController::patch
* @see app/Http/Controllers/EventTypeController.php:91
* @route '/api/event-types/{eventType}'
*/
export const patch = (args: { eventType: number | { id: number } } | [eventType: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: patch.url(args, options),
    method: 'patch',
})

patch.definition = {
    methods: ["patch"],
    url: '/api/event-types/{eventType}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\EventTypeController::patch
* @see app/Http/Controllers/EventTypeController.php:91
* @route '/api/event-types/{eventType}'
*/
patch.url = (args: { eventType: number | { id: number } } | [eventType: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { eventType: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { eventType: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            eventType: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        eventType: typeof args.eventType === 'object'
        ? args.eventType.id
        : args.eventType,
    }

    return patch.definition.url
            .replace('{eventType}', parsedArgs.eventType.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EventTypeController::patch
* @see app/Http/Controllers/EventTypeController.php:91
* @route '/api/event-types/{eventType}'
*/
patch.patch = (args: { eventType: number | { id: number } } | [eventType: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: patch.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\EventTypeController::destroy
* @see app/Http/Controllers/EventTypeController.php:105
* @route '/api/event-types/{eventType}'
*/
export const destroy = (args: { eventType: number | { id: number } } | [eventType: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/event-types/{eventType}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\EventTypeController::destroy
* @see app/Http/Controllers/EventTypeController.php:105
* @route '/api/event-types/{eventType}'
*/
destroy.url = (args: { eventType: number | { id: number } } | [eventType: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { eventType: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { eventType: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            eventType: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        eventType: typeof args.eventType === 'object'
        ? args.eventType.id
        : args.eventType,
    }

    return destroy.definition.url
            .replace('{eventType}', parsedArgs.eventType.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EventTypeController::destroy
* @see app/Http/Controllers/EventTypeController.php:105
* @route '/api/event-types/{eventType}'
*/
destroy.delete = (args: { eventType: number | { id: number } } | [eventType: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\EventTypeController::generate
* @see app/Http/Controllers/EventTypeController.php:149
* @route '/api/event-types/generate'
*/
export const generate = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: generate.url(options),
    method: 'post',
})

generate.definition = {
    methods: ["post"],
    url: '/api/event-types/generate',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EventTypeController::generate
* @see app/Http/Controllers/EventTypeController.php:149
* @route '/api/event-types/generate'
*/
generate.url = (options?: RouteQueryOptions) => {
    return generate.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EventTypeController::generate
* @see app/Http/Controllers/EventTypeController.php:149
* @route '/api/event-types/generate'
*/
generate.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: generate.url(options),
    method: 'post',
})

const eventTypes = {
    index,
    autocomplete,
    show,
    store,
    update,
    patch,
    destroy,
    generate,
}

export default eventTypes