import { app, BrowserWindow, shell, ipcMain } from 'electron'
import { release } from 'os'
import { join } from 'path'
import { JSONFile } from '@commonify/lowdb/lib/adapters/JSONFile'
import { Low } from '@commonify/lowdb'
import type { Properties, Resize, DatabaseData } from '../../src/preload'

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
        name: "Games",
        categories: [
          {
            name: "Status",
            icon: "ph:spinner-bold",
            options: [
              { value: 'None', icon: 'fluent:border-none-24-filled' },
              { value: 'Not Started', icon: 'fluent:record-stop-12-filled', bg: 'opposite' },
              { value: 'Dropped', icon: 'fluent:drop-12-filled', bg: '#EF4444' },
              { value: 'Paused', icon: 'fluent:pause-12-filled', bg: '#EAB308' },
              { value: 'Completed', icon: 'fluent:checkmark-circle-12-filled', bg: '#22C55E' }
            ]
          },
          {
            name: "Platform",
            icon: "fluent:laptop-16-regular",
            options: [
              { value: 'None', icon: 'fluent:border-none-24-filled' },
              { value: 'Windows', icon: 'ri:windows-fill', bg: '#00A4EF' },
              { value: 'Nintendo Switch', icon: 'ri:switch-fill', bg: '#DD2020' },
              { value: 'Xbox', icon: 'ri:xbox-fill', bg: '#107C10' },
              { value: 'PlayStation', icon: 'ri:playstation-fill', bg: '#006FCD' }
            ]
          }
        ],
        cards: [
          {
            name: 'Unpacking', image: 'https://howlongtobeat.com/games/69666_Unpacking_(2021).jpg', tags: [
              { type: 'status', value: "Completed" },
              { type: 'platform', value: "Windows" },
            ], added: 1671835908, updated: 1673624379
          },
          {
            name: 'Animal Crossing: New Horizons', image: 'https://howlongtobeat.com/games/68240_Animal_Crossing_New_Horizons.jpg', tags: [
              { type: 'status', value: "Paused" },
              { type: 'platform', value: "Nintendo Switch" },
            ], added: 23345340, updated: 3452340
          },
          {
            name: 'Elden Ring', image: 'https://howlongtobeat.com/games/68151_Elden_Ring.jpg', tags: [
              { type: 'status', value: "Not Started" },
              { type: 'platform', value: "PlayStation" },
            ], added: 452540, updated: 353453250
          },
          {
            name: 'Dragon Quest XI: Echoes of an Elusive Age: Definitive Edition', image: 'https://howlongtobeat.com/games/39508_Dragon_Quest_XI_In_Search_of_Departed_Time.jpg', tags: [
              { type: 'status', value: "Completed" },
              { type: 'platform', value: "Windows" },
            ], added: 1626457604, updated: 1671835908
          },
          {
            name: 'Cyberpunk 2077', image: 'https://howlongtobeat.com/games/Cyberpunk-2077-2.jpg', tags: [
              { type: 'status', value: "Dropped" },
              { type: 'platform', value: "Windows" },
            ], added: 23542350, updated: 523542350
          },
          {
            name: 'Rocket League', image: 'https://howlongtobeat.com/games/Rocket_League_header.jpg', tags: [
              { type: 'status', value: "Paused" },
              { type: 'platform', value: "Xbox" },
            ], added: 3452345520, updated: 34523450
          },
        ]
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
    win?.webContents.send('page-message', "Finished loading!")
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