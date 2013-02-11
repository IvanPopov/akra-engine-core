#ifndef TESTUTILS_TS
#define TESTUTILS_TS

#include "common.ts"

module akra.util.test {

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

	class ArrayCond extends TestCond implements ITestCond {
		protected _pArr: any[];
		constructor (sDescription: string, pArr: any[]) {
			super(sDescription);

			this._pArr = pArr;
		}
		verify(pArgv: any[]): bool {
			var pArr: any[] = pArgv[0];

			if (pArr.length != this._pArr.length) {
				return false;
			}

			for (var i: int = 0; i < pArr.length; ++ i) {
				if (pArr[i] != this._pArr[i]) {
					return false;
				}
			};

			return true;
		}
	}

	class ValueCond extends TestCond implements ITestCond {
		protected _pValue: any;
		constructor (sDescription: string, pValue: any) {
			super(sDescription);

			this._pValue = pValue;
		}
		verify(pArgv: any[]): bool {

			if (pArgv[0] == this._pValue) {
				return true;
			}

			console.warn(">", pArgv[0], "!==", this._pValue);
			return false;
		}
	}

	class TrueCond extends TestCond implements ITestCond {
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


	export function failed(): void {
		var iTotal: int = pTestCondList.length;
		for (var i: int = 0; i < iTotal; ++ i) {
			check(false);
		}
	}

	export function shouldBeTrue(sDescription: string) {
		addCond(new TrueCond(sDescription));
	}

	export function shouldBeArray(sDescription: string, pArr: any) {
		addCond(new ArrayCond(sDescription, <any[]>pArr));
	}

	export function shouldBe (sDescription: string, pValue: any) {
		addCond(new ValueCond(sDescription, pValue));
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
				document.getElementById('test_name').innerHTML = ("<h2>" + pTest.name || "" + "</h2><hr />");
				pTest.main();
			};
		}
	}

	export function run(): void {
		Test.run();
	}

	window.onload = function () {
		run();
	}
}

#endif