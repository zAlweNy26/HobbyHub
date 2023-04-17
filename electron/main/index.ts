import { app, BrowserWindow, shell, ipcMain, dialog } from 'electron'
import { release } from 'os'
import { writeFile, readFileSync } from 'fs'
import { join } from 'path'
import localShortcut from 'electron-localshortcut'
import { JSONFile } from '@commonify/lowdb/lib/adapters/JSONFile'
import { Low } from '@commonify/lowdb'
import type { Properties, Resize, DatabaseData } from '../../src/preload'
import { parseDb, isValid, reportDb } from '../../src/preload'

process.env.DIST_ELECTRON = join(__dirname, '..')
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist')
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL ? join(process.env.DIST_ELECTRON, '../public') : process.env.DIST

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

const adapter = new JSONFile<DatabaseData>(join(app.getPath("userData"), 'db.json'))
const db = new Low(adapter)

let win: BrowserWindow | null = null
const preload = join(__dirname, '../preload/index.js')
const url = process.env.VITE_DEV_SERVER_URL
const indexHtml = join(process.env.DIST, 'index.html')

async function createWindow() {
  win = new BrowserWindow({
    title: 'HobbyHub',
    icon: join(process.env.PUBLIC, 'favicon.ico'),
    backgroundColor: "#27272A",
    minWidth: 500,
    minHeight: 500,
    width: 1280,
    height: 720,
    center: true,
    frame: false,
    useContentSize: true,
    webPreferences: {
      preload,
      spellcheck: false
    },
  })

  win.removeMenu()

  await db.read()

  db.data ||= {
    current: 0,
    sections: [
      {
        name: "Template",
        categories: [],
        cards: []
      }
    ]
  }

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(url)
    win.webContents.openDevTools({ mode: "detach", activate: false })
  } else {
    win.loadFile(indexHtml)
  }

  win.webContents.on('did-finish-load', () => {
    win.webContents.send('page-message', "Finished loading!")
    win.webContents.send('zoom-change', win.webContents.zoomFactor)
  })

  localShortcut.register(win, 'CommandOrControl+A', () => {
    win.webContents.send('add-card')
  })

  localShortcut.register(win, 'CommandOrControl+S', () => {
    win.webContents.send('save-card')
  })

  localShortcut.register(win, 'CommandOrControl+P', () => {
    const zoom = Math.max(0.1, Math.min(2, win.webContents.zoomFactor + 0.1))
    win.webContents.setZoomFactor(zoom)
    win.webContents.send('zoom-change', zoom)
  })

  localShortcut.register(win, 'CommandOrControl+M', () => {
    const zoom = Math.max(0.1, Math.min(2, win.webContents.zoomFactor - 0.1))
    win.webContents.setZoomFactor(zoom)
    win.webContents.send('zoom-change', zoom)
  })

  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })

  win.on("resize", () => {
    const winSize = win.getSize()
    const obj = {
      isMaximized: win.isMaximized(),
      size: {
        width: winSize[0],
        height: winSize[1]
      }
    } satisfies Resize
    win.webContents.send('resize-win', JSON.stringify(obj))
  })

  ipcMain.handle('get-db', () => {
    return db.data
  })

  ipcMain.handle('save-db', (_, arg) => {
    db.data = arg as DatabaseData
  })

  ipcMain.handle('import-db', async () => {
    const { filePaths, canceled } = await dialog.showOpenDialog({
      defaultPath: process.env.HOME,
      filters: [
        { name: "Database file", extensions: ["json"] }
      ]
    })
    if (filePaths && !canceled) {
      const data = readFileSync(filePaths[0], 'utf-8')
      const decoded = parseDb(JSON.parse(data))
      if (isValid(decoded)) return decoded.right
      else console.error(reportDb(decoded).join("\n"))
    }
    return undefined
  })

  ipcMain.handle('export-db', async (_, arg) => {
    const { filePath, canceled } = await dialog.showSaveDialog({
      defaultPath: join(process.env.HOME, 'HobbyHub_Database.json'),
      filters: [
        { name: "Database file", extensions: ["json"] }
      ]
    })
    if (filePath && !canceled) {
      writeFile(filePath, arg, 'utf-8', (err) => {
        if (err) throw err
      })
    }
  })

  ipcMain.handle('set-zoom', (_, arg) => win.webContents.setZoomFactor(arg / 100))
  
  ipcMain.handle('win-properties', () => {
    const winSize = win.getSize()
    const properties = {
      zoom: win.webContents.zoomFactor,
      isMaximized: win.isMaximized(),
      isMinimized: win.isMinimized(),
      title: win.title,
      size: {
        width: winSize[0],
        height: winSize[1]
      }
    } satisfies Properties & Resize
    return properties
  })
  
  ipcMain.handle('minimize-win', () => win.minimize())
  
  ipcMain.handle('maximize-win', () => win.maximize())

  ipcMain.handle('unmaximize-win', () => win.unmaximize())

  ipcMain.handle('close-win', () => win.close())
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
  if (win) {
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})

ipcMain.handle('open-win', (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload
    },
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${url}#${arg}`)
  } else {
    childWindow.loadFile(indexHtml, { hash: arg })
  }
})