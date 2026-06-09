/**
 * Centralized utility for localStorage management
 * Ensures consistent keys and safe access
 */

const KEYS = {
    DEVICE_ID: 'poll_device_id',
    VOTED_POLLS: 'poll_voted_data', // Mapping pollId -> optionId
    USER_TOKEN: 'poll_user_creator_token', // The persistent token for a single user
};

export const storage = {
    /**
     * Get or create a consistent device ID
     */
    getDeviceId: () => {
        let deviceId = localStorage.getItem(KEYS.DEVICE_ID);
        if (!deviceId) {
            deviceId = `dev_${Math.random().toString(36).substring(2, 11)}_${Date.now().toString(36)}`;
            localStorage.setItem(KEYS.DEVICE_ID, deviceId);
        }
        return deviceId;
    },

    /**
     * Mark a poll as voted
     */
    setVoted: (pollId, optionId) => {
        const voted = JSON.parse(localStorage.getItem(KEYS.VOTED_POLLS) || '{}');
        voted[pollId] = optionId;
        localStorage.setItem(KEYS.VOTED_POLLS, JSON.stringify(voted));
        // Keep legacy key for compatibility
        localStorage.setItem(`poll_voted_${pollId}`, optionId);
    },

    /**
     * Check if user voted in a poll
     */
    getVotedOption: (pollId) => {
        const voted = JSON.parse(localStorage.getItem(KEYS.VOTED_POLLS) || '{}');
        return voted[pollId] || localStorage.getItem(`poll_voted_${pollId}`);
    },

    /**
     * Get or create a persistent creator token for this user
     */
    getCreatorUserToken: () => {
        let token = localStorage.getItem(KEYS.USER_TOKEN);
        if (!token) {
            token = `user_${Math.random().toString(36).substring(2, 15)}_${Date.now().toString(36)}`;
            localStorage.setItem(KEYS.USER_TOKEN, token);
        }
        return token;
    }
};
