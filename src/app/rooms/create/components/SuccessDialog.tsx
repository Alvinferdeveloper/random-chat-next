import { Dialog, DialogContent, DialogHeader, DialogDescription, DialogTitle } from "@/src/components/ui/dialog"
import { Button } from "@/src/components/ui/button";
import { CheckCircle, Clock } from "lucide-react";
export default function SuccessDialog({
    showSuccessDialog,
    setShowSuccessDialog,
    handleDialogClose,
    room
}: {
    showSuccessDialog: boolean;
    setShowSuccessDialog: (showSuccessDialog: boolean) => void;
    handleDialogClose: () => void;
    room: { name: string };
}) {
    return (
        <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader className="text-center">
                    <DialogTitle className="text-xl">¡Sala creada exitosamente!</DialogTitle>
                    <DialogDescription className="mt-2">
                        Tu sala <strong>"{room.name}"</strong> ha sido creada y está en proceso de revisión.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-950/50 rounded-lg border border-amber-200 dark:border-amber-800">
                    <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0" />
                    <p className="text-sm text-amber-800 dark:text-amber-200">
                        Una vez que un administrador revise y apruebe tu sala, estará disponible para que otros usuarios puedan unirse.
                    </p>
                </div>

                <div className="flex justify-center mt-4">
                    <Button onClick={handleDialogClose} className="cursor-pointer">
                        Ir a mis salas
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}