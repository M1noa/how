# How to Install Ryujinx for Tomodachi Life: Living the Dream

Before starting, get an adblocker if you don't have one. [uBlock](https://ublockorigin.com/) is great.

### Step 1: Downloads
Gather these files before moving on:
* **Ryujinx Emulator:** [Download here](https://git.ryujinx.app/Ryubing/Canary/releases). Get the newest version for your computer, `ryujinx-canary-X.X.XXX-win_x64.zip` for Windows or `ryujinx-canary-X.X.XXX-macos_universal.app.tar.gz` for Mac.
* **Prod Keys:** [Download the newest version from here](https://prodkeys.net/ryujinx-prod-keys-update/).
* **Firmware:** [Download the latest version from here](https://github.com/THZoria/NX_Firmware/releases/latest).
* **Game Files:** Download the [Base Game (v0)](https://litter.minoa.cat/files/976b9r/Tomodachi%20Life%20Living%20the%20Dream%20%5B010051F0207B2000%5D%5Bv0%5D.nsp) and the [Update File (v1.0.1)](https://litter.minoa.cat/files/enzoqok8l/Tomodachi%20Life%20Living%20the%20Dream%20%5B010051F0207B2800%5D%5Bv65536%5D.nsp). (will update this page as new versions come out)

### Step 2: Install Ryujinx
* **Windows:** Extract the `.zip` file to a folder like your Desktop. Double-click `Ryujinx.exe` to launch.
* **Mac:** Extract the `.tar.gz` file and drag `Ryujinx.app` into your Applications folder. Open Terminal (Cmd+Space, type "Terminal") and run this command to clear Apple's security block:
`xattr -cr /Applications/Ryujinx.app`
Then double-click the app in your Applications folder to open it.

### Step 3: Keys & Firmware
Ignore the "Keys not found" error when you first open the app.
1. **Keys:** Extract your downloaded Prod Keys zip. In Ryujinx, go to Actions > Install Keys > Install Keys (Folder) and select the extracted folder.
2. **Firmware:** Go to Actions > Install Firmware > Install Firmware (.XCI or .ZIP) and select the Firmware zip file. Confirm the install.

*Mac Note: If you get a spinning pinwheel clicking these menus, just wait. If it disappears without opening a window, click the menu option again.*

### Step 4: Add the Game
Put your base game and update file in a dedicated folder (like Documents/Switch ROMs). Do not delete this folder later or you will lose your game.
1. **Add folder:** Go to Options > Settings > General. Under Game Directories, click Add, select your game folder, and click Save. The game will appear in the main window.
2. **Update:** Right-click the game > Manage Title Updates > Add. Select the update file (`[v65536].nsp`), choose version 1.0.1 from the list, and click Save.

### Step 5: Controls
Go to Options > Settings > Input. Under Player 1, click Configure.
Select your controller from the dropdown (Pro Controller type is recommended). Map your buttons and save. You can use a keyboard, but a real controller is much better.

### Step 6: Optimal Settings
Go to Options > Settings. Use these values for the best performance:

**System**
* VSync / Custom Refresh Rate: 100% for normal 30fps. 200% for 60fps. (Laptop users should try ~130%).
* DRAM Size: 4GiB (6GiB is fine if you have RAM to spare).

**CPU**
* Memory Manager Mode: Host Unchecked (Fastest, Unsafe).
* PPTC: On (makes future loading much faster).
* Use Hypervisor (Mac only): On (huge performance boost).

**Graphics**
* Graphics Backend: Vulkan.
* Enable Shader Cache: On.
* Enable Texture Recompression: On for Mac (prevents crashes). Off for Windows (unless you have an older GPU).
* Resolution Scale: Native (720p/1080p).
* Anti-Aliasing: None.
* Scaling Filter: Bilinear.
* Anisotropic Filtering: 2x for Mac, 16x for Windows.
* Graphics Backend Multithreading: On.

**Network**
* Multiplayer: Mode = RyuLDN, check Guest Internet Access/LAN Mode.
* Single-player: Mode = Disabled (saves performance).

*Mac Heat Warning: MacBook Airs will get warm since they don't have fans. Play on a hard surface like a wood or metal desk, not a bed or blanket.*

### Step 7: Play
Double-click the game to start. It will stutter at first while it compiles shaders, but it will smooth out completely once you explore a bit. 

*(Note: Your saves are stored internally. To back them up, right-click the game and select Open User Save Directory).*
