# shortcut-url

* Takes a passed URL and produces a shortened URL in the JSON response.
* If an invalid URL is passed, the JSON response will contain an error instead.
* When the shortened URL is visited it will redirect you to the original link.

## Examples
### Original URL > Short URL

https://sc-url.herokuapp.com/https://www.freecodecamp.com/challenges/url-shortener-microservice
#### Returns

{ 
"original_url": "https://www.freecodecamp.com/challenges/url-shortener-microservice", 
"short_url": "https://sc-url.herokuapp.com/1wuIW27"
}
