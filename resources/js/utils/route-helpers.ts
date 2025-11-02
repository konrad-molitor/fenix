import type { Method } from '@inertiajs/core'
import type { RouteDefinition } from '@/wayfinder'

/**
 * Converts a RouteDefinition to Inertia Form props
 * This replaces the deprecated .form() methods from Wayfinder
 */
export function toFormProps(
    route: RouteDefinition<Method>
): { action: string; method: Method } {
    return {
        action: route.url,
        method: route.method as Method,
    }
}

