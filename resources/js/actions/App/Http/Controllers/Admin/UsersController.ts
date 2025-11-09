import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\UsersController::adminIndex
* @see app/Http/Controllers/Admin/UsersController.php:21
* @route '/admin'
*/
export const adminIndex = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: adminIndex.url(options),
    method: 'get',
})

adminIndex.definition = {
    methods: ["get","head"],
    url: '/admin',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\UsersController::adminIndex
* @see app/Http/Controllers/Admin/UsersController.php:21
* @route '/admin'
*/
adminIndex.url = (options?: RouteQueryOptions) => {
    return adminIndex.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\UsersController::adminIndex
* @see app/Http/Controllers/Admin/UsersController.php:21
* @route '/admin'
*/
adminIndex.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: adminIndex.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\UsersController::adminIndex
* @see app/Http/Controllers/Admin/UsersController.php:21
* @route '/admin'
*/
adminIndex.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: adminIndex.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\UsersController::adminIndex
* @see app/Http/Controllers/Admin/UsersController.php:21
* @route '/admin'
*/
const adminIndexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: adminIndex.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\UsersController::adminIndex
* @see app/Http/Controllers/Admin/UsersController.php:21
* @route '/admin'
*/
adminIndexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: adminIndex.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\UsersController::adminIndex
* @see app/Http/Controllers/Admin/UsersController.php:21
* @route '/admin'
*/
adminIndexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: adminIndex.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

adminIndex.form = adminIndexForm

/**
* @see \App\Http\Controllers\Admin\UsersController::index
* @see app/Http/Controllers/Admin/UsersController.php:44
* @route '/admin/users'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/users',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\UsersController::index
* @see app/Http/Controllers/Admin/UsersController.php:44
* @route '/admin/users'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\UsersController::index
* @see app/Http/Controllers/Admin/UsersController.php:44
* @route '/admin/users'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\UsersController::index
* @see app/Http/Controllers/Admin/UsersController.php:44
* @route '/admin/users'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\UsersController::index
* @see app/Http/Controllers/Admin/UsersController.php:44
* @route '/admin/users'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\UsersController::index
* @see app/Http/Controllers/Admin/UsersController.php:44
* @route '/admin/users'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\UsersController::index
* @see app/Http/Controllers/Admin/UsersController.php:44
* @route '/admin/users'
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
* @see \App\Http\Controllers\Admin\UsersController::updateRole
* @see app/Http/Controllers/Admin/UsersController.php:67
* @route '/admin/users/{user}/role'
*/
export const updateRole = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateRole.url(args, options),
    method: 'patch',
})

updateRole.definition = {
    methods: ["patch"],
    url: '/admin/users/{user}/role',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Admin\UsersController::updateRole
* @see app/Http/Controllers/Admin/UsersController.php:67
* @route '/admin/users/{user}/role'
*/
updateRole.url = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { user: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            user: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        user: typeof args.user === 'object'
        ? args.user.id
        : args.user,
    }

    return updateRole.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\UsersController::updateRole
* @see app/Http/Controllers/Admin/UsersController.php:67
* @route '/admin/users/{user}/role'
*/
updateRole.patch = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateRole.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Admin\UsersController::updateRole
* @see app/Http/Controllers/Admin/UsersController.php:67
* @route '/admin/users/{user}/role'
*/
const updateRoleForm = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateRole.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\UsersController::updateRole
* @see app/Http/Controllers/Admin/UsersController.php:67
* @route '/admin/users/{user}/role'
*/
updateRoleForm.patch = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateRole.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

updateRole.form = updateRoleForm

/**
* @see \App\Http\Controllers\Admin\UsersController::updateProfile
* @see app/Http/Controllers/Admin/UsersController.php:77
* @route '/admin/users/{user}/profile'
*/
export const updateProfile = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateProfile.url(args, options),
    method: 'patch',
})

updateProfile.definition = {
    methods: ["patch"],
    url: '/admin/users/{user}/profile',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Admin\UsersController::updateProfile
* @see app/Http/Controllers/Admin/UsersController.php:77
* @route '/admin/users/{user}/profile'
*/
updateProfile.url = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { user: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            user: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        user: typeof args.user === 'object'
        ? args.user.id
        : args.user,
    }

    return updateProfile.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\UsersController::updateProfile
* @see app/Http/Controllers/Admin/UsersController.php:77
* @route '/admin/users/{user}/profile'
*/
updateProfile.patch = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateProfile.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Admin\UsersController::updateProfile
* @see app/Http/Controllers/Admin/UsersController.php:77
* @route '/admin/users/{user}/profile'
*/
const updateProfileForm = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateProfile.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\UsersController::updateProfile
* @see app/Http/Controllers/Admin/UsersController.php:77
* @route '/admin/users/{user}/profile'
*/
updateProfileForm.patch = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateProfile.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

updateProfile.form = updateProfileForm

/**
* @see \App\Http\Controllers\Admin\UsersController::setPassword
* @see app/Http/Controllers/Admin/UsersController.php:87
* @route '/admin/users/{user}/password'
*/
export const setPassword = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: setPassword.url(args, options),
    method: 'patch',
})

setPassword.definition = {
    methods: ["patch"],
    url: '/admin/users/{user}/password',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Admin\UsersController::setPassword
* @see app/Http/Controllers/Admin/UsersController.php:87
* @route '/admin/users/{user}/password'
*/
setPassword.url = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { user: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            user: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        user: typeof args.user === 'object'
        ? args.user.id
        : args.user,
    }

    return setPassword.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\UsersController::setPassword
* @see app/Http/Controllers/Admin/UsersController.php:87
* @route '/admin/users/{user}/password'
*/
setPassword.patch = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: setPassword.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Admin\UsersController::setPassword
* @see app/Http/Controllers/Admin/UsersController.php:87
* @route '/admin/users/{user}/password'
*/
const setPasswordForm = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: setPassword.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\UsersController::setPassword
* @see app/Http/Controllers/Admin/UsersController.php:87
* @route '/admin/users/{user}/password'
*/
setPasswordForm.patch = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: setPassword.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

setPassword.form = setPasswordForm

/**
* @see \App\Http\Controllers\Admin\UsersController::destroy
* @see app/Http/Controllers/Admin/UsersController.php:99
* @route '/admin/users/{user}'
*/
export const destroy = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/users/{user}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\UsersController::destroy
* @see app/Http/Controllers/Admin/UsersController.php:99
* @route '/admin/users/{user}'
*/
destroy.url = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { user: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            user: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        user: typeof args.user === 'object'
        ? args.user.id
        : args.user,
    }

    return destroy.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\UsersController::destroy
* @see app/Http/Controllers/Admin/UsersController.php:99
* @route '/admin/users/{user}'
*/
destroy.delete = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Admin\UsersController::destroy
* @see app/Http/Controllers/Admin/UsersController.php:99
* @route '/admin/users/{user}'
*/
const destroyForm = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\UsersController::destroy
* @see app/Http/Controllers/Admin/UsersController.php:99
* @route '/admin/users/{user}'
*/
destroyForm.delete = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const UsersController = { adminIndex, index, updateRole, updateProfile, setPassword, destroy }

export default UsersController