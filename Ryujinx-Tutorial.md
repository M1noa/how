


# How to Install and Setup Ryujinx for Tomodachi Life: Living the Dream

Before starting, it is highly recommended to install an adblocker if you do not already have one. [uBlock](https://ublockorigin.com/) is a great.

## Step 1: Download the Required Files

You will need the emulator, the system files, and the game files. Gather all of these before moving on.

1. **Ryujinx Emulator:** Download the proper version for your operating system from the [Ryubing Canary Releases](https://git.ryujinx.app/Ryubing/Canary/releases).
   * Windows users: Download the file ending in `win_x64.zip`.
   * Mac users: Download the file ending in `macos_universal.app.tar.gz`.
2. **Prod Keys:** Download the latest prod keys from [ProdKeys.net](https://prodkeys.net/ryujinx-prod-keys-update/).
3. **Firmware:** Download the latest Switch firmware zip file from the [THZoria Firmware Releases](https://github.com/THZoria/NX_Firmware/releases/latest). Look under the "Assets" dropdown for the zip file.
4. **Game ROMs:** Download both the base game and the update file.
   * Base Game (v0): [Download Here](https://litter.minoa.cat/files/976b9r/Tomodachi%20Life%20Living%20the%20Dream%20%5B010051F0207B2000%5D%5Bv0%5D.nsp)
   * Update File (v1.0.1): [Download Here](https://litter.minoa.cat/files/enzoqok8l/Tomodachi%20Life%20Living%20the%20Dream%20%5B010051F0207B2800%5D%5Bv65536%5D.nsp)

## Step 2: Install Ryujinx

**For Windows:**
Extract the downloaded `.zip` file to a location of your choice (like your Desktop or a Games folder). Open the folder and double-click `Ryujinx.exe` to launch it.

**For Mac:**
Double click the `.tar.gz` file. Drag the extracted `Ryujinx.app` into your Applications folder. Before opening it, you need to clear Apple's quarantine flag. Open the Terminal app (Command+Space then type in "Terminal") and run the following command:
`xattr -cr /Applications/Ryujinx.app`
After running this, you can launch Ryujinx from your Applications folder via double clicking.

## Step 3: Initial System Setup

When you first open Ryujinx, you will get a "Keys not found" error. This is completely normal. Click OK to dismiss it.

1. **Install Keys:** First, extract the Prod Keys zip file you downloaded. In Ryujinx, go to the top menu bar and click Actions > Install Keys > Install Keys (Folder). Navigate to your extracted keys folder and select it. 
2. **Install Firmware:** Go to the top menu bar and click Actions > Install Firmware > Install Firmware (.XCI or .ZIP). Locate the Firmware zip file you downloaded earlier and select it. Confirm the installation when prompted.

**Mac Troubleshooting Note:** When clicking these menu options on a Mac, you might occasionally get a spinning pinwheel. If this happens, do not click outside of the Ryujinx window. Just wait patiently. Eventually, the file browser will open, or the pinwheel will disappear. If the pinwheel goes away without opening the file browser, simply click the menu option one more time and it should open right up.

## Step 4: Adding and Updating the Game

Create a dedicated folder on your computer for your Switch ROMs (for example, inside your Documents folder). Move both the base game and the update file into this folder. 

> Note: Do not delete this folder or move the files after setting this up, as doing so will remove the games from your emulator. (your saves will stay)

1. **Add the Game Directory:** In Ryujinx, go to Options > Settings. Under the General tab, look for Game Directories and click Add. Select the folder where you put your game files and click Save. The game should now appear in your main Ryujinx window.
2. **Apply the Update:** 
   * Right-click Tomodachi Life: Living the Dream in your game list.
   * Select Manage Title Updates.
   * Click the Add button.
   * Navigate to your game folder and select the update file (the one ending in `[v65536].nsp`).
   * Select the new Version 1.0.1 from the list and click Save.

## Step 5: Configuring Inputs

Go to Options > Settings > Input. Under Player 1, click Configure.

* **Input Device:** Select your controller from the dropdown menu.
* **Controller Type:** Pro Controller is recommended for most games.
* **Keyboard vs Controller:** You can select "All keyboards" if you want to play with your keyboard, but it is highly recommended to use a dedicated controller (like an Xbox, PlayStation, or Switch controllers) for a much better experience. Map your buttons by clicking the boxes and pressing the corresponding button on your device. Click Save when done.

## Step 6: Optimal Settings Explained

Go to Options > Settings to configure the emulator for the best performance. Here is a breakdown of what the settings do and how you should configure them.

### System Tab
* **VSync / Custom Refresh Rate:** For 60fps set to 200%, for 30fps (normal) set to 100% (if playing on a laptop, id do ~130%)
* **DRAM Size:** This allocates memory to the emulator. **Set this to 4GiB.** (if you dont mind using more ram 6GiB wouldn't hurt)

### CPU Tab
* **Memory Manager Mode:** **Set this to Host Unchecked (Fastest, Unsafe).** This is the most optimized path for performance.
* **PPTC (Profiled Persistent Translation Cache):** **Turn this on.** It saves translated code to your drive so the game loads and runs much faster on all future launches.
* **Use Hypervisor (Mac Only):** **Turn this on.** This allows Apple Silicon chips to run the game's ARM code natively, providing a massive performance boost and keeping your Mac cooler.

### Graphics Tab
* **Graphics Backend:** **Set this to Vulkan.** (unless you have an older GPU)
* **Enable Shader Cache:** **Turn this on.** It saves shaders to your drive as you play so the game doesn't stutter when loading new visual effects.
* **Enable Texture Recompression:** 
  * *Mac Users:* **Turn this on.** Macs use unified memory, and this setting saves a massive amount of RAM, which prevents out-of-memory crashes.
  * *Windows Users:* **Turn this off** unless your graphics card is older and has less than 4GB of VRAM.
* **Resolution Scale:** **Set to Native (720p/1080p)** for the most stable performance.
* **Anti-Aliasing & Scaling Filter:** **Set Anti-Aliasing to None** and **Scaling Filter to Bilinear** for the best framerates.
* **Anisotropic Filtering:** **Set to 2x** for Mac, or **16x** for Windows (if your PC is powerful enough).
* **Graphics Backend Multithreading:** **Set to On** to force the emulator to utilize multiple CPU cores.

### Network Tab
* If you want to use local multiplayer features over the internet with other Ryujinx users, **set Mode to RyuLDN** and **turn on Guest Internet Access/LAN Mode**. 
* If you are just playing single-player, **set Mode to Disabled**. Turning the network off stops the emulator from constantly searching for other players in the background, which saves performance.

### A Quick Note for Mac Users
If you are playing on an M-series MacBook Air (which has no internal fan), the computer will get quite toasty during gameplay. It runs perfectly fine with 8GB of RAM, but it is highly recommended to play with the laptop resting on a surface that transfers heat well, like a metal stand or a wooden desk, rather than a bed or blanket.

## Step 7: Save Files
Your game saves are not stored in the folder with your ROMs. They are stored safely inside the Ryujinx system files. If you ever need to back up your save or transfer it to another computer, simply right-click the game in Ryujinx and select Open User Save Directory.

You are now ready to play! Double-click the game in your list to start. When first playing you will notice it stuttering a lot as it compiles shaders (you will only have to do this once per scene/place, then it will be a smooth experience).
