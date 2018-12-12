import {
  Message
} from '@phosphor/messaging';

//import {
//Widget
//} from '@phosphor/widgets';

import {
  ICommandPalette,
  InstanceTracker,
  IInstanceTracker,
  IFrame
} from '@jupyterlab/apputils';

import {
  ISettingRegistry
} from '@jupyterlab/coreutils';

import {
  JSONExt,
  JSONObject,
  Token
} from '@phosphor/coreutils'

import {
  JupyterLab, JupyterLabPlugin, ILayoutRestorer
} from '@jupyterlab/application';

import {
  ILauncher
} from '@jupyterlab/launcher';

import {
  IMainMenu
} from '@jupyterlab/mainmenu';

import '../style/index.css';

/**
 * A VNC widget
 */
class X11vncWidget extends IFrame {
  constructor(url: string) {
     super();
     this.id = 'jupyterlab-vnc';
     this.title.label = 'Desktop';
     this.title.closable = true;
     this.url = url;
     this.addClass('jp-vncWidget'); 
  }

  setUrl(url: string) : void {
     this.url = url ;
  }

  onUpdateRequest(msg : Message) {
  }
}

interface IX11vncTracker extends IInstanceTracker<X11vncWidget> {};
export const IX11vncTracker = new Token<IX11vncTracker>('@renku/jupyterlab-vnc:plugin');

/**
 * Acticate X11 VNC Widget
 */
function activate(
  app: JupyterLab,
  palette: ICommandPalette,
  restorer: ILayoutRestorer,
  menu: IMainMenu,
  settingRegistry: ISettingRegistry,
  launcher: ILauncher | null
) : Promise<IX11vncTracker> {
  console.log('JupyterLab extension jupyterlab-vnc is activated!');
  const id = extension.id;
  // Create X11 VNC Widget
  let x11vncWidget: X11vncWidget;

  // Add an application command
  const command: string = 'x11vnc:open';
  app.commands.addCommand(command, {
      label: 'Open Desktop',
      execute: () => {
        if (!x11vncWidget) {
          x11vncWidget = new X11vncWidget(Private.getUrl());
          x11vncWidget.update();
        }
        if (!tracker.has(x11vncWidget)) {
          // Track the state of the X11 VNC widget
          tracker.add(x11vncWidget);
        }
        if (!x11vncWidget.isAttached) {
          // Attach the widget to the main work area if it's not there
          app.shell.addToMainArea(x11vncWidget);
        } else {
          // Update the widget
          x11vncWidget.update();
        }

        // Activate the widget
        app.shell.activateById(x11vncWidget.id);
      }
  });

  // Add the command to the palette.
  palette.addItem({command, category: 'Desktop'});

  // Add the command to the launcher.
  if (launcher) {
    launcher.add({
      command: command,
      category: 'Other',
      rank: 1
    });
  }

  // Add the command to the main menu
  if (menu) {
    menu.fileMenu.addGroup([{ command: command }], 40);
  }

  // Track and restore the X11 VNC Widget State
  let tracker = new InstanceTracker<X11vncWidget>({ namespace: 'x11vnc' });
  restorer.restore(tracker, {
    command: command,
    args: () => JSONExt.emptyObject,
    name: () => 'x11vnc'
  });

  // Update settings
  function updateSettings(settings: ISettingRegistry.ISettings): void {
    let cached = settings.get('virtualDesktopConfig').composite as JSONObject;
    Private.setUrl(cached['url'] as string); 
    if (x11vncWidget) {
      x11vncWidget.setUrl(Private.getUrl());
    }
    console.log('Settings URL='+(cached['url'] as string));
  }

  // Load settings
  Promise.all([
    settingRegistry.load(id),
    app.restored
  ]).then(([settings]) => {
    updateSettings(settings);
    settings.changed.connect(updateSettings);
  }).catch((reason: Error) => {
    console.error(reason.message);
  });

  return Promise.resolve(tracker);
}


/**
 * Initialization data for the jupyterlab-vnc extension.
 */
const extension: JupyterLabPlugin<IX11vncTracker> = {
  id: '@renku/jupyterlab-vnc:plugin',
  autoStart: true,
  requires: [ICommandPalette, ILayoutRestorer, IMainMenu, ISettingRegistry],
  optional: [ILauncher],
  provides: IX11vncTracker,
  activate: activate
}

namespace Private {
   let VNC_URL : string;

   export function getUrl() : string {
     if (!VNC_URL) {
       let theUrl=window.location.pathname;
       theUrl=theUrl.replace(/lab\/?$/,"");
       VNC_URL=theUrl+'proxy/6080/vnc_lite.html?path='+theUrl+'proxy/6080';
     }
     return VNC_URL;
   }

   export function setUrl(url : string) : void {
     //VNC_URL=url;
   }
}

export default extension;

