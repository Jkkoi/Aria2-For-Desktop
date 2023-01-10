const { app, BrowserWindow, Menu } = require('electron')
const childProcess = require('child_process');
const path = require('path')

// const fs = require('fs');
// const files = fs.readdirSync(path.join("resources", "aria2"));
// console.log(files);
// fs.writeFile('input.log', global.process.cwd(), function (err) {
//     if (err) {
//         return console.error(err);
//     }
// });
let aria2cProcess = null;
try {
    const workDir = __dirname.endsWith(".asar")?path.join(__dirname, "..", ".."):__dirname;
    global.process.chdir(workDir)
    aria2cProcess = childProcess.spawn("aria2c.exe",
        ["--conf-path=aria2.conf", "--dir=" + path.join(process.env["USERPROFILE"], "Downloads")],
        {
            cwd: path.join("resources", "aria2"),
            detached: false
        });
    aria2cProcess.stdout.on('data', (data) => {
        console.log(`${data}`)
    });
    aria2cProcess.stderr.on('data', (data) => {
        console.error(`${data}`);
    });

    const createWindow = () => {
        const mainWindow = new BrowserWindow({
            width: 960,
            height: 540,
        })

        mainWindow.loadFile(path.join("resources", "AriaNg", "index.html"))
    }

    app.whenReady().then(() => {
        createWindow()

        app.on('activate', () => {
            if (BrowserWindow.getAllWindows().length === 0) createWindow()
        })

        Menu.setApplicationMenu(null);
    })

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            aria2cProcess.kill();
            app.quit();
        }
    })
} catch (err) {
    console.log(err)
    aria2cProcess?.kill();
    app.quit();
}