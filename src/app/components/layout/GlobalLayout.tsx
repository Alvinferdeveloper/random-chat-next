import Header from '@/src/app/components/layout/Header'
import Footer from '@/src/app/components/layout/Footer'
export default function GlobalLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <div className="flex-1">{children}</div>
            <Footer />
        </div>
    );
}