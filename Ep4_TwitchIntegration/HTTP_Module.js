//Declare our HTTP Module
var HTTP = {
	//Declare our get function
	get: function(url) {
		//Load our Java classes
		var URL = java.net.URL;
		var HttpURLConnection = java.net.HttpURLConnection;
		var BufferedReader = java.io.BufferedReader;
		var DataOutputStream = java.io.DataOutputStream;
		var InputStreamReader = java.io.InputStreamReader;
		 
		//Load the url
		var obj = new URL(url);
		//Open a new connection to the URL
		var con = obj.openConnection();
		
		//Set the request method to GET
		con.setRequestMethod("GET");
		//Pretend we are a Mozilla browser (for compatibility reasons)
		con.setRequestProperty("User-Agent", "Mozilla/5.0");
		 
		//Get a response code
		var responseCode = con.getResponseCode();
		 
		//If we get a valid response
		if(responseCode == 200) {
			//Open the input stream
			var input = new BufferedReader(new InputStreamReader(con.getInputStream()));
			var inputLine;
			var response = "";
			
			//Read the whole stream into the response variable
			while ((inputLine = input.readLine()) != null) {
				response = response + (inputLine);
			}
			
			//Close the stream, we are done with it.
			input.close();
			
			//Return the response.
			return response;
		} else {
			//If it failed, return the response code
			return responseCode;
		}
	}	
}

//Store the module in the temp data
world.setTempData("HTTP", HTTP);