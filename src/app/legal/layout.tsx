export default function LegalLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="container mx-auto px-4 py-16 max-w-4xl">
            <div className="prose prose-slate dark:prose-invert max-w-none">
                {children}
            </div>
        </div>
    );
}
