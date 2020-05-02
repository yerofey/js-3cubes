/**
 * Solving problem "Sums of three cubes"
 */

const fs = require('fs');
const _ = require('underscore');


const timeStart = Date.now();
Array.range = (start, end) => Array.from({length: ((end + 1) - start)}, (v, k) => k + start);


const numbers = [ 10 ]; //Array.range(32, 29); // [ 10 ]


// print info on the screen
const debug = true;
// find N results
const minResultsCount = 1;
// (x,y,z) should be not 4 or 5 modulo 9
const optionMod9Enabled = true;
// limit the calculation time for 1 number
const numberSecondsLimit = 0;
// save results into "./../data" folder
const saveResults = true;


// results folder
const dataDir = __dirname + '/data';
fs.access(dataDir, function(err) {
	if (err && err.code === 'ENOENT') {
		fs.mkdir(myDir);
	}
});


let deepSearch = false;
if (minResultsCount && minResultsCount > 1) {
	deepSearch = true;
}


if (numbers.length === 0) {
	if (debug) {
		console.log('Error: numbers is empty!');
	}
	throw '';
}


for (const number of numbers) {
  if (debug) {
    console.log(number);
  }

	if (optionMod9Enabled) {
		const numberMod = number % 9;
		if (numberMod == 4 || numberMod == 5) {
			if (debug) {
				console.log('skipped (mod)');
				console.log();
			}

			if (saveResults) {
				const resultObject = {
					number: number,
					skipped: true
				};

				fs.writeFile(dataDir + '/' + number + '.json', JSON.stringify(resultObject, null, 4), (err) => {
					if (err) throw err;
				});
			}

			continue;
		}
	}

	let aborted = false;
	let found = false;
	let numberResults = [];
	let resCount = 0;
	let tenDegree = 1;
	let max = 10 ** tenDegree;
	let min = -max;
	let i = 0;

	let x = 0;
	let y = 0;
	let z = 0;

	const numberTimeStart = Date.now();

	if (debug) {
		console.log(`from ${min} to ${max}`);
	}

	let run = true;
	while (run) {
		for (const _x of Array.range(min, max)) {
			x = _x;
			for (const _y of Array.range(min, max)) {
				y = _y;
				for (const _z of Array.range(min, max)) {
					z = _z;

          const calc = (x ** 3) + (y ** 3) + (z ** 3);

					//console.log('// ' + calc + ` | x=${x}, y=${y}, z=${z}`);
					++i;

					if (calc === number) {
						const temp = [
							x,
							y,
							z,
						];

						if (numberResults.length === 0) {
							found = true;
							numberResults.push(temp);
						} else {
              const tempSorted = _.sortBy(temp, (num) => {
                return num * -1;
              }).reverse();
              const tempNumbersInLine = tempSorted.join('_');
							let tempIsUnique = true;

							for (const res of numberResults) {
                if (!Array.isArray(res)) {
                  continue;
                }

                const resSorted = _.sortBy(temp, (num) => {
                  return num * -1;
                }).reverse();
                const resNumbersInLine = resSorted.join('_');

                if (tempNumbersInLine === resNumbersInLine) {
                  tempIsUnique = false;
                  break;
                }
              }

							if (tempIsUnique) {
								found = true;
								numberResults.push(temp);
							}
						}
					}

					if (numberSecondsLimit > 0) {
						const numberSecondsWasted = (Date.now() - numberTimeStart) / 1000;
						if (numberSecondsWasted > numberSecondsLimit) {
							aborted = true;
						}
					}

					if (found && minResultsCount == numberResults.length || aborted) {
						run = false;
						break;
					}
				}

				if (found && minResultsCount == numberResults.length || aborted) {
					run = false;
					break;
				}
			}

			if (found && minResultsCount == numberResults.length || aborted) {
				run = false;
				break;
			}
		}

		if (debug) {
			console.log('(' + (numberResults.length - resCount) + ')');
		}

		if (minResultsCount === numberResults.length) {
			run = false;
			break;
		} else {
			tenDegree++;

			if (10 ** tenDegree > Number.MAX_SAFE_INTEGER) {
				max = BigInt(10 ** tenDegree);
				min = BigInt(-max);
			} else {
				max = 10 ** tenDegree;
				min = -max;
			}

			// if (max >=  || min <= Number.MIN_SAFE_INTEGER) {
			// 	// console.log('limit reached');
			// 	// run = false;
			// 	// break;
			// }

			if (debug) {
				console.log(`from ${min} to ${max}`);
			}

			resCount = numberResults.length;
		}
	}

	if (found) {
		if (debug) {
			if (deepSearch) {
				console.log(`x=${x}, y=${y}, z=${z} (${numberResults.length})`);
			} else {
				console.log(`x=${x}, y=${y}, z=${z}`);
			}
		}

		if (saveResults) {
			let resultObject = {
				number: number,
				results: numberResults,
				range: `from ${min} to ${max}`,
				nonce: i,
			};

			if (numberSecondsLimit > 0) {
				resultObject['finished'] = (!aborted);
			}

			resultObject['runtime'] = ((Date.now() - timeStart) / 1000).toFixed(4).toLocaleString() + ' s';

			fs.writeFile(dataDir + '/' + number + '.json', JSON.stringify(resultObject, null, 4), (err) => {
				if (err) throw err;
			});
		}
	}

	if (debug) {
		if (aborted) {
			console.log('!');
		}

		console.log(`nonce=${i}`);
		console.log();
	}
}


if (debug) {
	// runtime
	console.log(((Date.now() - timeStart) / 1000).toFixed(4).toLocaleString() + ' s');
}