import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PointImageController::index
* @see app/Http/Controllers/PointImageController.php:21
* @route '/api/points/{point}/images'
*/
export const index = (args: { point: number | { id: number } } | [point: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/points/{point}/images',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PointImageController::index
* @see app/Http/Controllers/PointImageController.php:21
* @route '/api/points/{point}/images'
*/
index.url = (args: { point: number | { id: number } } | [point: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return index.definition.url
            .replace('{point}', parsedArgs.point.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PointImageController::index
* @see app/Http/Controllers/PointImageController.php:21
* @route '/api/points/{point}/images'
*/
index.get = (args: { point: number | { id: number } } | [point: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PointImageController::index
* @see app/Http/Controllers/PointImageController.php:21
* @route '/api/points/{point}/images'
*/
index.head = (args: { point: number | { id: number } } | [point: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PointImageController::store
* @see app/Http/Controllers/PointImageController.php:38
* @route '/api/points/{point}/images'
*/
export const store = (args: { point: number | { id: number } } | [point: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/points/{point}/images',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PointImageController::store
* @see app/Http/Controllers/PointImageController.php:38
* @route '/api/points/{point}/images'
*/
store.url = (args: { point: number | { id: number } } | [point: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return store.definition.url
            .replace('{point}', parsedArgs.point.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PointImageController::store
* @see app/Http/Controllers/PointImageController.php:38
* @route '/api/points/{point}/images'
*/
store.post = (args: { point: number | { id: number } } | [point: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PointImageController::destroy
* @see app/Http/Controllers/PointImageController.php:73
* @route '/api/points/{point}/images/{image}'
*/
export const destroy = (args: { point: number | { id: number }, image: number | { id: number } } | [point: number | { id: number }, image: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/points/{point}/images/{image}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\PointImageController::destroy
* @see app/Http/Controllers/PointImageController.php:73
* @route '/api/points/{point}/images/{image}'
*/
destroy.url = (args: { point: number | { id: number }, image: number | { id: number } } | [point: number | { id: number }, image: number | { id: number } ], options?: RouteQueryOptions) => {
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

    return destroy.definition.url
            .replace('{point}', parsedArgs.point.toString())
            .replace('{image}', parsedArgs.image.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PointImageController::destroy
* @see app/Http/Controllers/PointImageController.php:73
* @route '/api/points/{point}/images/{image}'
*/
destroy.delete = (args: { point: number | { id: number }, image: number | { id: number } } | [point: number | { id: number }, image: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

const PointImageController = { index, store, destroy }

export default PointImageController