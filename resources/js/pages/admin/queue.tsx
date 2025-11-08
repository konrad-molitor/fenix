import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { usePage } from '@inertiajs/react';
import { ReloadIcon, TrashIcon, PlayIcon } from '@radix-ui/react-icons';
import { useState, useEffect, useCallback } from 'react';
import { SharedData } from '@/types';
import { Table as RadixTable } from '@radix-ui/themes';
import axios from 'axios';

interface JobTypeStats {
    pending: number;
    failed: number;
    processed: number;
}

interface QueueStats {
    pending: number;
    failed: number;
    processed: number;
    success_rate: number;
    by_type: {
        ClassifyPointImageJob: JobTypeStats;
        ClassifyPointJob: JobTypeStats;
    };
}

interface PendingJob {
    id: number;
    name: string;
    queue: string;
    attempts: number;
    is_reserved: boolean;
    available_at: string;
    created_at: string;
}

interface FailedJob {
    id: number;
    uuid: string;
    name: string;
    queue: string;
    exception: string;
    full_exception: string;
    failed_at: string;
}

type JobFilter = 'all' | 'ClassifyPointImageJob' | 'ClassifyPointJob';

export default function AdminQueue() {
    const { translations } = usePage<SharedData>().props;
    const [stats, setStats] = useState<QueueStats | null>(null);
    const [pendingJobs, setPendingJobs] = useState<PendingJob[]>([]);
    const [failedJobs, setFailedJobs] = useState<FailedJob[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedJob, setSelectedJob] = useState<FailedJob | null>(null);
    const [showExceptionDialog, setShowExceptionDialog] = useState(false);
    const [showRetryAllDialog, setShowRetryAllDialog] = useState(false);
    const [jobFilter, setJobFilter] = useState<JobFilter>('all');

    const fetchData = useCallback(async (filter: JobFilter) => {
        try {
            const typeParam = filter !== 'all' ? `?type=${filter}` : '';
            
            const [statsRes, pendingRes, failedRes] = await Promise.all([
                axios.get('/admin/queue/stats'),
                axios.get(`/admin/queue/pending${typeParam}`),
                axios.get(`/admin/queue/failed${typeParam}`),
            ]);

            setStats(statsRes.data);
            setPendingJobs(pendingRes.data.data);
            setFailedJobs(failedRes.data.data);
        } catch (error) {
            console.error('Failed to fetch queue data:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData(jobFilter);
        
        // Auto-refresh every 10 seconds
        const interval = setInterval(() => fetchData(jobFilter), 10000);
        
        return () => clearInterval(interval);
    }, [jobFilter, fetchData]);

    const handleRetry = async (id: number) => {
        try {
            await axios.post(`/admin/queue/retry/${id}`);
            fetchData(jobFilter);
        } catch (error) {
            console.error('Failed to retry job:', error);
        }
    };

    const handleRetryAll = async () => {
        try {
            await axios.post('/admin/queue/retry-all');
            setShowRetryAllDialog(false);
            fetchData(jobFilter);
        } catch (error) {
            console.error('Failed to retry all jobs:', error);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await axios.delete(`/admin/queue/failed/${id}`);
            fetchData(jobFilter);
        } catch (error) {
            console.error('Failed to delete job:', error);
        }
    };

    const showException = (job: FailedJob) => {
        setSelectedJob(job);
        setShowExceptionDialog(true);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <ReloadIcon className="h-6 w-6 animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            {/* Statistics Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {translations['admin.queue.pending'] || 'Pending Jobs'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.pending || 0}</div>
                        <p className="text-xs text-muted-foreground">
                            {translations['admin.queue.in_queue'] || 'In queue'}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {translations['admin.queue.failed'] || 'Failed Jobs'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-destructive">{stats?.failed || 0}</div>
                        <p className="text-xs text-muted-foreground">
                            {translations['admin.queue.need_attention'] || 'Need attention'}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {translations['admin.queue.processed'] || 'Processed (24h)'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.processed || 0}</div>
                        <p className="text-xs text-muted-foreground">
                            {translations['admin.queue.last_24h'] || 'Last 24 hours'}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {translations['admin.queue.success_rate'] || 'Success Rate'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.success_rate || 0}%</div>
                        <p className="text-xs text-muted-foreground">
                            {translations['admin.queue.all_time'] || 'All time'}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Job Type Statistics */}
            {stats?.by_type && (
                <div className={`grid gap-4 ${jobFilter === 'all' ? 'md:grid-cols-2' : 'md:grid-cols-1'}`}>
                    {(jobFilter === 'all' || jobFilter === 'ClassifyPointImageJob') && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm font-medium">Image Classification Jobs</CardTitle>
                                <CardDescription className="text-xs">ClassifyPointImageJob</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-3 gap-2 text-sm">
                                    <div>
                                        <div className="text-lg font-semibold">{stats.by_type.ClassifyPointImageJob.pending}</div>
                                        <div className="text-xs text-muted-foreground">Pending</div>
                                    </div>
                                    <div>
                                        <div className="text-lg font-semibold text-destructive">{stats.by_type.ClassifyPointImageJob.failed}</div>
                                        <div className="text-xs text-muted-foreground">Failed</div>
                                    </div>
                                    <div>
                                        <div className="text-lg font-semibold text-green-600">{stats.by_type.ClassifyPointImageJob.processed}</div>
                                        <div className="text-xs text-muted-foreground">Processed (24h)</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {(jobFilter === 'all' || jobFilter === 'ClassifyPointJob') && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm font-medium">Point Classification Jobs</CardTitle>
                                <CardDescription className="text-xs">ClassifyPointJob</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-3 gap-2 text-sm">
                                    <div>
                                        <div className="text-lg font-semibold">{stats.by_type.ClassifyPointJob.pending}</div>
                                        <div className="text-xs text-muted-foreground">Pending</div>
                                    </div>
                                    <div>
                                        <div className="text-lg font-semibold text-destructive">{stats.by_type.ClassifyPointJob.failed}</div>
                                        <div className="text-xs text-muted-foreground">Failed</div>
                                    </div>
                                    <div>
                                        <div className="text-lg font-semibold text-green-600">{stats.by_type.ClassifyPointJob.processed}</div>
                                        <div className="text-xs text-muted-foreground">Processed (24h)</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            )}

            {/* Job Filter Buttons */}
            <div className="flex gap-2">
                <Button
                    variant={jobFilter === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setJobFilter('all')}
                >
                    All Jobs
                </Button>
                <Button
                    variant={jobFilter === 'ClassifyPointImageJob' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setJobFilter('ClassifyPointImageJob')}
                >
                    Image Classification
                </Button>
                <Button
                    variant={jobFilter === 'ClassifyPointJob' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setJobFilter('ClassifyPointJob')}
                >
                    Point Classification
                </Button>
            </div>

            {/* Pending Jobs Table */}
            <Card>
                <CardHeader>
                    <CardTitle>{translations['admin.queue.pending_jobs'] || 'Pending Jobs'}</CardTitle>
                    <CardDescription>
                        {translations['admin.queue.pending_description'] || 'Jobs waiting to be processed'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {pendingJobs.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            {translations['admin.queue.no_pending_jobs'] || 'No pending jobs'}
                        </div>
                    ) : (
                        <RadixTable.Root variant="surface" size="2">
                            <RadixTable.Header>
                                <RadixTable.Row>
                                    <RadixTable.ColumnHeaderCell>ID</RadixTable.ColumnHeaderCell>
                                    <RadixTable.ColumnHeaderCell>{translations['admin.queue.job_name'] || 'Job'}</RadixTable.ColumnHeaderCell>
                                    <RadixTable.ColumnHeaderCell>{translations['admin.queue.attempts'] || 'Attempts'}</RadixTable.ColumnHeaderCell>
                                    <RadixTable.ColumnHeaderCell>{translations['admin.queue.status'] || 'Status'}</RadixTable.ColumnHeaderCell>
                                    <RadixTable.ColumnHeaderCell>{translations['admin.queue.created'] || 'Created'}</RadixTable.ColumnHeaderCell>
                                </RadixTable.Row>
                            </RadixTable.Header>
                            <RadixTable.Body>
                                {pendingJobs.map((job) => (
                                    <RadixTable.Row key={job.id}>
                                        <RadixTable.Cell>{job.id}</RadixTable.Cell>
                                        <RadixTable.Cell>{job.name}</RadixTable.Cell>
                                        <RadixTable.Cell>
                                            <Badge variant={job.attempts > 1 ? 'destructive' : 'secondary'}>
                                                {job.attempts}/3
                                            </Badge>
                                        </RadixTable.Cell>
                                        <RadixTable.Cell>
                                            <Badge variant={job.is_reserved ? 'default' : 'outline'}>
                                                {job.is_reserved ? (translations['admin.queue.processing'] || 'Processing') : (translations['admin.queue.waiting'] || 'Waiting')}
                                            </Badge>
                                        </RadixTable.Cell>
                                        <RadixTable.Cell>{job.created_at}</RadixTable.Cell>
                                    </RadixTable.Row>
                                ))}
                            </RadixTable.Body>
                        </RadixTable.Root>
                    )}
                </CardContent>
            </Card>

            {/* Failed Jobs Table */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>{translations['admin.queue.failed_jobs'] || 'Failed Jobs'}</CardTitle>
                        <CardDescription>
                            {translations['admin.queue.failed_description'] || 'Jobs that failed after all retry attempts'}
                        </CardDescription>
                    </div>
                    {failedJobs.length > 1 && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowRetryAllDialog(true)}
                        >
                            <PlayIcon className="h-4 w-4 mr-2" />
                            {translations['admin.queue.retry_all'] || 'Retry All'}
                        </Button>
                    )}
                </CardHeader>
                <CardContent>
                    {failedJobs.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            {translations['admin.queue.no_failed_jobs'] || 'No failed jobs'}
                        </div>
                    ) : (
                        <RadixTable.Root variant="surface" size="2">
                            <RadixTable.Header>
                                <RadixTable.Row>
                                    <RadixTable.ColumnHeaderCell>ID</RadixTable.ColumnHeaderCell>
                                    <RadixTable.ColumnHeaderCell>{translations['admin.queue.job_name'] || 'Job'}</RadixTable.ColumnHeaderCell>
                                    <RadixTable.ColumnHeaderCell>{translations['admin.queue.error'] || 'Error'}</RadixTable.ColumnHeaderCell>
                                    <RadixTable.ColumnHeaderCell>{translations['admin.queue.failed_at'] || 'Failed At'}</RadixTable.ColumnHeaderCell>
                                    <RadixTable.ColumnHeaderCell>{translations['admin.queue.actions'] || 'Actions'}</RadixTable.ColumnHeaderCell>
                                </RadixTable.Row>
                            </RadixTable.Header>
                            <RadixTable.Body>
                                {failedJobs.map((job) => (
                                    <RadixTable.Row key={job.id}>
                                        <RadixTable.Cell>{job.id}</RadixTable.Cell>
                                        <RadixTable.Cell>{job.name}</RadixTable.Cell>
                                        <RadixTable.Cell>
                                            <button
                                                onClick={() => showException(job)}
                                                className="text-sm text-muted-foreground hover:text-foreground underline max-w-md truncate block"
                                            >
                                                {job.exception}
                                            </button>
                                        </RadixTable.Cell>
                                        <RadixTable.Cell>{job.failed_at}</RadixTable.Cell>
                                        <RadixTable.Cell>
                                            <div className="flex gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7"
                                                    onClick={() => handleRetry(job.id)}
                                                    title={translations['admin.queue.retry'] || 'Retry'}
                                                >
                                                    <PlayIcon className="h-3.5 w-3.5" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7 text-destructive hover:text-destructive"
                                                    onClick={() => handleDelete(job.id)}
                                                    title={translations['admin.queue.delete'] || 'Delete'}
                                                >
                                                    <TrashIcon className="h-3.5 w-3.5" />
                                                </Button>
                                            </div>
                                        </RadixTable.Cell>
                                    </RadixTable.Row>
                                ))}
                            </RadixTable.Body>
                        </RadixTable.Root>
                    )}
                </CardContent>
            </Card>

            {/* Exception Dialog */}
            <AlertDialog open={showExceptionDialog} onOpenChange={setShowExceptionDialog}>
                <AlertDialogContent className="max-w-3xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle>{translations['admin.queue.exception_details'] || 'Exception Details'}</AlertDialogTitle>
                        <AlertDialogDescription>
                            Job ID: {selectedJob?.id} - {selectedJob?.name}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="max-h-96 overflow-auto">
                        <pre className="text-xs bg-muted p-4 rounded-md whitespace-pre-wrap">
                            {selectedJob?.full_exception}
                        </pre>
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{translations['actions.close'] || 'Close'}</AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Retry All Dialog */}
            <AlertDialog open={showRetryAllDialog} onOpenChange={setShowRetryAllDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{translations['admin.queue.confirm_retry_all'] || 'Retry All Failed Jobs?'}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {translations['admin.queue.confirm_retry_all_description'] || `This will retry all ${failedJobs.length} failed jobs. Are you sure?`}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{translations['actions.cancel'] || 'Cancel'}</AlertDialogCancel>
                        <AlertDialogAction onClick={handleRetryAll}>
                            {translations['actions.confirm'] || 'Confirm'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

