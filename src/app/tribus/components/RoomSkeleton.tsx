import { Card, CardContent } from '@/src/components/ui/card';

export function RoomSkeleton() {
    return (
        <div className="h-full">
            <Card className="h-full flex flex-col bg-[#2f3136] border-none rounded-lg py-0 overflow-hidden pointer-events-none">
                <div className="relative shrink-0">
                    <div className="h-[170px] relative w-full bg-gray-700 animate-pulse">
                        <div className="absolute top-2 right-2 p-2 w-9 h-9 rounded-full bg-black/20 backdrop-blur-sm" />
                    </div>

                    <div className="absolute -bottom-5 left-4 z-10">
                        <div className="w-16 h-16 bg-[#2d2f31] rounded-full border-[4px] border-[#2f3136] animate-pulse shadow-sm" />
                    </div>
                </div>
                <CardContent className="pt-6 pb-4 px-4 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-3 mt-1">
                        <div className="w-4 h-4 min-w-[16px] bg-gray-700 rounded-full animate-pulse shrink-0" />
                        <div className="h-6 bg-gray-700 rounded-md w-3/4 animate-pulse" />
                    </div>

                    <div className="flex-1 mb-4 space-y-2 mt-1">
                        <div className="h-4 bg-gray-700 rounded-md w-full animate-pulse" />
                        <div className="h-4 bg-gray-700 rounded-md w-5/6 animate-pulse" />
                    </div>

                    <div className="mt-auto flex items-center gap-2 pt-3 border-t border-gray-700/50">
                        <div className="w-2 h-2 bg-gray-700 rounded-full animate-pulse shrink-0" />
                        <div className="h-3 bg-gray-700 rounded-md w-28 animate-pulse" />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}