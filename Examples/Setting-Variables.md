# Process for Setting Model Variables

Imagine that on the model, we have the following model variables:

- Month.Current Month
- Year.Current Year

Create a custom process script and under the `pre()` function, prompt the user for the values

```javascript
function pre() {
    const monthNames = [
    	'Jan',
    	'Feb',
    	'Mar',
    	'Apr',
    	'May',
    	'Jun',
    	'Jul',
    	'Aug',
    	'Sep',
    	'Oct',
    	'Nov',
    	'Dec'
    ];

    //this function is called once before the processes is executed.
    //Use this to setup prompts.
    const now = new Date(Date.now());
    const monthNow = monthNames[now.getMonth()];
    const yearNow = now.getFullYear().toString();
    script.prompt('Month.Current Month', 'currentMonth', monthNow);
    script.prompt('Year.Current Year', 'currentYear', yearNow);
    
    script.log('process pre-execution parameters parsed.');
}
```

Collect and set the values:

```javascript
function begin() {
    //this function is called once at the start of the process
    script.log('process execution started.');
    
    script.variableSet('Month.Current Month', currentMonth);
    script.variableSet('Year.Current Year', currentYear);
}
```
