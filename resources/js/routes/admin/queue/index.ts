import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\QueueController::stats
* @see app/Http/Controllers/Admin/QueueController.php:16
* @route '/admin/queue/stats'
*/
export const stats = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stats.url(options),
    method: 'get',
})

stats.definition = {
    methods: ["get","head"],
    url: '/admin/queue/stats',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\QueueController::stats
* @see app/Http/Controllers/Admin/QueueController.php:16
* @route '/admin/queue/stats'
*/
stats.url = (options?: RouteQueryOptions) => {
    return stats.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\QueueController::stats
* @see app/Http/Controllers/Admin/QueueController.php:16
* @route '/admin/queue/stats'
*/
stats.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stats.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\QueueController::stats
* @see app/Http/Controllers/Admin/QueueController.php:16
* @route '/admin/queue/stats'
*/
stats.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: stats.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\QueueController::stats
* @see app/Http/Controllers/Admin/QueueController.php:16
* @route '/admin/queue/stats'
*/
const statsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: stats.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\QueueController::stats
* @see app/Http/Controllers/Admin/QueueController.php:16
* @route '/admin/queue/stats'
*/
statsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: stats.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\QueueController::stats
* @see app/Http/Controllers/Admin/QueueController.php:16
* @route '/admin/queue/stats'
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
* @see \App\Http\Controllers\Admin\QueueController::pending
* @see app/Http/Controllers/Admin/QueueController.php:83
* @route '/admin/queue/pending'
*/
export const pending = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pending.url(options),
    method: 'get',
})

pending.definition = {
    methods: ["get","head"],
    url: '/admin/queue/pending',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\QueueController::pending
* @see app/Http/Controllers/Admin/QueueController.php:83
* @route '/admin/queue/pending'
*/
pending.url = (options?: RouteQueryOptions) => {
    return pending.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\QueueController::pending
* @see app/Http/Controllers/Admin/QueueController.php:83
* @route '/admin/queue/pending'
*/
pending.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pending.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\QueueController::pending
* @see app/Http/Controllers/Admin/QueueController.php:83
* @route '/admin/queue/pending'
*/
pending.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: pending.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\QueueController::pending
* @see app/Http/Controllers/Admin/QueueController.php:83
* @route '/admin/queue/pending'
*/
const pendingForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: pending.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\QueueController::pending
* @see app/Http/Controllers/Admin/QueueController.php:83
* @route '/admin/queue/pending'
*/
pendingForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: pending.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\QueueController::pending
* @see app/Http/Controllers/Admin/QueueController.php:83
* @route '/admin/queue/pending'
*/
pendingForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: pending.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

pending.form = pendingForm

/**
* @see \App\Http\Controllers\Admin\QueueController::failed
* @see app/Http/Controllers/Admin/QueueController.php:127
* @route '/admin/queue/failed'
*/
export const failed = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: failed.url(options),
    method: 'get',
})

failed.definition = {
    methods: ["get","head"],
    url: '/admin/queue/failed',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\QueueController::failed
* @see app/Http/Controllers/Admin/QueueController.php:127
* @route '/admin/queue/failed'
*/
failed.url = (options?: RouteQueryOptions) => {
    return failed.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\QueueController::failed
* @see app/Http/Controllers/Admin/QueueController.php:127
* @route '/admin/queue/failed'
*/
failed.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: failed.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\QueueController::failed
* @see app/Http/Controllers/Admin/QueueController.php:127
* @route '/admin/queue/failed'
*/
failed.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: failed.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\QueueController::failed
* @see app/Http/Controllers/Admin/QueueController.php:127
* @route '/admin/queue/failed'
*/
const failedForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: failed.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\QueueController::failed
* @see app/Http/Controllers/Admin/QueueController.php:127
* @route '/admin/queue/failed'
*/
failedForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: failed.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\QueueController::failed
* @see app/Http/Controllers/Admin/QueueController.php:127
* @route '/admin/queue/failed'
*/
failedForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: failed.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

failed.form = failedForm

/**
* @see \App\Http\Controllers\Admin\QueueController::retry
* @see app/Http/Controllers/Admin/QueueController.php:174
* @route '/admin/queue/retry/{id}'
*/
export const retry = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: retry.url(args, options),
    method: 'post',
})

retry.definition = {
    methods: ["post"],
    url: '/admin/queue/retry/{id}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\QueueController::retry
* @see app/Http/Controllers/Admin/QueueController.php:174
* @route '/admin/queue/retry/{id}'
*/
retry.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    if (Array.isArray(args)) {
        args = {
            id: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        id: args.id,
    }

    return retry.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\QueueController::retry
* @see app/Http/Controllers/Admin/QueueController.php:174
* @route '/admin/queue/retry/{id}'
*/
retry.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: retry.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\QueueController::retry
* @see app/Http/Controllers/Admin/QueueController.php:174
* @route '/admin/queue/retry/{id}'
*/
const retryForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: retry.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\QueueController::retry
* @see app/Http/Controllers/Admin/QueueController.php:174
* @route '/admin/queue/retry/{id}'
*/
retryForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: retry.url(args, options),
    method: 'post',
})

retry.form = retryForm

/**
* @see \App\Http\Controllers\Admin\QueueController::retryAll
* @see app/Http/Controllers/Admin/QueueController.php:192
* @route '/admin/queue/retry-all'
*/
export const retryAll = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: retryAll.url(options),
    method: 'post',
})

retryAll.definition = {
    methods: ["post"],
    url: '/admin/queue/retry-all',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\QueueController::retryAll
* @see app/Http/Controllers/Admin/QueueController.php:192
* @route '/admin/queue/retry-all'
*/
retryAll.url = (options?: RouteQueryOptions) => {
    return retryAll.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\QueueController::retryAll
* @see app/Http/Controllers/Admin/QueueController.php:192
* @route '/admin/queue/retry-all'
*/
retryAll.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: retryAll.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\QueueController::retryAll
* @see app/Http/Controllers/Admin/QueueController.php:192
* @route '/admin/queue/retry-all'
*/
const retryAllForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: retryAll.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\QueueController::retryAll
* @see app/Http/Controllers/Admin/QueueController.php:192
* @route '/admin/queue/retry-all'
*/
retryAllForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: retryAll.url(options),
    method: 'post',
})

retryAll.form = retryAllForm

/**
* @see \App\Http\Controllers\Admin\QueueController::deleteFailed
* @see app/Http/Controllers/Admin/QueueController.php:212
* @route '/admin/queue/failed/{id}'
*/
export const deleteFailed = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteFailed.url(args, options),
    method: 'delete',
})

deleteFailed.definition = {
    methods: ["delete"],
    url: '/admin/queue/failed/{id}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\QueueController::deleteFailed
* @see app/Http/Controllers/Admin/QueueController.php:212
* @route '/admin/queue/failed/{id}'
*/
deleteFailed.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    if (Array.isArray(args)) {
        args = {
            id: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        id: args.id,
    }

    return deleteFailed.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\QueueController::deleteFailed
* @see app/Http/Controllers/Admin/QueueController.php:212
* @route '/admin/queue/failed/{id}'
*/
deleteFailed.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteFailed.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Admin\QueueController::deleteFailed
* @see app/Http/Controllers/Admin/QueueController.php:212
* @route '/admin/queue/failed/{id}'
*/
const deleteFailedForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: deleteFailed.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\QueueController::deleteFailed
* @see app/Http/Controllers/Admin/QueueController.php:212
* @route '/admin/queue/failed/{id}'
*/
deleteFailedForm.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: deleteFailed.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

deleteFailed.form = deleteFailedForm

/**
* @see \App\Http\Controllers\Admin\QueueController::flushFailed
* @see app/Http/Controllers/Admin/QueueController.php:239
* @route '/admin/queue/flush-failed'
*/
export const flushFailed = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: flushFailed.url(options),
    method: 'post',
})

flushFailed.definition = {
    methods: ["post"],
    url: '/admin/queue/flush-failed',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\QueueController::flushFailed
* @see app/Http/Controllers/Admin/QueueController.php:239
* @route '/admin/queue/flush-failed'
*/
flushFailed.url = (options?: RouteQueryOptions) => {
    return flushFailed.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\QueueController::flushFailed
* @see app/Http/Controllers/Admin/QueueController.php:239
* @route '/admin/queue/flush-failed'
*/
flushFailed.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: flushFailed.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\QueueController::flushFailed
* @see app/Http/Controllers/Admin/QueueController.php:239
* @route '/admin/queue/flush-failed'
*/
const flushFailedForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: flushFailed.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\QueueController::flushFailed
* @see app/Http/Controllers/Admin/QueueController.php:239
* @route '/admin/queue/flush-failed'
*/
flushFailedForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: flushFailed.url(options),
    method: 'post',
})

flushFailed.form = flushFailedForm

const queue = {
    stats,
    pending,
    failed,
    retry,
    retryAll,
    deleteFailed,
    flushFailed,
}

export default queue