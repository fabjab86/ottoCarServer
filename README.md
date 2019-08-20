# </a>Otto Car Server

[Test case scenario](#testcase) |
[How to use](#howto)|
[Test](#test) |
[Code Requirements](#reqs)|
[Sample Views](#sample) <br>

### Introduction  
This is a RESTFUL API web service built with node, using a Postgres database that is hosted on aws.  

### <a name="testcase"></a>Test Case Scenario :

**/cars**  endpoint  
**Case 1** Can add a car with Make Model Year Active properties    
**Case 2** Can update a car properties  
**Case 3** Can delete a car  
**Case 5** Can view all cars  

**/stats** endpoint  
**Case 1** Can get all stats for cars and all successful HTTP calls    

### <a name="howto"></a>How to use :
#### Requirement  
_Step 1_  
`git clone git@github.com:fabjab86/ottoCarServer.git`  
_Step 2_  
From the command line type `npm start`  
_Step 3_
You can interact with the server via postman or the client on [otto-car-client](https://github.com/fabjab86/otto-car-client)
### <a name="test"></a>How to test :
Regretfully there are no tests at the moment.  

### <a name="reqs"></a>Code Requirement :

#### Back End

The back-end must include a web server with two endpoints: /cars (for cars) and /stats (for statistics on cars and HTTP requests).

The first endpoint, /cars, must accept HTTP requests sent using CRUD methods (GET, POST, PUT, DELETE) and respond back with JSON describing the status of the request (success, failed, etc).

This is the information we store about each car:

Make (e.g. Tesla)
Model (e.g. Model 3)
Year (e.g. 2019)
Active (i.e. true/false)
The second endpoint, /stats, must respond with the following real time statistics:

Total number of cars added
Total number of active cars and inactive cars
Active number of HTTP requests sent to the server, classified by HTTP method (eg: 3 GET requests, 4 POST requests, 5 PUT requests)



### <a name="sample"></a>Sample Views :


