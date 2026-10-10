import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { getAppDescription } from '../../src/platform';

vi.mock('@capacitor/core', () => ({
	Capacitor: {
		isNativePlatform: vi.fn(),
		getPlatform: vi.fn(),
	},
}));
vi.mock('@capacitor/app', () => ({
	App: { getInfo: vi.fn() },
}));

describe('app information', () => {
	beforeEach(() => vi.resetAllMocks());

	it('does not call native plugins in a browser', async () => {
		vi.mocked(Capacitor.isNativePlatform).mockReturnValue(false);
		await expect(getAppDescription()).resolves.toContain('Web preview');
		expect(App.getInfo).not.toHaveBeenCalled();
	});

	it.each(['android', 'ios'])(
		'uses app information on %s',
		async (platform) => {
			vi.mocked(Capacitor.isNativePlatform).mockReturnValue(true);
			vi.mocked(Capacitor.getPlatform).mockReturnValue(platform);
			vi.mocked(App.getInfo).mockResolvedValue({
				name: 'Example',
				id: 'com.{{ remrg:var organization }}.{{ remrg:var project-name }}',
				version: '1.0.0',
				build: '1',
			});
			await expect(getAppDescription()).resolves.toBe(
				`Example v1.0.0 (${platform})`
			);
		}
	);

	it('propagates plugin failures instead of returning a web fallback', async () => {
		vi.mocked(Capacitor.isNativePlatform).mockReturnValue(true);
		vi.mocked(App.getInfo).mockRejectedValue(new Error('Plugin failed'));
		await expect(getAppDescription()).rejects.toThrow('Plugin failed');
	});
});
