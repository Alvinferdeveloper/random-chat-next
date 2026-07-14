'use client';

import { useAdminLiveStats } from './hooks/useAdminLiveStats';
import { useAdminTopActiveRooms } from './hooks/useAdminTopActiveRooms';
import { useAdminBroadcast } from './hooks/useAdminBroadcast';
import { useAdminSettings } from './hooks/useAdminSettings';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import FeaturedStats from './components/dashboard/FeaturedStats';
import SecondaryStats from './components/dashboard/SecondaryStats';
import ActiveRoomsList from './components/dashboard/ActiveRoomsList';
import QuickActions from './components/dashboard/QuickActions';
import SystemSettings from './components/dashboard/SystemSettings';
import BroadcastDialog from './components/dashboard/BroadcastDialog';

export default function AdminDashboard() {
    const { t } = useTranslation();
    const { stats, loading } = useAdminLiveStats();
    const { rooms: activeRooms, loading: loadingActiveRooms } = useAdminTopActiveRooms();
    const { sendBroadcast, isSubmitting, error: broadcastError } = useAdminBroadcast();
    const { settings, loading: settingsLoading, updateSetting } = useAdminSettings();
    const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);

    const handleToggleSetting = async (key: string, currentValue: string) => {
        const newValue = currentValue === 'true' ? 'false' : 'true';
        const success = await updateSetting(key, newValue);
        if (success) {
            toast.success(t('admin.toast.settings_updated'));
        } else {
            toast.error(t('admin.toast.settings_error'));
        }
    };

    const handleSendBroadcast = async (message: string) => {
        const success = await sendBroadcast(message);
        if (success) {
            setIsBroadcastOpen(false);
            toast.success(t('admin.toast.broadcast_sent'));
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">{t('admin.dashboard.title')}</h1>
                <p className="text-sm text-muted-foreground mt-1">{t('admin.dashboard.subtitle')}</p>
            </div>

            <FeaturedStats stats={stats} loading={loading} />
            <SecondaryStats stats={stats} loading={loading} />
            <ActiveRoomsList rooms={activeRooms} loading={loadingActiveRooms} />
            <QuickActions onBroadcast={() => setIsBroadcastOpen(true)} />
            <SystemSettings settings={settings} loading={settingsLoading} onToggle={handleToggleSetting} />
            <BroadcastDialog
                open={isBroadcastOpen}
                onOpenChange={setIsBroadcastOpen}
                onSend={handleSendBroadcast}
                isSubmitting={isSubmitting}
                error={broadcastError}
            />
        </div>
    );
}
