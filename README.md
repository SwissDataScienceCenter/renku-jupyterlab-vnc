# renku-jupyterlab-vnc

A JupyterLab extension for VNC.

This extension will not work as a standalone.

It is meant to be used in the Docker image created with [docker/Dockerfile](./docker/Dockerfile#L25).

* This extension creates a menu, palette and a launcher for opening a VNC frame in a Jupyter tab. 
* This extension does not provide a VNC server. The VNC server must be started by the docker container in which this extension is installed.

## Prerequisites

* JupyterLab
* Jupyterlab nbserverproxy

## Installation

In ./docker/Dockerfile

```bash
jupyter labextension install @renku/jupyterlab-vnc
```

## TODO

This was quickly put together for a PoC and not meant to be production-ready.

It requires the minimal novnc, webproxy, openbox, x11vnc, xvfb combo in a docker container, but it should work with other VNC server and windows manager.

The VNC is started before Jupyterlab starts. It uses nbserverproxy to further proxy novnc's 6080 port through Jupyterlab's 8888, which requires some runtime adjustment to properly set the path parameter in the URL. This is currently done in the plugin's settings before starting jupyterlab, which could be better handled with a server extensions.

Opengl will not work with xvfb, you'll probably need xorg if that's what you want.

Ports and resolution are hardcoded.

## Development

For a development install (requires npm version 4 or later), do the following in the repository directory:

```bash
npm install
npm run build
jupyter labextension link .
```

To rebuild the package and the JupyterLab app:

```bash
npm run build
jupyter lab build
```

