/**
 * Notification settings storage and service worker communication
 * Uses postMessage to sync mute settings with the service worker
 */

// Keys for settings
export const KEYS = {
  GLOBAL_MUTE: 'chatNotificationsEnabled',
  MUTED_TEAMS: 'mutedTeams',
};

/**
 * Send mute settings to the service worker
 */
async function sendSettingsToServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  
  try {
    const registration = await navigator.serviceWorker.ready;
    if (registration.active) {
      const globalEnabled = JSON.parse(localStorage.getItem(KEYS.GLOBAL_MUTE) ?? 'true');
      const mutedTeams = JSON.parse(localStorage.getItem(KEYS.MUTED_TEAMS) ?? '[]').map(id => id.toString());
      
      registration.active.postMessage({
        type: 'UPDATE_MUTE_SETTINGS',
        globalEnabled: globalEnabled,
        mutedTeams: mutedTeams
      });
      
      console.log('[NotificationSettings] Sent to SW - globalEnabled:', globalEnabled, 'mutedTeams:', mutedTeams);
    }
  } catch (error) {
    console.error('[NotificationSettings] Error sending to SW:', error);
  }
}

/**
 * Sync localStorage mute settings to service worker
 * Call this on app initialization and whenever settings change
 */
export async function syncSettingsToServiceWorker() {
  await sendSettingsToServiceWorker();
}

// Alias for backwards compatibility
export const syncSettingsToIndexedDB = syncSettingsToServiceWorker;

/**
 * Set global chat notifications enabled and sync to service worker
 * @param {boolean} enabled - Whether chat notifications are enabled
 */
export async function setGlobalMute(enabled) {
  localStorage.setItem(KEYS.GLOBAL_MUTE, JSON.stringify(enabled));
  await sendSettingsToServiceWorker();
}

/**
 * Set muted teams and sync to service worker
 * @param {string[]} mutedTeams - Array of muted team IDs (as strings)
 */
export async function setMutedTeams(mutedTeams) {
  const normalized = mutedTeams.map(id => id.toString());
  localStorage.setItem(KEYS.MUTED_TEAMS, JSON.stringify(normalized));
  await sendSettingsToServiceWorker();
}

/**
 * Toggle a team's muted status
 * @param {string|number} teamId - Team ID to toggle
 * @returns {Promise<{mutedTeams: string[], isMuted: boolean}>}
 */
export async function toggleTeamMute(teamId) {
  const saved = localStorage.getItem(KEYS.MUTED_TEAMS);
  const current = saved ? JSON.parse(saved).map(id => id.toString()) : [];
  const teamIdStr = teamId.toString();
  
  const isMuted = current.includes(teamIdStr);
  let updated;
  
  if (isMuted) {
    updated = current.filter(id => id !== teamIdStr);
  } else {
    updated = [...current, teamIdStr];
  }
  
  await setMutedTeams(updated);
  return { mutedTeams: updated, isMuted: !isMuted };
}

/**
 * Debug function - call from browser console to check settings
 * Usage: window.checkMuteSettings()
 */
export async function debugCheckSettings() {
  const globalEnabled = JSON.parse(localStorage.getItem(KEYS.GLOBAL_MUTE) ?? 'true');
  const mutedTeams = JSON.parse(localStorage.getItem(KEYS.MUTED_TEAMS) ?? '[]');
  
  console.log('[NotificationSettings] Current localStorage values:');
  console.log('  - chatNotificationsEnabled:', globalEnabled);
  console.log('  - mutedTeams:', mutedTeams);
  
  // Also check what SW has
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.ready;
    if (registration.active) {
      const channel = new MessageChannel();
      channel.port1.onmessage = (event) => {
        console.log('[NotificationSettings] Service Worker has:', event.data);
      };
      registration.active.postMessage({ type: 'GET_MUTE_SETTINGS' }, [channel.port2]);
    }
  }
  
  return { globalEnabled, mutedTeams };
}

// Expose debug function globally
if (typeof window !== 'undefined') {
  window.checkMuteSettings = debugCheckSettings;
}
