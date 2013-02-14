#ifndef TESTUTILS_TS
#define TESTUTILS_TS

#include "common.ts"

module akra.util {

	var pTestCondList: ITestCond[] = [];
	var pTestList: ITestManifest[] = [];
	var isPassed: bool;

	function addCond(pCond: ITestCond): void {
		pTestCondList.unshift(pCond);
	}

	interface ITestCond {
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

			if (pArgv[0] === this._pValue) {
				return true;
			}

			console.warn(">", pArgv[0], "!==", this._pValue);
			return false;
		}
	}



	function output(sText: string): void {
		document.body.innerHTML += sText;
	}

	export function check(...pArgv: any[]): void {
		var pTest: ITestCond = pTestCondList.pop();
		var bResult: bool;
		
		if (!pTest) {
			console.log((<any>(new Error)).stack);
			console.warn("chech() without condition...");
			return;
		}

		bResult = pTest.verify(pArgv);
		isPassed = isPassed && bResult;

		if (bResult) {
			output("<pre style=\"margin: 0;\"><span style=\"color: green;\"><b>[ PASSED ]</b></span>" + pTest.toString() + "</pre>");
		}
		else {
			output("<pre style=\"margin: 0;\"><span style=\"color: red;\"><b>[ FAILED ]</b></span>" + pTest.toString() + "</pre>");
		}

	}


	export function failed(): void {
		var iTotal: int = pTestCondList.length;
		for (var i: int = 0; i < iTotal; ++ i) {
			check(false);
		}
	}

	export function shouldBeTrue(sDescription: string) {
		addCond(new ValueCond(sDescription, true));
	}

	export function shouldBeFalse(sDescription: string) {
		addCond(new ValueCond(sDescription, false));
	}

	export function shouldBeArray(sDescription: string, pArr: any) {
		addCond(new ArrayCond(sDescription, <any[]>pArr));
	}

	export function shouldBe (sDescription: string, pValue: any) {
		addCond(new ValueCond(sDescription, pValue));
	}

	export interface ITestManifest {
		name: string;
		description?: string;
		entry?: () => void;
	}

	export function test(sDescription: string, fnWrapper: () => void);
	export function test(pManifest: ITestManifest, fnWrapper: () => void);
	export function test (manifest: any, fnWrapper: () => void) {
		if (isString(manifest)) {
			pTestList.push({
				name: <string>arguments[0],
				description: null,
				entry: fnWrapper
			});
		}
		else {
			var pManifest: ITestManifest = <ITestManifest>arguments[0];
			pManifest.entry = fnWrapper;
			pTestList.push(pManifest);
		}
	}

	export function run(): void {
		for (var i: int = 0; i < pTestList.length; ++ i) {
			var pTest: ITestManifest = pTestList[i];
			var iBegin: uint = now();

			isPassed = true;
			
			output("<h3>" + pTest.name || "" + "</h3><hr />");
			pTest.entry();

			output(
			"<pre>" +
			"<hr align=\"left\" style=\"border: 0; background-color: gray; height: 1px; width: 500px;\"/><span style=\"color: gray;\">total time: " + (now() - iBegin) + " msec" + "</span>" + 
			"<br /><b>" + (isPassed? "<span style=\"color: green\">TEST PASSED</span>": "<span style=\"color: red\">TEST FAILED</span>") + "</b>" +
			"</pre>");

		};
	}

	window.onload = function () {
		run();
	}
}

var test 			= akra.util.test;
var failed 			= akra.util.failed;
var shouldBe 		= akra.util.shouldBe;
var shouldBeArray 	= akra.util.shouldBeArray;
var shouldBeTrue 	= akra.util.shouldBeTrue;
var shouldBeFalse 	= akra.util.shouldBeFalse;
var check 			= akra.util.check;
var ok = check;


#endif