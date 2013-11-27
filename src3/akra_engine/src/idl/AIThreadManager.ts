/// <reference path="AIEventProvider.ts" />
/// <reference path="AIThread.ts" />


/// <reference path="AIManager.ts" />
/// <reference path="AIThread.ts" />

interface AIThreadManager extends AIManager {
	waitForThread(fn: Function): int;
	createThread(): boolean;
	occupyThread(): AIThread;
	releaseThread(iThread: int): boolean;
	releaseThread(pThread: AIThread): boolean;
}
