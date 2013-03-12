#ifndef TESTUTILS_TS
#define TESTUTILS_TS

#include "common.ts"

module akra.util {

	window.prompt = function (message?: string, defaul?: string): string {
		console.warn("prompt > " + message);
		return null;
	}

	window.alert = function(message?: string): void {
		console.warn("alert > " + message);
	}

	window.confirm = function (message?: string): bool {
		console.warn("confirm > " + message);
		return false;
	}


	var pTestCondList: ITestCond[] = [];
	var pTestList: ITestManifest[] = [];
	var isPassed: bool;
	var pTest: ITestManifest = null;
	var iBegin: int;

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
		protected _isNegate: bool;
		constructor (sDescription: string, pValue: any, isNegate: bool = false) {
			super(sDescription);

			this._pValue = pValue;
			this._isNegate = isNegate;
		}

		verify(pArgv: any[]): bool {
			var bResult: bool = pArgv[0] === this._pValue;

			// console.warn(">", pArgv[0], "!==", this._pValue);
			return this._isNegate? !bResult: bResult;
		}
	}



	// function output(sText: string): void {
	// 	document.body.innerHTML += sText;
	// }

	function output(sText: string): void {
        var pElement = document.createElement("div");
        pElement.innerHTML = sText;
        document.body.appendChild(pElement);
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
			output("<pre style=\"margin: 0; margin-left: 20px;\"><span style=\"color: green;\"><b>[ PASSED ]</b></span> " + pTest.toString() + "</pre>");
		}
		else {
			output("<pre style=\"margin: 0; margin-left: 20px;\"><span style=\"color: red;\"><b>[ FAILED ]</b></span> " + pTest.toString() + "</pre>");
		}
	}


	export function failed(e?: Error): void {
		if (isDef(e)) {
			printError(e.message, <string>(<any>e).stack);
		}

		var iTotal: int = pTestCondList.length;
		
		for (var i: int = 0; i < iTotal; ++ i) {
			check(false);
		}
		
		isPassed = false;
		pTest = null;
		printResults();

		run();
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

	export function shouldBeNotNull(sDescription: string) {
		addCond(new ValueCond(sDescription, null, true));
	}

	export interface ITestManifest {
		name: string;
		description?: string;
		entry?: () => void;
		async?: bool;
	}

	export function test(sDescription: string, fnWrapper: () => void, isAsync?: bool);
	export function test(pManifest: ITestManifest, fnWrapper: () => void, isAsync?: bool);
	export function test (manifest: any, fnWrapper: () => void, isAsync: bool = false) {
		var pManifest: ITestManifest;

		if (isString(manifest)) {
			pManifest = {
				name: <string>arguments[0],
				description: null,
				entry: fnWrapper
			};
		}
		else {
			pManifest = <ITestManifest>arguments[0];
			pManifest.entry = fnWrapper;
		}

		pManifest.async = isAsync;

		pTestList.unshift(pManifest);
	}

	function printInfo (): void {
		output("<h4 style=\"font-family: monospace;\">" + pTest.name || "" + "</h4>");
	}

	function printResults(): void {
		output(
			"<pre style=\"margin-left: 20px;\">" +
			"<hr align=\"left\" style=\"border: 0; background-color: gray; height: 1px; width: 500px;\"/><span style=\"color: gray;\">total time: " + (now() - iBegin) + " msec" + "</span>" + 
			"<br /><b>" + (isPassed? "<span style=\"color: green\">TEST PASSED</span>": "<span style=\"color: red\">TEST FAILED</span>") + "</b>" +
			"</pre>");
	}

	function printError(message: string, stack?: string): void {
		message = "<b>" + message + "</b>";
		
		if (isDef(stack)) {
			 message += "\n" + stack;
		}

		output(
			"<pre style=\"margin-left: 20px;\">" +
			"<span style=\"color: red; background-color: rgba(255, 0, 0, .1);\">" + message + "</span>" + 
			"</pre>");
	}

	export function asyncTest (manifest: any, fnWrapper: () => void) {
		test(manifest, fnWrapper, true);
	}

	export function run(): void {
		//если вдруг остались тесты.
		if (pTestCondList.length) {
			failed();
		}

		//если предыдущий тест был асинхронным, значит он кончился и надо распечатать результаты
		if (!isNull(pTest) && pTest.async == true) {
			printResults();
		}
		
		while (pTestList.length) {
			//начинаем новый тест
			pTest = pTestList.pop();
			iBegin = now();
			isPassed = true;
			

			printInfo();
			//start test
			
			try {
				pTest.entry();
			} catch (e) {
				failed(e);
				return;
			}

			if (!pTest.async) {
				printResults();
				pTest = null;
			}
			else {
				return;
			}
		};
	}

	window.onload = function () {
		run();
	}
}

var test 			= akra.util.test;
var asyncTest 		= akra.util.asyncTest;
var failed 			= akra.util.failed;
var run 			= akra.util.run;
var shouldBe 		= akra.util.shouldBe;
var shouldBeArray 	= akra.util.shouldBeArray;
var shouldBeTrue 	= akra.util.shouldBeTrue;
var shouldBeFalse 	= akra.util.shouldBeFalse;
var shouldBeNotNull	= akra.util.shouldBeNotNull;
var check 			= akra.util.check;
var ok = check;

#endif