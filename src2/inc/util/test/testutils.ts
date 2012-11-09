#ifndef TESTUTILS_TS
#define TESTUTILS_TS

#include "common.ts"

module akra.utils.test {

	var pTestCondList: ITestCond[] = [];

	function addCond(pCond: ITestCond): void {
		pTestCondList.unshift(pCond);
	}

	export interface ITestCond {
		description: string;
		toString(): string;
		verify(pArgv: any[]): bool;
	}

	class TestCond implements ITestCond {
		private sDescription: string;
		constructor (sDescription: string) {
			this.sDescription = sDescription;
		}

		toString(): string {
			return this.sDescription;
		}

		verify(pArgv: any[]) {
			return false;
		}

		get description(): string {
			return this.sDescription;
		}
	}

	class TrueCond extends TestCond implements ITestCond {
		constructor (sDescription: string) {
			super(sDescription);
		}

		verify(pArgv: any[]): bool {
			if (pArgv[0] === true) {
				return true;
			}
		}
	}

	function output(sText: string): void {
		document.body.innerHTML += sText;
	}

	export function check(...pArgv: any[]): void {
		var pTest: ITestCond = pTestCondList.pop();

		if (!pTest) {
			console.log((<any>(new Error)).stack);
			console.warn("chech() without condition...");
			return;
		}

		var bResult: bool = pTest.verify(pArgv);
		

		if (bResult) {
			output("<pre><span style=\"color: green;\">[ PASS ] </span>" + pTest.toString() + "</pre>");
		}
		else {
			output("<pre><span style=\"color: red;\">[ FAIL ] </span>" + pTest.toString() + "</pre>");
		}

	}

	export function shouldBeTrue(sDescription: string) {
		addCond(new TrueCond(sDescription));
	}

	export interface ITestManifest {
		name: string;
		main: () => void;
		description?: string;
	}

	export class Test {
		constructor (pManifest: ITestManifest) {
			Test.pTestList.push(pManifest);
		}

		static pTestList: ITestManifest[] = [];
		static run(): void {
			var pTestList = Test.pTestList;
			for (var i: int = 0; i < pTestList.length; ++ i) {
				var pTest: ITestManifest = pTestList[i];
				pTest.main();
			};
		}
	}

	export function run(): void {
		Test.run();
	}
}

#endif