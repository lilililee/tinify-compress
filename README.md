# Tinify-compress

Tinify-compress is a plugin that using tinypng api to compress pictures( jpg or png ).

# Installation

```javascript
npm install -D tinify-compress
```

# Usage

```javascript
// package.json
"scripts": {
    "tinify": "tinify-compress --s ./images --key your_tinypng_api_key"
}
// terminal
npm run tinify
```

# Config

--s 		  [ Source file path ] 

--d  		  [ Dist file path (The default is equal to --s) ]

--key	  [ Tinypng  api key , apply link:  https://tinypng.com/developers ] 
