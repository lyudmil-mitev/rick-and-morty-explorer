import { FormEvent, useId } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

type FilterOption = {
    label: string;
    value: string;
}

export type FilterField = {
    name: string;
    label: string;
    control: "text" | "select";
    placeholder?: string;
    options?: FilterOption[];
}

function getActiveFilters(fields: FilterField[], params: URLSearchParams) {
    return fields.flatMap((field) => {
        const value = params.get(field.name);
        if (!value) {
            return [];
        }

        const option = field.options?.find((item) => item.value === value);
        return [{
            label: field.label,
            value: option?.label ?? value,
        }];
    });
}

function FilterFields({ fields, params }: { fields: FilterField[], params: URLSearchParams }) {
    const idPrefix = useId();

    return (
        <div className="grid gap-3">
            {fields.map((field) => {
                const id = `${idPrefix}-${field.name}`;
                const inputClass = "mt-1 w-full rounded-md border border-cyan-700/20 bg-white/85 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-lime-500 focus:ring-2 focus:ring-lime-300 dark:border-cyan-300/15 dark:bg-slate-900/80 dark:text-slate-100 dark:focus:border-lime-300";

                return (
                    <label key={field.name} htmlFor={id} className="block text-xs font-bold uppercase tracking-wide text-slate-600 dark:text-slate-300">
                        {field.label}
                        {field.control === "select" ? (
                            <select id={id} name={field.name} defaultValue={params.get(field.name) ?? ""} className={inputClass}>
                                <option value="">Any</option>
                                {field.options?.map((option) => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                            </select>
                        ) : (
                            <input
                                id={id}
                                name={field.name}
                                type="text"
                                defaultValue={params.get(field.name) ?? ""}
                                placeholder={field.placeholder}
                                className={inputClass}
                            />
                        )}
                    </label>
                );
            })}
        </div>
    );
}

export default function FilterPanel({ fields }: { fields: FilterField[] }) {
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const location = useLocation();
    const activeFilters = getActiveFilters(fields, params);

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const nextParams = new URLSearchParams();

        for (const field of fields) {
            const value = String(formData.get(field.name) ?? "").trim();
            if (value.length > 0) {
                nextParams.set(field.name, value);
            }
        }

        nextParams.set("page", "1");
        navigate(`${location.pathname}?${nextParams.toString()}`);
    }

    function clearFilters() {
        navigate(`${location.pathname}?page=1`);
    }

    function renderContent() {
        return (
            <form onSubmit={handleSubmit} className="space-y-4">
                <FilterFields fields={fields} params={params} />
                {activeFilters.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5" aria-label="Active filters">
                        {activeFilters.map((filter) => (
                            <span key={`${filter.label}-${filter.value}`} className="rounded-full border border-lime-400/40 bg-lime-300/15 px-2 py-1 text-[0.65rem] font-bold uppercase tracking-wide text-lime-800 dark:text-lime-200">
                                {filter.label}: {filter.value}
                            </span>
                        ))}
                    </div>
                ) : null}
                <div className="flex gap-2">
                    <button type="submit" className="flex-1 rounded-md bg-lime-300 px-3 py-2 text-sm font-bold text-slate-950 shadow-sm transition hover:bg-lime-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400">
                        Apply
                    </button>
                    <button type="button" onClick={clearFilters} className="rounded-md border border-cyan-700/20 px-3 py-2 text-sm font-bold text-slate-700 transition hover:border-lime-500 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400 dark:border-cyan-300/20 dark:text-slate-200 dark:hover:text-lime-200">
                        Clear
                    </button>
                </div>
            </form>
        );
    }

    return (
        <>
            <aside className="hidden rounded-lg border border-cyan-700/15 bg-[#fbfaf2]/85 p-4 text-left shadow-md shadow-slate-300/30 backdrop-blur dark:border-cyan-300/15 dark:bg-slate-800/80 dark:shadow-black/20 md:block md:sticky md:top-4">
                <h2 className="mb-4 text-sm font-extrabold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">Filters</h2>
                {renderContent()}
            </aside>
            <details className="rounded-lg border border-cyan-700/15 bg-[#fbfaf2]/85 p-3 text-left shadow-md shadow-slate-300/30 backdrop-blur dark:border-cyan-300/15 dark:bg-slate-800/80 dark:shadow-black/20 md:hidden">
                <summary className="cursor-pointer text-sm font-extrabold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">
                    Filters {activeFilters.length > 0 ? `(${activeFilters.length})` : ""}
                </summary>
                <div className="pt-4">{renderContent()}</div>
            </details>
        </>
    );
}
