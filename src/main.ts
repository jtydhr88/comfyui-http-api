import { app } from "../../../scripts/app.js";
import { api } from "../../../scripts/api.js";
import { ComfyApp } from '@comfyorg/comfyui-frontend-types'

import { addWidget, ComponentWidgetImpl } from "../../../scripts/domWidget.js";

const comfyApp: ComfyApp = app;

comfyApp.registerExtension({
  name: 'Comfy.FetchApi',

  async nodeCreated(node) {
	if (node.constructor.comfyClass !== 'FetchApi') return

    const onExecuted = node.onExecuted
    //const msg = t('toastMessages.unableToFetchFile')

    const downloadFile = async (
      typeValue: string,
      subfolderValue: string,
      filenameValue: string
    ) => {
      try {
        let actualSubfolder = subfolderValue;
        let actualFilename = filenameValue;

        const lastSlashIndex = filenameValue.lastIndexOf('/');
        if (lastSlashIndex !== -1) {
          const filenamePath = filenameValue.substring(0, lastSlashIndex);
          actualFilename = filenameValue.substring(lastSlashIndex + 1);

          if (subfolderValue && subfolderValue.trim() !== '') {
            actualSubfolder = subfolderValue + '/' + filenamePath;
          } else {
            actualSubfolder = filenamePath;
          }
        }

        actualSubfolder = actualSubfolder.replace(/\/+/g, '/').replace(/^\/|\/$/g, '');

        const params = [
          'filename=' + encodeURIComponent(actualFilename),
          'type=' + encodeURIComponent(typeValue),
          'subfolder=' + encodeURIComponent(actualSubfolder),
          app.getRandParam().substring(1)
        ].join('&')

        const fetchURL = `/view?${params}`
        const response = await api.fetchApi(fetchURL)

        if (!response.ok) {
          console.error(response)
          console.error("Unable to fetch file")
          alert("Unable to fetch file")
          return false
        }

        const blob = await response.blob()
        const downloadFilename = filenameValue.includes('/') ?
          filenameValue.replace(/\//g, '_') :
          filenameValue;

        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.download = downloadFilename

        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)

        window.URL.revokeObjectURL(url)

        return true
      } catch (error) {
        console.error(error)
        //useToastStore().addAlert(msg)
        console.error("Unable to fetch file")
        alert("Unable to fetch file")
        return false
      }
    }

    const type = node.widgets?.find((w) => w.name === 'type')
    const subfolder = node.widgets?.find((w) => w.name === 'subfolder')
    const filename = node.widgets?.find((w) => w.name === 'filename')

    node.onExecuted = function (message: any) {
      onExecuted?.apply(this, arguments as any)

      const typeInput = message.result[0]
      const subfolderInput = message.result[1]
      const filenameInput = message.result[2]
      const autoDownload = node.widgets?.find((w) => w.name === 'auto_download')

      if (type && subfolder && filename) {
        type.value = typeInput
        subfolder.value = subfolderInput
        filename.value = filenameInput

        if (autoDownload && autoDownload.value) {
          downloadFile(typeInput, subfolderInput, filenameInput)
        }
      }
    }

    node.addWidget('button', 'download', 'download', async () => {
      if (type && subfolder && filename) {
        await downloadFile(
          type.value as string,
          subfolder.value as string,
          filename.value as string
        )
      } else {
        console.error("Unable to fetch file")
        alert("Unable to fetch file")
        //useToastStore().addAlert(msg)
      }
    })
  }
})