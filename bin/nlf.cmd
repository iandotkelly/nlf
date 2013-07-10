@IF EXIST "%~dp0\node.exe" (
	:: run with the local node if it exists
	"%~dp0\node.exe" "%~dp0\.\nlf-cli.js" %*
) ELSE {
	:: run with the node in the path
	node "%~dp0\.\nlf-cli.js" %*
}