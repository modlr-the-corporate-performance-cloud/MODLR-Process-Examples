const userId = "XECOMUserId";
const userPwd = "XECOMUserPassword";
const datasourceName = "Internal Datastore";
const tableName = "datastore.conversion";
/*
# SQL for the conversion table:
CREATE TABLE `conversion` (
  `conversion_id` int(11) NOT NULL AUTO_INCREMENT,
  `from` varchar(3) NOT NULL DEFAULT '',
  `to` varchar(3) NOT NULL DEFAULT '',
  `amount` decimal(19,12) NOT NULL DEFAULT '0.000000000000',
  `mid` decimal(19,12) NOT NULL DEFAULT '0.000000000000',
  `timestamp` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`conversion_id`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=latin1;
*/

function basicAuth(user, password) {
    const credentials = script.base64(`${user}:${password}`, "UTF-8");
    http.headersAdd("Authorization", `Basic ${credentials}`);
}

function convertCurrencies(from, to, amount) {
    basicAuth(userId, userPwd);
    const format = "json";
    const response = http.raw(
        `https://xecdapi.xe.com/v1/convert_from.${format}?from=${from}&to=${to}&amount=${amount}`,
        "GET",
        ""
    );

    if (!response) {
        throw new Error(`Server did not respond`);
    }

    const { error, message, body, code } = JSON.parse(response);
    if (error) {
        // The request could also fail if the credentials are wrong.
        throw new Error(`${error}: ${message}`);
    }

    if (body === null) {
        throw new Error(`Empty response body. Status Code: ${code}`);
    }

    return JSON.parse(body);
}

function toDateTime(jsonDateStr) {
    return new Date(Date.parse(jsonDateStr))
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");
}

function pre() {
    //this function is called once before the processes is executed.
    //Use this to setup prompt	s.
    script.log("process pre-execution parameters parsed.");
}

function begin() {
    //this function is called once at the start of the process
    script.log("process execution started.");

    const fromCurrency = "AUD";
    const toCurrencies = "EUR,GBP,HKD,NZD,USD,SGD,KRW,CNY,PHP";
    const amount = 1;

    const result = convertCurrencies(fromCurrency, toCurrencies, amount);
    const { from } = result;
    const timestamp = toDateTime(result.timestamp);
    result.to.forEach((item) => {
        const to = item.quotecurrency;
        const mid = item.mid;
        const insertId = datasource.insert(
            datasourceName,
            "INSERT INTO " +
                tableName +
                " (`from`, `to`, `amount`, `mid`, `timestamp`) VALUES (?, ?, ?, ?, ?);",
            [from, to, amount, mid, timestamp]
        );
    });
}

function data(record) {
    //this function is called once for each line of data on the second cycle
    //use this to build dimensions and push data into cubes
}

function end() {
    //this function is called once at the end o	f the process
    script.log("process execution finished.");
}
