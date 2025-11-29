# GitOps Mini - Backend

## Environment Variables

Create a `.env` file in the backend directory with the following configuration:

### AUTO_SYNC_INTERVAL_MS
- **Description**: Interval in milliseconds for automatic synchronization of apps with auto-sync enabled
- **Default**: 300000 (5 minutes)
- **Examples**:
  - 1 minute: `60000`
  - 5 minutes: `300000`
  - 10 minutes: `600000`
  - 30 minutes: `1800000`

```env
AUTO_SYNC_INTERVAL_MS=300000
```

## Auto-Sync Feature

The auto-sync feature automatically synchronizes applications that have the "Otomatik Senkronizasyon" option enabled. 

### How it works:
1. When creating a new app, enable the "Otomatik Senkronizasyon" checkbox
2. The scheduler runs at the configured interval (default: 5 minutes)
3. All apps with auto-sync enabled are synchronized automatically
4. Logs show all auto-sync operations with timestamps and results

### Logs:
- `[AUTO-SYNC] Starting scheduler...` - Scheduler initialized
- `[AUTO-SYNC] Found X app(s) with auto-sync enabled` - Apps detected
- `[AUTO-SYNC] Starting sync for app: <name>` - Sync started
- `[AUTO-SYNC] Sync completed for <name> - Status: SUCCESS/FAILED` - Sync result
