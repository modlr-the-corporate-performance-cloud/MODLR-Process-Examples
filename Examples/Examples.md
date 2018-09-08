# Process and Script Examples

## Example Processs Listing
* Simple cube slicing to export to a file
* Creating a new report 
* Sending an Email to a User

## Example Server Pages Listing
* Handlebars page templating example



## Quick Samples


### Dimension Samples
Most processes which import data will also need to create or maintain dimensions.

#### Creating a Standard Dimension if it doesn't exist
```javascript

if( !dimension.exists(dimName) ) {
	dimension.create(dimName, "standard");
}

```

#### Creating a Standard Dimension if it doesn't exist (and wiping it if it does exist)
```javascript

if( !dimension.exists(dimName) ) {
	dimension.create(dimName, "standard");
} else {
	dimension.wipe(dimName);
}

```

#### Creating a New Dimension and a Default Hierarchy
```javascript

if( !dimension.exists(dimName) ) {
	dimension.create(dimName, "standard");
} else {
	dimension.wipe(dimName);
}
if( !hierarchy.exists(dimName,"Default") ) {
	hierarchy.create(dimName,"Default");
}

hierarchy.group(dimName,"Default","All Elements","Child Element 01");
hierarchy.group(dimName,"Default","All Elements","Child Element 02");

```
*Note: There is no need to wipe the hierarchy as it will be wiped by the dimension wipe call.*

