import { useTranslation } from 'react-i18next';
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
    const { t } = useTranslation();
    return (
        <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader className="text-center">
                    <DialogTitle className="text-xl">{t('rooms.create.success.title')}</DialogTitle>
                    <DialogDescription className="mt-2">
                        {t('rooms.create.success.description', { roomName: room.name })}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-950/50 rounded-lg border border-amber-200 dark:border-amber-800">
                    <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0" />
                    <p className="text-sm text-amber-800 dark:text-amber-200">
                        {t('rooms.create.success.review_note')}
                    </p>
                </div>

                <div className="flex justify-center mt-4">
                    <Button onClick={handleDialogClose} className="cursor-pointer">
                        {t('rooms.create.success.go_to_my_rooms')}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}