import Header from '@/components/layout/main/Header'
import Footer from '@/components/layout/main/Footer'
export default function GlobalLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <div className="flex-1">{children}</div>
            <Footer />
        </div>
    );
}