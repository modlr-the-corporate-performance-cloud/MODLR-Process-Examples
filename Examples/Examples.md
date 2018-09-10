# Process and Script Examples

## Example Processs Listing
* Simple cube slicing to export to a file [To be completed]
* Creating a new report  [To be completed]

## Example Server Pages Listing
* Handlebars page templating example [To be completed]


## Quick Samples

### Notification Samples
Sending an email or SMS message to users is trivial using the notification functions built into MODLR.

#### Sending an Email to a User
This example sends an email to the user running the process. The subject line reads "Hello". 
```javascript

//get the current users email (the email of the user who is running this process or accessing this webpage.
var user_email = security.currentUserEmail();

//send a basic email message to that user.
notifications.email(user_email, "no-reply@modlr.co", "Hello", "Hello User");

```
Note: The email is HTML formatted.


#### Sending an SMS to a User
```javascript

//get the current users id (the identifier of the user who is running this process or accessing this webpage.
var userId = security.currentUserId();

//send a basic sms message to that user.
notifications.sms(userId, "Hello. This is a test SMS");

```


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
This creates the following hierarchy.
- All Elements
	- Child Element 01
	- Child Element 02

Note: There is no need to wipe the hierarchy as it will be wiped by the dimension wipe call.


#### Creating a Multi-level Hierarch
```javascript

//reset the hierarchy
hierarchy.wipe(dimName,"Default");

hierarchy.structure(dimName,"Default","EBITDA","Net Sales");
hierarchy.structure(dimName,"Default","EBITDA","Operating Expenditure");

hierarchy.group(dimName,"Default","Net Sales","Gross Sales");
hierarchy.group(dimName,"Default","Net Sales","Cost of Goods Sold");

hierarchy.group(dimName,"Default","Operating Expenditure","General Expenses");
hierarchy.group(dimName,"Default","Operating Expenditure","Office Expenses");
hierarchy.group(dimName,"Default","Operating Expenditure","Salaries and Remuneration");
hierarchy.group(dimName,"Default","Operating Expenditure","Travel");

```
This creates the following hierarchy.
- EBITDA
	- Net Sales
		- Gross Sales
		- Cost of Goods Sold
	- Operating Expenditure
		- General Expenses
		- Office Expenses
		- Salaries and Remuneration
		- Travel

The different functions hierarchy.group and hierarhcy.structure denote the format of the child element. 
- hierarchy.group is used when the child element is a N-Level (a child without children which can hold data). 
- hierarchy.structure is used when adding more structure to the hierarchy (elements which hold other elements as children).

