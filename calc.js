(function() {
	const calc = {
		input                  : document.querySelector(`#display`),

		buttons                : {
			'1' : document.querySelector(`#button1`),
			'2' : document.querySelector(`#button2`),
			'3' : document.querySelector(`#button3`),
			'4' : document.querySelector(`#button4`),
			'5' : document.querySelector(`#button5`),
			'6' : document.querySelector(`#button6`),
			'7' : document.querySelector(`#button7`),
			'8' : document.querySelector(`#button8`),
			'9' : document.querySelector(`#button9`),
			'0' : document.querySelector(`#button0`),
			'.' : document.querySelector(`#decimalButton`),

			'+' : document.querySelector(`#addButton`),
			'-' : document.querySelector(`#subtractButton`),
			'*' : document.querySelector(`#multiplyButton`),
			'/' : document.querySelector(`#divideButton`),

			'=' : document.querySelector(`#equalsButton`),
			c   : document.querySelector(`#clearButton`),
		},

		integers               : [
			`1`,
			`2`,
			`3`,
			`4`,
			`5`,
			`6`,
			`7`,
			`8`,
			`9`,
			`0`,
			`.`,
		],

		operators              : [`+`, `-`, `*`, `/`],

		actions                : [`=`, `Enter`, `c`],

		validKeys              : [
			`1`,
			`2`,
			`3`,
			`4`,
			`5`,
			`6`,
			`7`,
			`8`,
			`9`,
			`0`,
			`.`,

			'+',
			'-',
			'*',
			'/',

			'=',
			`c`,
		],

		movements              : [
			`Backspace`,
			`Delete`,
			`ArrowLeft`,
			`ArrowRight`,
		],

		operations             : {
			'+' : function getSum(val1, val2) {
				return val1 + val2;
			},

			'-' : function getDifference(val1, val2) {
				return val1 - val2;
			},

			'*' : function getProduct(val1, val2) {
				return val1 * val2;
			},

			'/' : function getQuotient(val1, val2) {
				return val1 / val2;
			},
		},

		lastKey                : ``,
		currentValue           : ``,
		values                 : [],
		operator               : ``,

		clearAll               : false,

		cursorPosition         : {
			start : 0,
			end   : 0,
		},

		preventInvalidPress(e) {
			console.log(`-----`);
			console.log(e.key);
			console.log(`-----`);
			if (
				(calc.input.value.length >= 22 &&
					!calc.movements.includes(e.key)) ||
				![...calc.integers, ...calc.movements].includes(e.key) ||
				(calc.input.value.includes(`.`) && e.key === `.`)
			) {
				e.preventDefault();
			}
		},

		parseInputPress(e) {
			calc.integers.includes(e.key) && calc.handleValidKeyPress(e);

			calc.operators.includes(e.key) && calc.handleOperatorPress(e);

			(e.key === `=` || e.key === `Enter`) && calc.handleEqualPress(e);

			e.key === `c` && calc.handleClear(e);

			// calc.currentValue = parseFloat(e.target.value);
			if ([...calc.integers, ...calc.operators].includes(e.key)) {
				calc.lastKey = e.key;
			} else if (e.key === `=` || e.key === `Enter`) {
				calc.lastKey = `=`;
			}
		},

		handleValidKeyPress(e) {
			calc.clearAll = false;

			// no operator: input to values[0]
			if (!calc.operator) {
				calc.values[0] = parseFloat(e.target.value);
				return;
			}

			if (calc.operators.includes(calc.lastKey)) {
				calc.input.value = ``;
				calc.input.value = e.target.value;
				calc.values[1] = parseFloat(e.target.value);
				return;
			}

			if (
				calc.operator &&
				(calc.lastKey !== `=` && calc.lastKey !== `Enter`)
			) {
				calc.values[1] = parseFloat(e.target.value);
				return;
			}

			if (calc.lastKey === `=` || calc.lastKey === `Enter`) {
				calc.operator = ``;
				calc.input.value = ``;
				calc.values[0] = parseFloat(e.target.value);
				calc.input.value = e.target.value;
				return;
			}
		},

		handleOperatorPress(e) {
			calc.clearAll = false;

			if (calc.integers.includes(calc.lastKey) && calc.operator) {
				calc.values[1] = parseFloat(e.target.value);
				e.target.value = calc.runOperation(calc.values, calc.operator);
				calc.values[0] = calc.runOperation(calc.values, calc.operator);
			}

			calc.values[0] = parseFloat(e.target.value);
			calc.operator = e.key;
		},

		handleEqualPress(e) {
			calc.clearAll = false;

			if (calc.lastKey === `=` || calc.lastKey === `Enter`) {
				e.target.value = calc.runOperation(calc.values, calc.operator);
				calc.values[0] = calc.runOperation(calc.values, calc.operator);
				// calc.values[1] = parseFloat(e.target.value);
			} else if (calc.operators.includes(calc.lastKey)) {
				return;
			} else if (calc.operator) {
				calc.values[1] = parseFloat(e.target.value);
				e.target.value = calc.runOperation(calc.values, calc.operator);
				calc.values[0] = calc.runOperation(calc.values, calc.operator);
				// calc.operator = ``;
			}
		},

		handleClear(e) {
			if (calc.clearAll === true) {
				calc.values = [];
				calc.operator = ``;
				calc.clearAll = false;
			} else {
				// e.target.value = ``;
				calc.input.value = ``;
				calc.clearAll = true;
			}
		},

		runOperation(values, operator) {
			calc.input.value = values.reduce(calc.operations[operator]);
			return values.reduce(calc.operations[operator]);
		},

		getCursorPosition(textNode) {
			if (textNode.selectionStart || textNode.selectionStart == '0') {
				calc.cursorPosition = {
					start : textNode.selectionStart,
					end   : textNode.selectionEnd,
				};
			} else {
				calc.cursorPosition = { start: 0, end: 0 };
			}
			console.log(calc.cursorPosition);
		},

		setCursorPosition(textNode, start, end) {
			textNode.focus();
			textNode.setSelectionRange(start, end);
		},

		dispatchSyntheticEvent(e) {
			const syntheticEvent = new KeyboardEvent(`keydown`, {
				key : `${e.target.value}`,
			});
			console.log(syntheticEvent);
			calc.buttons[e.target.value].dispatchEvent(syntheticEvent);
		},

		simulateKeyPress(e) {
			if (calc.preventInvalidClick(e)) {
				return;
			}

			calc.input.focus();
			calc.setCursorPosition(
				calc.input,
				calc.cursorPosition.start,
				calc.cursorPosition.end
			);

			calc.parseInputClick(e);
		},

		preventInvalidClick(e) {
			console.log(`xxx`, e);
			if (
				(calc.input.value.length >= 22 &&
					!calc.movements.includes(e.key)) ||
				(!calc.integers.includes(e.key) &&
					!calc.movements.includes(e.key) &&
					!calc.operators.includes(e.key) &&
					e.key !== `=` &&
					e.key !== `c`)
			) {
				e.preventDefault();
			}

			if (
				e.key === `.` &&
				calc.input.value.includes(`.`) &&
				(calc.lastKey !== `=` || !calc.operators.includes(calc.lastKey))
			) {
				return true;
			}
		},

		parseInputClick(e) {
			// if(calc.input.value.length >= 22) {
			// 	return;
			// }

			calc.integers.includes(e.key) && calc.handleValidKeyClick(e);

			calc.operators.includes(e.key) && calc.handleOperatorClick(e);

			(e.key === `=` || e.key === `Enter`) && calc.handleEqualClick(e);

			e.key === `c` && calc.handleClear(e);

			// calc.currentValue = parseFloat(e.target.value);
			if (
				calc.integers.includes(e.key) ||
				calc.operators.includes(e.key)
			) {
				calc.lastKey = e.key;
			} else if (
				(e.key === `=` || e.key === `Enter`) &&
				calc.integers.includes(calc.lastKey)
			) {
				calc.lastKey = `=`;
			}
		},

		handleValidKeyClick(e) {
			calc.clearAll = false;

			// no operator: input to values[0]
			if (!calc.operator) {
				calc.values[0] = parseFloat(calc.updateClickValue(e));
				calc.input.value = calc.updateClickValue(e);
				return;
			}

			// lastKey is operator:
			if (calc.operators.includes(calc.lastKey)) {
				calc.input.value = ``;
				calc.input.value = calc.updateClickValue(e);
				calc.values[1] = parseFloat(calc.input.value);
				return;
			}

			// operator and lastKey is not equals:
			if (
				calc.operator &&
				(calc.lastKey !== `=` && calc.lastKey !== `Enter`)
			) {
				calc.input.value = calc.updateClickValue(e);
				calc.values[1] = parseFloat(calc.input.value);
				return;
			}

			// lastKey is equals
			if (calc.lastKey === `=` || calc.lastKey === `Enter`) {
				calc.operator = ``;
				calc.input.value = ``;
				calc.values[0] = parseFloat(calc.updateClickValue(e));
				calc.input.value = calc.updateClickValue(e);
				return;
			}
		},

		handleOperatorClick(e) {
			calc.clearAll = false;

			if (calc.integers.includes(calc.lastKey) && calc.operator) {
				calc.values[1] = parseFloat(calc.updateClickValue(e));
				// e.target.value = calc.runOperation(calc.values, calc.operator);
				calc.values[0] = calc.runOperation(calc.values, calc.operator);
			}

			// calc.values[0] = parseFloat(calc.updateClickValue(e));
			calc.operator = e.key;
		},

		handleEqualClick(e) {
			calc.clearAll = false;

			if (calc.lastKey === `=` || calc.lastKey === `Enter`) {
				calc.input.value = calc.runOperation(
					calc.values,
					calc.operator
				);
				calc.values[0] = calc.runOperation(calc.values, calc.operator);
				// calc.values[1] = parseFloat(e.target.value);
			} else if (calc.operators.includes(calc.lastKey)) {
				return;
			} else if (calc.operator) {
				calc.values[1] = parseFloat(calc.updateClickValue(e));
				calc.input.value = calc.runOperation(
					calc.values,
					calc.operator
				);
				calc.values[0] = calc.runOperation(calc.values, calc.operator);
				// calc.operator = ``;
			}
		},

		updateClickValue(e) {
			let value = [...calc.input.value];
			value.splice(
				calc.cursorPosition.start,
				calc.cursorPosition.end - calc.cursorPosition.start,
				e.target.value
			);

			return value.join(``);
		},

		listeners() {
			Object.keys(calc.buttons).forEach((key) => {
				calc.buttons[key].addEventListener(
					'click',
					calc.dispatchSyntheticEvent
				);
			});

			Object.keys(calc.buttons).forEach((key) => {
				calc.buttons[key].addEventListener(
					`keydown`,
					calc.simulateKeyPress
				);
			});

			[calc.preventInvalidPress, calc.parseInputPress].forEach((func) => {
				calc.input.addEventListener(`keydown`, func);
			});

			calc.input.addEventListener(`keyup`, calc.logInfo);

			Object.keys(calc.buttons).forEach((key) => {
				calc.buttons[key].addEventListener(`click`, calc.logInfo);
			});

			calc.input.addEventListener(`blur`, () => {
				calc.getCursorPosition(calc.input);
			});

			calc.input.focus();
		},

		logInfo(e) {
			console.log(`e.target:`, e);
			console.log(`e.t.value: ${e.target.value}`);
			console.log(`e.key: ${e.key}`);
			console.log(`values[0]: ${calc.values[0]}`);
			console.log(`operator: ${calc.operator}`);
			console.log(`values[1]: ${calc.values[1]}`);
			console.log(`currentValue: ${calc.currentValue}`);
			console.log(`lastKey: ${calc.lastKey}`);
			console.log(`--------------------`);
		},
	};

	calc.listeners();
})();
