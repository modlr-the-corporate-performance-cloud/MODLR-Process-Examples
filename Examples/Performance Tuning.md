# Process Performance Tuning

## Cube Formula
Cube formula's can be turned off during process execution. Turning these back on when the process is completing execution causes the cube to reprocess all feeders.

```javascript
var bApply = cube.formulaEvaluation(cubeName);
cube.formulaEvaluation(cubeName, bApply);
```
* cubeName - [string] the name of the target cube
* bApply - [true/false] the flag to apply


## Cube Audit Logging
Data changes to cells within a cube are logged by default. This has a performance overhead and can be disabled for bulk data loading.

**
```javascript
var bLog = cube.log(cubeName);
cube.log(cubeName,bLog);
```
* cubeName - [string] the name of the target cube
* bLog - [true/false] the flag to apply
