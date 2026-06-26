import { FormEvent, useId } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { cx, ui } from "../styles/ui";

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
                return (
                    <label key={field.name} htmlFor={id} className={ui.formLabel}>
                        {field.label}
                        {field.control === "select" ? (
                            <select id={id} name={field.name} defaultValue={params.get(field.name) ?? ""} className={ui.input}>
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
                                className={ui.input}
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
                            <span key={`${filter.label}-${filter.value}`} className={ui.activeFilterBadge}>
                                {filter.label}: {filter.value}
                            </span>
                        ))}
                    </div>
                ) : null}
                <div className="flex gap-2">
                    <button type="submit" className={cx("flex-1", ui.primaryButton)}>
                        Apply
                    </button>
                    <button type="button" onClick={clearFilters} className={ui.secondaryButton}>
                        Clear
                    </button>
                </div>
            </form>
        );
    }

    return (
        <>
            <aside className={cx("hidden p-4 text-left md:block md:sticky md:top-4", ui.translucentPanel)}>
                <h2 className="mb-4 text-sm font-extrabold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">Filters</h2>
                {renderContent()}
            </aside>
            <details className={cx("p-3 text-left md:hidden", ui.translucentPanel)}>
                <summary className="cursor-pointer text-sm font-extrabold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">
                    Filters {activeFilters.length > 0 ? `(${activeFilters.length})` : ""}
                </summary>
                <div className="pt-4">{renderContent()}</div>
            </details>
        </>
    );
}
