/**
 * Discord API Module
 * Handles Discord OAuth2 linking
 */

import ApiService from '../api-service'

export const DiscordApi = {
  async getAuthUrl(): Promise<{ url: string }> {
    return ApiService.get<{ url: string }>('/discord/auth-url')
  },

  async linkDiscord(discordId: string): Promise<{ status: string; discordId: string }> {
    return ApiService.post<{ status: string; discordId: string }>('/discord/link', {
      discord_id: discordId
    })
  },

  async getStatus(): Promise<{ linked: boolean; discordId: string }> {
    return ApiService.get<{ linked: boolean; discordId: string }>('/discord/status')
  }
}
