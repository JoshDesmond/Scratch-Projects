To set up an extension using this template:

1.) npm install
2.) in Webstorm, add the chrome library by going to File | Settings | Languages & Frameworks | JavaScript | Libraries
and looking for options similar to "download community typescript stubs" and getting @types/chrome or something.
3.) use the two build and watch scripts defined in the package.json
4.) note that the rollup-plugin-chrome-extension is a relatively young project made mostly by one
guy, so it might not stay stable forever.
