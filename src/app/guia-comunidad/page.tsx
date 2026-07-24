import { Metadata } from "next";
import { APP_NAME } from "@/src/app/constants";

export const metadata: Metadata = {
    title: "Normas de la Comunidad",
    description: `Nuestras reglas para mantener un ambiente seguro y divertido en ${APP_NAME}.`,
};

export default function CommunityGuidePage() {
    return (
        <div className="container mx-auto px-4 py-16 max-w-3xl">
            <h1 className="text-4xl font-extrabold mb-8">Normas de la Comunidad</h1>
            <p className="text-lg text-muted-foreground mb-10">
                Queremos que {APP_NAME} sea un lugar increíble para todos. Para lograrlo, pedimos a todos los usuarios que sigan estas reglas básicas:
            </p>

            <div className="space-y-12">
                <section>
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <span>🤝</span> Respeto Mutuo
                    </h2>
                    <p className="text-muted-foreground">
                        Trata a los demás como te gustaría ser tratado. No toleramos insultos, acoso, ni discriminación de ningún tipo.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <span>🛡️</span> Seguridad
                    </h2>
                    <p className="text-muted-foreground">
                        No compartas información personal sensible (tuya o de otros). Reporta cualquier comportamiento sospechoso o ilegal.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <span>🚫</span> Nada de Spam
                    </h2>
                    <p className="text-muted-foreground">
                        No uses las salas para publicidad no deseada o para enviar links maliciosos. El spam degrada la experiencia de todos.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <span>💬</span> Mantén el Tema
                    </h2>
                    <p className="text-muted-foreground">
                        Intenta que tus conversaciones se ajusten al tema de la sala. Esto ayuda a que las comunidades crezcan de forma saludable.
                    </p>
                </section>
            </div>

            <div className="mt-16 p-8 bg-primary/5 rounded-2xl border border-primary/10">
                <p className="text-center font-medium">
                    El incumplimiento de estas normas puede resultar en la expulsión temporal o permanente de la plataforma.
                </p>
            </div>
        </div>
    );
}
