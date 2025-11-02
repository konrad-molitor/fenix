import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../wayfinder'
import images from './images'
/**
* @see \App\Http\Controllers\PointController::index
* @see app/Http/Controllers/PointController.php:15
* @route '/api/points'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/points',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PointController::index
* @see app/Http/Controllers/PointController.php:15
* @route '/api/points'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PointController::index
* @see app/Http/Controllers/PointController.php:15
* @route '/api/points'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PointController::index
* @see app/Http/Controllers/PointController.php:15
* @route '/api/points'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PointController::listView
* @see app/Http/Controllers/PointController.php:60
* @route '/api/points/list-view'
*/
export const listView = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: listView.url(options),
    method: 'get',
})

listView.definition = {
    methods: ["get","head"],
    url: '/api/points/list-view',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PointController::listView
* @see app/Http/Controllers/PointController.php:60
* @route '/api/points/list-view'
*/
listView.url = (options?: RouteQueryOptions) => {
    return listView.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PointController::listView
* @see app/Http/Controllers/PointController.php:60
* @route '/api/points/list-view'
*/
listView.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: listView.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PointController::listView
* @see app/Http/Controllers/PointController.php:60
* @route '/api/points/list-view'
*/
listView.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: listView.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PointController::store
* @see app/Http/Controllers/PointController.php:135
* @route '/api/points'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/points',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PointController::store
* @see app/Http/Controllers/PointController.php:135
* @route '/api/points'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PointController::store
* @see app/Http/Controllers/PointController.php:135
* @route '/api/points'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PointController::destroy
* @see app/Http/Controllers/PointController.php:177
* @route '/api/points/{point}'
*/
export const destroy = (args: { point: number | { id: number } } | [point: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/points/{point}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\PointController::destroy
* @see app/Http/Controllers/PointController.php:177
* @route '/api/points/{point}'
*/
destroy.url = (args: { point: number | { id: number } } | [point: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return destroy.definition.url
            .replace('{point}', parsedArgs.point.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PointController::destroy
* @see app/Http/Controllers/PointController.php:177
* @route '/api/points/{point}'
*/
destroy.delete = (args: { point: number | { id: number } } | [point: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

const points = {
    index,
    listView,
    store,
    destroy,
    images,
}

export default points