import {
  Message
} from '@phosphor/messaging';

import {
  Widget
} from '@phosphor/widgets';

import {
  ICommandPalette, InstanceTracker
} from '@jupyterlab/apputils';

import {
  JSONExt
} from '@phosphor/coreutils'

import {
  JupyterLab, JupyterLabPlugin, ILayoutRestorer
} from '@jupyterlab/application';

import {
  ILauncher
} from '@jupyterlab/launcher';

import '../style/index.css';

/**
 * A VNC widget
 */
class X11vncWidget extends Widget {
  constructor() {
    super();

    this.id = 'jupyterlab-vnc';
    this.title.label = 'Desktop';
    this.title.closable = true ;
    this.addClass('jp-vncWidget'); 

    this.vncIFrame = document.createElement('iframe');
    //this.vncIFrame.src=process.env.JUPYTERHUB_SERVICE_PREFIX + '/proxy/6080/vnc_lite.html?path=' + process.env.JUPYTERHUB_SERVICE_PREFIX;
    this.vncIFrame.src='https://epfl.ch';
    this.vncIFrame.className = 'jp-vncIFrame' ;
    this.node.appendChild(this.vncIFrame);
  } 

  readonly vncIFrame : HTMLIFrameElement;

  onUpdateRequest(msg : Message) {
  }
}

/**
 * Acticate X11 VNC Widget
 */
function activate(
  app: JupyterLab,
  palette: ICommandPalette,
  restorer: ILayoutRestorer,
  launcher: ILauncher | null
) {
  console.log('JupyterLab extension jupyterlab-vnc is activated!');
  // Create X11 VNC Widget
  let x11vncWidget: X11vncWidget;

  // Add an application command
  const command: string = 'x11vnc:open';
  app.commands.addCommand(command, {
      label: 'Open',
      execute: () => {
        if (!x11vncWidget) {
          x11vncWidget = new X11vncWidget();
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

  // Track and restore the X11 VNC Widget State
  let tracker = new InstanceTracker<Widget>({ namespace: 'x11vnc' });
  restorer.restore(tracker, {
    command,
    args: () => JSONExt.emptyObject,
    name: () => 'x11vnc'
  });
}


/**
 * Initialization data for the jupyterlab-vnc extension.
 */
const extension: JupyterLabPlugin<void> = {
  id: 'jupyterlab-vnc',
  autoStart: true,
  requires: [ICommandPalette, ILayoutRestorer],
  activate: activate
};

export default extension;
