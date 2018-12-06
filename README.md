# renku-jupyterlab-vnc

A JupyterLab extension for VNC.

This extension will not work as a standalone. 

It is designed to be installed in the Docker image created by docker/Dockerfile.


## Prerequisites

* JupyterLab

## Installation

In ./docker/Dockerfile

```bash
jupyter labextension install @renku/jupyterlab-vnc
```

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

