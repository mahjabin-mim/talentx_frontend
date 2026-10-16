import type { JobRow, JobStatus } from "../EmployerDashboard.type";
import type { JobsTableProps } from "../EmployerDashboard.interface";
import {
    ChevronLeft,
    ChevronRight,
    Pencil,
    Play,
    Pause,
    Share2,
    Search,
    Trash2,
    User,
    MoreVertical,
    MapPin,
    Sparkles,
} from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const JobsTable = ({
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    page,
    setPage,
    totalPages,
    statusOptions,
    jobsError,
    loading,
    hasFetchedOnce,
    displayJobs,
    isMutatingJob,
    toggleStatus,
    setDeleteTarget,
    setShareTarget,
    router,
}: JobsTableProps) => {
    const statusStyles: Record<JobStatus, string> = {
        Active: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
        Closed: "bg-slate-500/10 text-slate-600 border-slate-500/20",
        Draft: "bg-amber-500/10 text-amber-600 border-amber-500/20",
        Expired: "bg-rose-500/10 text-rose-600 border-rose-500/20",
        Deactivated: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    };

    return (
        <div className="animate-in fade-in duration-700">
            {/* TABLE HEADER & FILTERS */}
            <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h2 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
                        Manage <span className="text-gradient">Positions</span>
                        <div className="flex h-6 items-center justify-center rounded-full bg-brand-primary/10 px-2 text-[10px] font-black text-brand-primary uppercase tracking-widest">
                            {displayJobs.length} active
                        </div>
                    </h2>
                    <p className="mt-1 text-sm font-medium text-muted-foreground">
                        Manage your job listings and track applicant progress.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-brand-primary transition-colors" size={18} />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by title..."
                            className="h-11 w-[280px] rounded-xl border border-border bg-white pl-10 pr-4 text-sm font-bold outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 transition-all"
                        />
                    </div>
                    
                    <Select
                        value={statusFilter}
                        onValueChange={(val) => setStatusFilter(val as "All" | JobStatus)}
                    >
                        <SelectTrigger className="!h-11 w-[180px] rounded-xl border border-border bg-white px-4 py-0 text-sm font-bold outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 transition-all shadow-sm">
                            <SelectValue placeholder="Status Filter" />
                        </SelectTrigger>
                        <SelectContent>
                            {statusOptions.map((status: string) => (
                                <SelectItem key={status} value={status}>
                                    {status === "All" ? "All Statuses" : status}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {jobsError && (
                <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-800 animate-in shake-1">
                    {jobsError}
                </div>
            )}

            {/* TABLE BODY */}
            <div className="relative overflow-hidden rounded-[2rem] border border-border bg-white/60 shadow-xl backdrop-blur-xl">
                {!hasFetchedOnce ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-primary/20 border-t-brand-primary" />
                        <p className="text-sm font-black text-muted-foreground uppercase tracking-widest">Gathering job data...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1000px] border-collapse text-left">
                            <thead>
                                <tr className="border-b border-border bg-muted/30">
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground">Job Details</th>
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground text-center">Applicants</th>
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground text-center">Status</th>
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className={`divide-y divide-border/50 transition-opacity duration-300 ${loading ? "opacity-50" : "opacity-100"}`}>
                                {displayJobs.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-20 text-center">
                                            <div className="flex flex-col items-center">
                                                <div className="mb-4 rounded-full bg-muted p-4 text-muted-foreground"><Search size={32} /></div>
                                                <h4 className="text-lg font-black text-foreground">No jobs found</h4>
                                                <p className="text-sm text-muted-foreground">Try adjusting your filters or post a new job.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    displayJobs.map((job: JobRow) => (
                                        <tr key={job.jobId} className="group hover:bg-brand-primary/[0.02] transition-colors">
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col">
                                                    <button
                                                        onClick={() => router.push(`/employer/jobs/${job.jobId}/applicants`)}
                                                        className="text-left text-base font-black text-foreground hover:text-brand-primary transition-colors line-clamp-1"
                                                    >
                                                        {job.title}
                                                    </button>
                                                    <div className="mt-1 flex items-center gap-3 text-xs font-bold text-muted-foreground">
                                                        <span className="flex items-center gap-1"><MapPin size={12} /> {job.location}</span>
                                                        <span className="h-1 w-1 rounded-full bg-border" />
                                                        <span className="flex items-center gap-1"><Sparkles size={12} className="text-ai-glow" /> AI Rank Enabled</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <button 
                                                    onClick={() => router.push(`/employer/jobs/${job.jobId}/applicants`)}
                                                    className="inline-flex flex-col items-center gap-0.5 rounded-xl border border-transparent px-3 py-1.5 transition-all hover:border-brand-primary/20 hover:bg-white hover:shadow-sm"
                                                >
                                                    <span className="text-xl font-black text-foreground">{job.applicants}</span>
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">Candidates</span>
                                                </button>
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <span className={`inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-widest ${statusStyles[job.status]}`}>
                                                    {job.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        title="View Talents"
                                                        onClick={() => router.push(`/employer/jobs/${job.jobId}/talents`)}
                                                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-white text-muted-foreground hover:border-brand-primary/30 hover:bg-brand-primary hover:text-white transition-all active:scale-95"
                                                    >
                                                        <User size={16} />
                                                    </button>
                                                    <button
                                                        title="Edit Job"
                                                        onClick={() => router.push(`/employer/jobs/edit?jobId=${job.jobId}`)}
                                                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-white text-muted-foreground hover:border-blue-300 hover:bg-blue-500 hover:text-white transition-all active:scale-95"
                                                    >
                                                        <Pencil size={16} />
                                                    </button>
                                                    <button
                                                        title={job.status === "Deactivated" ? "Activate" : "Deactivate"}
                                                        onClick={() => void toggleStatus(job)}
                                                        disabled={isMutatingJob === job.jobId}
                                                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-white text-muted-foreground hover:border-purple-300 hover:bg-purple-500 hover:text-white transition-all active:scale-95 disabled:opacity-50"
                                                    >
                                                        {job.status === "Deactivated" ? <Play size={16} /> : <Pause size={16} />}
                                                    </button>
                                                    
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <button
                                                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-white text-muted-foreground hover:bg-muted transition-all active:scale-95"
                                                            >
                                                                <MoreVertical size={16} />
                                                            </button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={() => setShareTarget(job)}>
                                                                <Share2 size={14} className="mr-2" /> Quick Share
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem 
                                                                onClick={() => setDeleteTarget(job)}
                                                                className="text-red-600 focus:text-red-600 focus:bg-red-50"
                                                            >
                                                                <Trash2 size={14} className="mr-2" /> Delete Position
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* TABLE FOOTER */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between border-t border-border bg-muted/20 px-6 py-4">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                            Page <span className="text-foreground">{page}</span> of {totalPages}
                        </span>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setPage((p: number) => Math.max(1, p - 1))}
                                disabled={page <= 1 || loading}
                                className="flex h-9 items-center gap-2 rounded-lg border border-border bg-white px-4 text-xs font-black transition-all hover:bg-muted disabled:opacity-50"
                            >
                                <ChevronLeft size={14} /> Previous
                            </button>
                            <button
                                onClick={() => setPage((p: number) => p + 1)}
                                disabled={page >= totalPages || loading}
                                className="flex h-9 items-center gap-2 rounded-lg border border-border bg-white px-4 text-xs font-black transition-all hover:bg-muted disabled:opacity-50"
                            >
                                Next <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
