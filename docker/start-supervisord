#!/usr/bin/env bash
main() {
    #set -euC
    set -x
    local -r JUPYTERLAB_DIR=$(jupyter lab path|sed -En 's/Application directory: *(.*)/\1/p')
    local -r PLUGIN_CONFIG="${JUPYTERLAB_DIR}/schemas/@renku/jupyterlab-vnc/plugin.json"
    local -r VNC_URL="${JUPYTERHUB_SERVICE_PREFIX:-FIXME}/proxy/6080/vnc_lite.html?path=${JUPYTERHUB_SERVICE_PREFIX:-FIXME}/proxy/6080/"
    if [[ -e "${PLUGIN_CONFIG}" ]]; then
        sudo sed -E -i.bak 's/https:..datascience.ch/'"${VNC_URL//\//\\\/}"'/g' "${PLUGIN_CONFIG}"
    else
        echo "${PLUGIN_CONFIG} -- ${VNC_URL}" > /tmp/log_VNC_URL.txt
    fi
    sudo start-stop-daemon --start --quiet --startas /usr/bin/supervisord --pidfile /var/run/supervisord.pid -- -c /etc/supervisor/supervisord.conf
}

(main "$@") >/tmp/startup.log 2>&1
